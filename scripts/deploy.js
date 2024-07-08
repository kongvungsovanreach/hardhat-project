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
    const [deployer, ...accounts] = await hre.ethers.getSigners();
    xmsg(`deployer address: ${deployer.address}`);

    //deploy stone token contract
    const stoneInitialSupply = ethers.parseUnits('1000000', 18).toString();
    const STONE = await deployTokenContract('STONE', stoneInitialSupply)
        .then(res => res)
        .catch(err => xerr(err))

    //deploy usd token contract
    const usdInitialSupply = ethers.parseUnits('10000', 18).toString();
    const USD = await deployTokenContract('USD', usdInitialSupply)
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
    xmsg(`contract deployed to addess "${Lending.target}"`);
    
    // const getBalance = async (pretext, address) => {
    //     const usdBalance = await USD.balanceOf(address);
    //     const stoneBalance = await STONE.balanceOf(address);
    //     xmsg(`${pretext} => USD: ${usdBalance.toString()} | STONE: ${stoneBalance}`)
    // }

    //init balance into contract
    const INIT_LENDING_USD = ethers.parseUnits('8000', 18).toString();
    await USD.transfer(Lending.target, INIT_LENDING_USD)
        .then((res) =>  res)
        .catch(err => xerr('error init Lending with USD.'));;
    
    //init ALICE with STONE
    // const ALICE_ADDRESS = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
    const INIT_STONE_BALANCE = ethers.parseUnits('30000', 18).toString();

    for (const [index, account] of accounts.slice(0, 19).entries()) {
        console.log(`Init balance account ${index + 1}: ${account.address}`);
        await STONE.transfer(account.address, INIT_STONE_BALANCE)
            .then((res) =>  {
                xmsg('init successfully.');
            })
            .catch(err => {
                xerr('error init ALICE with STONE.')
                console.log(err)
            });
    }
    // accounts.slice(0, 19).forEach(async (account, index) => {
    //     console.log(`Init balance account ${index + 1}: ${account.address}`);
    //     await STONE.transfer(account.address, INIT_STONE_BALANCE)
    //         .then((res) =>  {
                
    //             console.log(res)
    //         })
    //         .catch(err => {
    //             xerr('error init ALICE with STONE.')
    //             console.log(err)
    //         });
    //         console.log('jajaja')
    // });

    
    console.log('Deployment completed.')
    //init balance for borrower
    
    // const ALICE_STONE = ethers.parseUnits('25000', 18).toString();
    // const ALICE_USD = ethers.parseUnits('3600', 18).toString();
    // await STONE.transfer(ALICE, ALICE_STONE).then(res =>  {
    //     // console.log(res)
    // }).catch(err => {
    //     console.log(err)
    // })
    // await USD.transfer(ALICE, ALICE_USD).then(res =>  {
    //     // console.log(res)
    // }).catch(err => {
    //     console.log(err)
    // })

    
    
    // console.log('aaa')
    // await STONE.approve(Lending.target, "5000000000000000000000").then(res =>  {
    //     // console.log(res)
    // }).catch(err => {
    //     console.log(err)
    // })
    // await Lending.deposit('5000000000000000000000').then(res =>  {
    //     console.log(res)
    // }).catch(err => {
    //     console.log(err)
    // })

    // await USD.transfer(Lending.target, '100000000000000000000').then(res =>  {
    //     // console.log(res)
    // }).catch(err => {
    //     console.log(err)
    // })

    // console.log('bbb')
    // await Lending.borrow('100000000000000000000').then(res =>  {
    //     console.log(res)
    // }).catch(err => {
    //     console.log(err)
    // })
    // console.log('ccc')
    //transfer USD to Lending
    // const usdAmount = ethers.parseUnits('3600', 18).toString();
    // await USD.transfer(Lending.target, usdAmount)
    // await getBalance('01. Lending', Lending.target)

    // const ALICE = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";

    //deposit STONE to ALICE
    // const stoneAmount = ethers.parseUnits('25000', 18).toString();
    // await STONE.transfer(ALICE, stoneAmount)
    // await getBalance('02. ALICE', ALICE)

    // //ALICE borrow USD
    // // await USD.approve(Lending.target, "200")
    // // await Lending.deposit("200").catch(err=> {
    // //         console.log(err)
    // //     }); 

    // await getBalance('03', ALICE)

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