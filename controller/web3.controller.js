const { ethers } = require("hardhat");
require('dotenv').config({ path: "../env_files/dapp.env"});

exports.getBalance = async (req, res, next) => {
    // const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    // const provider = new hre.ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
//     const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
//     const [deployer] = await ethers.getSigners();
//     const lendingContractAddress = process.env.LENDING_CONTRACT;
//     const stoneTokenAddress = process.env.STONE_TOKEN_ADDRESS;
//     const usdTokenAddress = process.env.USD_TOKEN_ADDRESS;
//     const lendingAbi = [
//         "function deposit(uint256 amount) external",
//         "function borrow(uint256 tUSDTAmount) external",
//         "function getCollateralAmount(uint256 tUSDTAmount) external view returns (uint256)"
//     ];
//     const erc20Abi = [
//         "function approve(address spender, uint256 amount) public returns (bool)",
//         "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)"
//     ];
//     const lendingContract = new ethers.Contract(lendingContractAddress, lendingAbi, deployer);
//     const stoneToken = new ethers.Contract(stoneTokenAddress, erc20Abi, deployer);


//     const borrowAmount = ethers.utils.parseUnits("3000", 18); // Assuming USD has 18 decimals

//   // Step 1: Calculate required collateral
//   const collateralRequired = await lendingContract.getCollateralAmount(borrowAmount);
//   console.log(`Collateral required: ${ethers.utils.formatUnits(collateralRequired, 18)} STONE`);

//   // Step 2: Approve and deposit collateral
//   console.log("Approving collateral transfer...");
//   let tx = await stoneToken.approve(lendingContractAddress, collateralRequired);
//   await tx.wait();
//   console.log("Collateral transfer approved.");

//   console.log("Depositing collateral...");
//   tx = await lendingContract.deposit(collateralRequired);
//   await tx.wait();
//   console.log("Collateral deposited.");

//   // Step 3: Borrow USD
//   console.log("Borrowing USD...");
//   tx = await lendingContract.borrow(borrowAmount);
//   await tx.wait();
//   console.log("Borrowed 3000 USD.");

    res.send({
        '':'testinmg'
    })
}