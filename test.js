const {ethers} = require("hardhat");
const stone = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const usd = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const aliceAddress = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
const stoneContractAbi = require("./artifacts/contracts/Tokens.sol/STONE.json").abi;
const usdContractAbi = require("./artifacts/contracts/Tokens.sol/USD.json").abi;
const RPC_URL = 'http://localhost:8545';

async function main() {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const signer = await provider.getSigner();
        const STONE = new ethers.Contract(stone, stoneContractAbi, signer);
        const USD = new ethers.Contract(usd, usdContractAbi, signer);
        await STONE.transfer(aliceAddress, 345000 ** 18);
        await USD.transfer(aliceAddress, 5000 ** 18);
        const stoneBalance = await STONE.balanceOf(aliceAddress);
        const usdBalance = await USD.balanceOf(aliceAddress);
        console.log(stoneBalance, '   ', usdBalance);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

async function deploy() {
    try {
        await ethers.deployContract('STONE', ['10203'])
            .then(res => {
                console.log(res.target)
            }).catch(err => {
                console.log(err)
            })
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

// deploy();

main();