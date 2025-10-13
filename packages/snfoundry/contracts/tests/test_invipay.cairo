use contracts::username_registry_mock::UsernameRegistryMock::{self, UsernameRegistryMock};
use contracts::invipay_paymaster::InviPayPaymaster::{self, InviPayPaymaster};
use contracts::invipay_account::InviPayAccount::{self, InviPayAccount};
use openzeppelin_testing::declare_and_deploy;
use openzeppelin_utils::serde::SerializedAppend;
use snforge_std::*;
use starknet::ContractAddress;

fn deploy_registry() -> ContractAddress {
    let calldata = array![];
    declare_and_deploy("UsernameRegistryMock", calldata)
}

fn deploy_paymaster(initial_treasury: felt252) -> ContractAddress {
    let mut calldata = array![];
    calldata.append_serde(initial_treasury);
    declare_and_deploy("InviPayPaymaster", calldata)
}

fn deploy_account(reg: ContractAddress, signer_key: felt252, username: ByteArray) -> ContractAddress {
    let mut guardians: Array<ContractAddress> = array![];
    let mut calldata = array![];
    calldata.append_serde(signer_key);
    calldata.append_serde(reg);
    calldata.append_serde(username);
    calldata.append_serde(guardians);
    calldata.append_serde(60_u64); // delay
    declare_and_deploy("InviPayAccount", calldata)
}

#[test]
fn test_update_signer_key() {
    let reg = deploy_registry();
    let pm = deploy_paymaster(1000);
    let username: ByteArray = "alice";
    let acct = deploy_account(reg, 11, username.clone());

    // whitelist account on paymaster
    let pm_disp = InviPayPaymaster { contract_address: pm };
    pm_disp.whitelist_account(acct);

    // add paymaster to account whitelist
    let acct_disp = InviPayAccount { contract_address: acct };
    acct_disp.add_paymaster(pm);

    // rotate signer: signature placeholder is old_key + (new_key + 1)
    let new_key = 22;
    let sig = 11 + (new_key + 1);
    acct_disp.update_signer_key(new_key, sig);
}

