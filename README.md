# NFTMarket
NFTMarket is a project modified from opensea-clone. It has better UI and function.

<img src="https://i.imgur.com/VJjjGXX.jpg">
<img src="https://i.imgur.com/PmjiE6J.jpg">

# :star: Features
1. Friendly UI
2. Display Error Message
3. Display Current Wallet Address
4. Check you NFT Detail
5. Resell your NFT (Coming Soon)

# :desktop_computer: Quick Start
Install the dependencies
```
npm install
```
Run the app
```
npx next dev
```

## How To Deploy New Contracts?
Paste your private key in *.secret*

Paste your Infura project ID in *hardhat.config.js*

Paste your Infura project ID in *index.js* 
```
const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/YOUR_PROJECT_ID");
```
Deploy NFT Token and NFT Market contracts in **Rinkeby Testnet**
```
npx hardhat run --network rinkeby scripts/deploy.js
```
If you want to deploy your contracts in **localhost**
```
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost 
```
Paste two contract address in *config.js*
```
export const nftaddress = "NFT_CONTRACT_ADDRESS"
export const nftmarketaddress = "NFT_MARKET_CONTRACT_ADDRESS"
```


# :scroll: Reference
https://github.com/davepartner/opensea-clone
