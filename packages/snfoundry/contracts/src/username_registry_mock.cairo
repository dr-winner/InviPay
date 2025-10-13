#[starknet::contract]
pub mod UsernameRegistryMock {
    use starknet::{ContractAddress};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    struct Storage { usernames: Map<felt252, ContractAddress> }

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[external(v0)]
    fn resolve(self: @ContractState, username: ByteArray) -> Option<ContractAddress> {
        // Simplified mock: username resolution is not used in tests
        Option::None
    }

    #[external(v0)]
    fn link_username(ref self: ContractState, username: ByteArray, account: ContractAddress) {
        // Simplified mock: store under fixed key for demonstration
        self.usernames.write(0, account);
    }
}

