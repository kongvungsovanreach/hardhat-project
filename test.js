const {ethers} = require("hardhat");
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const aliceAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
const contractAbi = require("./artifacts/contracts/Tokens.sol/STONE.json").abi;
const RPC_URL = 'http://localhost:8545';

async function main() {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        await contract.transfer(aliceAddress, 300000000000)
        const balance = await contract.balanceOf(aliceAddress);
        console.log(balance)
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