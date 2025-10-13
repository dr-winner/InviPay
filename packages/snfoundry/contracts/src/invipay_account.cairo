#[starknet::contract(account)]
pub mod InviPayAccount {
    use starknet::{ContractAddress, get_block_timestamp};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::traits::{Into};
    use super::super::username_registry::IUsernameRegistryDispatcher;
    use super::super::username_registry::IUsernameRegistryDispatcherTrait;

    #[storage]
    struct Storage {
        signer_public_key: felt252,
        username_registry_address: ContractAddress,
        guardian_set: Map<ContractAddress, bool>,
        paymaster_whitelist: Map<ContractAddress, bool>,
        is_locked: bool,
        recovery_in_progress: bool,
        recovery_proposed_key: felt252,
        recovery_initiated_at: u64,
        recovery_delay_secs: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        SignerKeyUpdated: SignerKeyUpdated,
        RecoveryInitiated: RecoveryInitiated,
        RecoveryFinalized: RecoveryFinalized,
        PaymasterWhitelisted: PaymasterWhitelisted,
        PaymasterRemoved: PaymasterRemoved,
        AccountLocked: AccountLocked,
        AccountUnlocked: AccountUnlocked,
        UsernameLinked: UsernameLinked,
    }

    #[derive(Drop, starknet::Event)]
    struct SignerKeyUpdated { old_key: felt252, new_key: felt252 }
    #[derive(Drop, starknet::Event)]
    struct RecoveryInitiated { new_key: felt252, initiated_at: u64, delay: u64 }
    #[derive(Drop, starknet::Event)]
    struct RecoveryFinalized { new_key: felt252 }
    #[derive(Drop, starknet::Event)]
    struct PaymasterWhitelisted { paymaster: ContractAddress }
    #[derive(Drop, starknet::Event)]
    struct PaymasterRemoved { paymaster: ContractAddress }
    #[derive(Drop, starknet::Event)]
    struct AccountLocked {}
    #[derive(Drop, starknet::Event)]
    struct AccountUnlocked {}
    #[derive(Drop, starknet::Event)]
    struct UsernameLinked { username: ByteArray, account: ContractAddress }

    // Simple signature verifier placeholder: hash(calldata) ^ signer_public_key == signature
    // Replace with proper scheme in production.
    fn is_valid_signature(stored_key: felt252, calldata_hash: felt252, signature: felt252) -> bool {
        // placeholder: signature must equal stored_key + calldata_hash
        signature == stored_key + calldata_hash
    }

    fn hash_calldata(calldata: Array<felt252>) -> felt252 {
        let mut h: felt252 = 0;
        let span = calldata.span();
        let mut idx = 0;
        let len = span.len();
        while idx < len {
            let v = *span.at(idx);
            h = h + v;
            idx = idx + 1;
        }
        h
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        initial_signer_key: felt252,
        username_registry_address: ContractAddress,
        initial_username: ByteArray,
        guardians: Array<ContractAddress>,
        recovery_delay_secs: u64,
    ) {
        self.signer_public_key.write(initial_signer_key);
        self.username_registry_address.write(username_registry_address);
        let gspan = guardians.span();
        let mut i = 0;
        let n = gspan.len();
        while i < n {
            let g = *gspan.at(i);
            self.guardian_set.write(g, true);
            i = i + 1;
        }
        self.recovery_delay_secs.write(recovery_delay_secs);
        self.is_locked.write(false);

        let reg = IUsernameRegistryDispatcher { contract_address: username_registry_address };
        reg.link_username(initial_username.clone(), starknet::get_contract_address());
        self.emit(UsernameLinked { username: initial_username, account: starknet::get_contract_address() });
    }

    // __validate__(calldata, signature, maybe_paymaster)
    #[external(v0)]
    fn __validate__(self: @ContractState, calldata: Array<felt252>, signature: felt252, maybe_paymaster: Option<ContractAddress>) -> felt252 {
        if self.is_locked.read() { panic!("ACCOUNT_LOCKED"); }

        // if sponsored, ensure paymaster is whitelisted; if not sponsored, ensure no paymaster
        match maybe_paymaster {
            Option::Some(pm) => {
                if self.paymaster_whitelist.read(pm) != true { panic!("PAYMASTER_NOT_ALLOWED"); }
            },
            Option::None => {},
        }

        let calldata_hash = hash_calldata(calldata);
        let key = self.signer_public_key.read();
        if !is_valid_signature(key, calldata_hash, signature) {
            panic!("INVALID_SIGNATURE");
        }
        0
    }

    // __execute__ standard multi-call
    #[external(v0)]
    fn __execute__(ref self: ContractState) {}

    // Key management
    #[external(v0)]
    fn update_signer_key(ref self: ContractState, new_key: felt252, signature_from_old_key: felt252) {
        let old = self.signer_public_key.read();
        let hash = new_key + 1;
        if !is_valid_signature(old, hash, signature_from_old_key) {
            panic!("INVALID_ROTATE_SIG");
        }
        self.signer_public_key.write(new_key);
        self.emit(SignerKeyUpdated { old_key: old, new_key });
    }

    // Guardian management
    #[external(v0)]
    fn add_paymaster(ref self: ContractState, paymaster: ContractAddress) {
        self.paymaster_whitelist.write(paymaster, true);
        self.emit(PaymasterWhitelisted { paymaster });
    }

    #[external(v0)]
    fn remove_paymaster(ref self: ContractState, paymaster: ContractAddress) {
        self.paymaster_whitelist.write(paymaster, false);
        self.emit(PaymasterRemoved { paymaster });
    }

    #[external(v0)]
    fn lock(ref self: ContractState) { self.is_locked.write(true); self.emit(AccountLocked {}); }
    #[external(v0)]
    fn unlock(ref self: ContractState) { self.is_locked.write(false); self.emit(AccountUnlocked {}); }

    // Social recovery (2-of-3 style via array of signer guardians supplied to this tx)
    #[external(v0)]
    fn initiate_recovery(ref self: ContractState, new_signer_key: felt252, guardian_signers: Array<ContractAddress>) {
        // require >=2 guardians present in set
        let mut valid: felt252 = 0;
        let span = guardian_signers.span();
        let mut i = 0;
        let n = span.len();
        while i < n {
            let g = *span.at(i);
            if self.guardian_set.read(g) { valid = valid + 1; }
            i = i + 1;
        }
        if valid == 0 || valid == 1 { panic!("INSUFFICIENT_GUARDIANS"); }
        self.recovery_proposed_key.write(new_signer_key);
        let now = get_block_timestamp();
        self.recovery_initiated_at.write(now);
        self.recovery_in_progress.write(true);
        self.emit(RecoveryInitiated { new_key: new_signer_key, initiated_at: now, delay: self.recovery_delay_secs.read() });
    }

    #[external(v0)]
    fn finalize_recovery(ref self: ContractState) {
        if !self.recovery_in_progress.read() { panic!("NO_RECOVERY"); }
        let now = get_block_timestamp();
        let started = self.recovery_initiated_at.read();
        let delay = self.recovery_delay_secs.read();
        if now < started + delay { panic!("RECOVERY_DELAY_NOT_PASSED"); }
        let new_key = self.recovery_proposed_key.read();
        self.signer_public_key.write(new_key);
        self.recovery_in_progress.write(false);
        self.emit(RecoveryFinalized { new_key });
    }
}

