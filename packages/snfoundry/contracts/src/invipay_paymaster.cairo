#[starknet::contract]
pub mod InviPayPaymaster {
    use starknet::{ContractAddress};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        treasury: felt252,
        whitelisted_accounts: Map<ContractAddress, bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PaidForFee: PaidForFee,
        Whitelisted: Whitelisted,
        Removed: Removed,
        Funded: Funded,
    }

    #[derive(Drop, starknet::Event)]
    struct PaidForFee { account: ContractAddress, amount: felt252 }
    #[derive(Drop, starknet::Event)]
    struct Whitelisted { account: ContractAddress }
    #[derive(Drop, starknet::Event)]
    struct Removed { account: ContractAddress }
    #[derive(Drop, starknet::Event)]
    struct Funded { amount: felt252 }

    #[constructor]
    fn constructor(ref self: ContractState, initial_treasury: felt252) {
        self.treasury.write(initial_treasury);
        self.emit(Funded { amount: initial_treasury });
    }

    #[external(v0)]
    fn whitelist_account(ref self: ContractState, account: ContractAddress) {
        self.whitelisted_accounts.write(account, true);
        self.emit(Whitelisted { account });
    }

    #[external(v0)]
    fn remove_account(ref self: ContractState, account: ContractAddress) {
        self.whitelisted_accounts.write(account, false);
        self.emit(Removed { account });
    }

    #[external(v0)]
    fn fund(ref self: ContractState, amount: felt252) { // mock funding
        self.treasury.write(self.treasury.read() + amount);
        self.emit(Funded { amount });
    }

    #[external(v0)]
    fn pay_for_fee(ref self: ContractState, account: ContractAddress, fee: felt252) {
        if self.whitelisted_accounts.read(account) != true { panic!("ACCOUNT_NOT_ALLOWED"); }
        let bal = self.treasury.read();
        if fee != 0 && bal == 0 { panic!("INSUFFICIENT_TREASURY"); }
        self.treasury.write(bal - fee);
        self.emit(PaidForFee { account, amount: fee });
    }
}

