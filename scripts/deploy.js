const hre = require('hardhat');
const {xmsg, xerr} = require('./utils');
require('dotenv').config();


//constant variables

async function deployTokenContract(contractName, initialSupply) {
    //deploy RIEL contract
    xmsg(`start deploying constract named: ${contractName}`);
    const Token = await hre.ethers.deployContract(contractName, [initialSupply])
        .then(res => res)
        .catch(err => xerr('error deploying contract.'));

    await Token.waitForDeployment()
        .then((res) =>  res)
        .catch(err => xerr('error deploying contract.'));

    xmsg(`contract deployed to addess "${Token.target}"`);
    return Token
}

async function run_main() {
    const [deployer] = await hre.ethers.getSigners();
    xmsg(`deployer address: ${deployer.address}`);
    
    //deploy stone token contract
    const STONE = await deployTokenContract('STONE', "10000000000000000000")
        .then(res => res)
        .catch(err => xerr(err))

    //deploy usd token contract
    const USD = await deployTokenContract('USD', "100000000000000000000000000")
        .then(res => res)
        .catch(err => xerr(err));

    //deploy Lending transaction contract
    xmsg(`start deploying constract named: Lending`);
    const Lending = await hre.ethers.deployContract('Lending', [STONE.target, USD.target])
        .then(res => res)
        .catch(err => xerr(err));
    
    await Lending.waitForDeployment()
        .then((res) =>  res)
        .catch(err => xerr('error deploying contract.'));

    

    // tUSDT -> lending transfer
    const tUSDTAmount = "80000000000000000000000000";
    USD.transfer(Lending.target, tUSDTAmount);

    // deployer의 tGPC 잔액 확인
    const deployerTGPCBalance = await STONE.balanceOf(deployer.address);
    console.log("1. deployer's tGPC balance:", deployerTGPCBalance.toString());

    // deployer 의 tUSDT 현재 잔액 확인
    const deployerTUSDTBalance = await USD.balanceOf(deployer.address);
    console.log("2. deployer's tUSDT balance:", deployerTUSDTBalance.toString());

    // 금 deposit
    const depositAmount = "10000000000000000000";
    await STONE.approve(Lending.target, depositAmount);
    await Lending.deposit(depositAmount);

    // deployer의 tGPC 잔액 확인
    const deployerTGPCBalance2 = await STONE.balanceOf(deployer.address);
    console.log("3. deployer's tGPC balance:", deployerTGPCBalance2.toString());

    // borrow
    const loanAmount = "4900000000000000000";
    await Lending.borrow(loanAmount);

    // deployer 의 tUSDT 현재 잔액 확인
    const deployerTUSDTBalance2 = await USD.balanceOf(deployer.address);
    console.log("4. deployer's tUSDT balance:", deployerTUSDTBalance2.toString());

    // repay
    USD.approve(Lending.target, loanAmount);
    await Lending.repay(loanAmount);

    // deployer 의 tUSDT 현재 잔액 확인
    const deployerTUSDTBalance3 = await USD.balanceOf(deployer.address);
    console.log("5. deployer's tUSDT balance:", deployerTUSDTBalance3.toString());
}

run_main()
    .then(()=> {
        console.log('run_main no error');
        process.exit(0)
    })
    .catch(err => {
        console.log|(err);
        process.exit(1)
    })