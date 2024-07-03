const hre = require('hardhat');
const {xmsg, xerr} = require('./utils');
require('dotenv').config({ path: "./env_files/hardhat.env"})

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
    //constant variables
    const [deployer] = await hre.ethers.getSigners();
    xmsg(`deployer address: ${deployer.address}`);

    //deploy stone token contract
    const STONE = await deployTokenContract('STONE', "10000")
        .then(res => res)
        .catch(err => xerr(err))

    //deploy usd token contract
    const USD = await deployTokenContract('USD', "200000")
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

    const getBalance = async (pretext, address) => {
        const usdBalance = await USD.balanceOf(address);
        const stoneBalance = await STONE.balanceOf(address);
        xmsg(`${pretext} => USD: ${usdBalance.toString()} | STONE: ${stoneBalance}`)
    }

    //transfer USD to Lending
    await USD.transfer(Lending.target, 700)
    await getBalance('01. Lending', Lending.target)

    const ALICE = "0xFcD015D5D2b491708cd41DAD8825FD91652eEe76";

    //deposit STONE to ALICE
    await STONE.transfer(ALICE, "450")
    await getBalance('02. ALICE', ALICE)

    //ALICE borrow USD
    await USD.approve(Lending.target, "200")
    await Lending.deposit("200").catch(err=> {
            console.log(err)
        });
    await getBalance('03', ALICE)

    // await STONE.transfer(ALICE, "2400")
    // console.log('01. ALICE STONE balance: ', await STONE.balanceOf(ALICE))

    // //ALICE lend 450 USD
    // await USD.approve(Lending.target, "450")
    // await Lending.deposit("40").then(res=> res).catch(err=> {
    //     console.log(err)
    // });
    // console.log('02. ALICE STONE balance: ', await STONE.balanceOf(ALICE))
    // console.log('03. ALICE USD balance: ', await USD.balanceOf(ALICE))

    // // tUSDT -> lending transfer
    // const tUSDTAmount = "800";
    // await USD.transfer(ALICE, tUSDTAmount);
    // console.log(await USD.balanceOf(ALICE));

    // // deployer의 tGPC 잔액 확인
    // const deployerTGPCBalance = await STONE.balanceOf(deployer.address);
    // console.log("1. deployer's STONE balance:", deployerTGPCBalance.toString());

    // // // deployer 의 tUSDT 현재 잔액 확인
    // const deployerTUSDTBalance = await USD.balanceOf(deployer.address);
    // console.log("2. deployer's USD balance:", deployerTUSDTBalance.toString());

    // // 금 deposit
    // const depositAmount = "20";
    // await USD.approve(ALICE, depositAmount).then(res=> res).catch(err=> {
    //     console.log(err)
    // });
    // await Lending.deposit(depositAmount).then(res=> res).catch(err=> {
    //     console.log(err)
    // });
    // console.log('dsfds')
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