require("@nomiclabs/hardhat-waffle");
const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString(); //Please paste your private key in this file (.secret) to deploy your contract
const projectId = "" //You can find the projectId in https://infura.io/ It is a rinkeby testnet.

module.exports = {
  networks: {
    hardhat: {
      // chainId: 31337
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
  },
  solidity: "0.8.4",
};

//Run this code to deploy two contracts to Rinkeby Testnet
// npx hardhat run --network rinkeby scripts/deploy.js

//Run these code to deploy two contracts to localhost
// npx hardhat node
// npx hardhat run scripts/deploy.js --network localhost 