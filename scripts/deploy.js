//Run this code to deploy two contracts to Rinkeby Testnet
// npx hardhat run --network rinkeby scripts/deploy.js

//Run these code to deploy two contracts to localhost
// npx hardhat node
// npx hardhat run scripts/deploy.js --network localhost 

//You can use other network to deploy
//e.g. Ethereum - Mainnet , Ethereum - Ropsten , Polygon - Mumbai , ...

const hre = require("hardhat");

async function main() {
  //get the contract to deploy
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();

  await nftMarket.deployed();

  console.log("NFTMarket deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);

  await nft.deployed();

  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
