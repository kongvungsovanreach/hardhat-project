require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({ path: "./run.env"})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      // url: 'http://127.0.0.1:8545/',
      // accounts: [
      //   process.env.DEPLOY_PREV_KEY || ''
      // ],
      chainId: 10304
    }
  }
}