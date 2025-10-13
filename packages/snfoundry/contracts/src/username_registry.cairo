use starknet::ContractAddress;
#[starknet::interface]
pub trait IUsernameRegistry<TContractState> {
    fn resolve(self: @TContractState, username: ByteArray) -> Option<ContractAddress>;
    fn link_username(ref self: TContractState, username: ByteArray, account: ContractAddress);
}

