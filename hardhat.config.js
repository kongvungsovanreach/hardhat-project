require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require('dotenv').config({ path: "./env_files/hardhat.env"})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      // url: 'http://127.0.0.1:8545/',
      // accounts: [
      //   process.env.DEPLOY_PREV_KEY || ''
      // ],
      // account: {
      //   mnemonic: process.env.SEED_PHRASE
      // },
      chainId: 31337,
      gas: 400000000,
      gasPrice: 5000000000
    },
    baobab: {
      url: process.env.BAOBAB_URL,
      accounts: [
        process.env.DEPLOY_PREV_KEY || ''
      ],
      chainId: 1001,
      gas: 50000000,
      gasPrice: 250000000000
    }
  }
}