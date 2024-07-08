const { ethers } = require('hardhat');
const contractsInfo = {
    STONE: {
        address: process.env.STONE_TOKEN_ADDRESS,
        abi: require("../artifacts/contracts/Tokens.sol/STONE.json").abi
    },
    USD: {
        address: process.env.USD_TOKEN_ADDRESS,
        abi: require("../artifacts/contracts/Tokens.sol/USD.json").abi
    }
}
let STONE = null;
let USD = null;

//load smart contract object for interence
const loadContract = async () => {
    const provider = await new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = await provider.getSigner();
    STONE = await new ethers.Contract(contractsInfo.STONE.address, contractsInfo.STONE.abi, signer);
    USD = await new ethers.Contract(contractsInfo.USD.address, contractsInfo.USD.abi, signer);
}

loadContract();

//check balance of an specific address
exports.checkBalance = async (address) => {
    const stoneBalance = await STONE.balanceOf(address);
    const usdBalance = await USD.balanceOf(address);
    return {
        stone: (Number(stoneBalance) / (10 ** 18)).toLocaleString(),
        usd: (Number(usdBalance) / (10 ** 18)).toLocaleString(),
    }
}


