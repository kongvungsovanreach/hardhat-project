const hre = require('hardhat');
const {xmsg, xerr} = require('./utils');
require('dotenv').config({ path: "./env_files/hardhat.env"})


//constant variables

async function deployTokenContract(contractName, initialSupply) {
    //deploy RIEL contract
    xmsg(`network name: ${hre.network.name}`)
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
    const STONE = await deployTokenContract('STONE', "100")
        .then(res => res)
        .catch(err => xerr(err))

    //deploy usd token contract
    const USD = await deployTokenContract('USD', "1000")
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

    address ALICE = 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199;
    const alice_stone = '1000'
    await STONE.transfer(ALICE, alice_stone)
    console.log(await STONE.balanceOf(ALICE));
    // tUSDT -> lending transfer
    // const tUSDTAmount = "800";
    // USD.transfer(Lending.target, tUSDTAmount);
    // console.log(await STONE.balanceOf(deployer.address));

    // // deployer의 tGPC 잔액 확인
    // const deployerTGPCBalance = await STONE.balanceOf(deployer.address);
    // console.log("1. deployer's STONE balance:", deployerTGPCBalance.toString());

    // // deployer 의 tUSDT 현재 잔액 확인
    // const deployerTUSDTBalance = await USD.balanceOf(deployer.address);
    // console.log("2. deployer's USD balance:", deployerTUSDTBalance.toString());

    // // 금 deposit
    // const depositAmount = "100";
    // await STONE.approve(Lending.target, depositAmount);
    // await Lending.deposit(depositAmount);

    // // deployer의 tGPC 잔액 확인
    // const deployerTGPCBalance2 = await STONE.balanceOf(deployer.address);
    // console.log("3. deployer's STONE balance:", deployerTGPCBalance2.toString());

    // // borrow
    // const loanAmount = "20";
    // await Lending.borrow(loanAmount);

    // // deployer 의 tUSDT 현재 잔액 확인
    // const deployerTUSDTBalance2 = await USD.balanceOf(deployer.address);
    // console.log("4. deployer's USD balance:", deployerTUSDTBalance2.toString());

    // // repay
    // USD.approve(Lending.target, loanAmount);
    // await Lending.repay(loanAmount);

    // // deployer 의 tUSDT 현재 잔액 확인
    // const deployerTUSDTBalance3 = await USD.balanceOf(deployer.address);
    // console.log("5. deployer's USD balance:", deployerTUSDTBalance3.toString());

    // const deployerSTONE4 = await STONE.balanceOf(deployer.address);
    // console.log("5. deployer's STONE balance:", deployerSTONE4.toString());
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