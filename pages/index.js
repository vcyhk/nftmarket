import {ethers} from 'ethers';
import { useEffect, useState } from 'react'
import axios from 'axios';
import Web3Modal from 'web3modal';
import {nftaddress, nftmarketaddress} from '../config'
import Image from 'next/image';

import NFT from '../contracts/abi/NFT_ABI.json';
import Market from '../contracts/abi/NFTMarket_ABI.json';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState('');
  const [isError, setIsError] = useState();
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs(){
    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/81c8d6ef79c3407099ca10852eed30ee"); // Enter the ENDPOINTS "https://rinkeby.infura.io/v3/...""
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item;
    }))
    
    setNfts(items);
    setLoadingState('loaded');
  }
  async function buyNFT(nft){
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    
    try{
      const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
        value: price
      });
      await transaction.wait();
      loadNFTs()
    }catch(e){ //check and display error msg
      if(e.code === "INSUFFICIENT_FUNDS"){
        setIsError(true);
        setError("Insufficient Funds");
      }else if(e.code == "4001"){
        setIsError(true);
        setError("User Denied Transaction");
      }
    }
   
  }


  if(loadingState === 'loaded' && !nfts.length) return(
    <div className="justify-center">
      <div className="p-12 text-center bg-blue-100 text-black">
        <h2 className="font-semibold text-4xl m-20">Create Your NFTs Now</h2>
        <a href="/create-item">
          <button
          type="button"
          className="inline-block px-6 py-3.5 mb-1 bg-blue-600 text-white font-semibold text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          >
            MORE
          </button>
        </a>
      </div>
      <h1 className='px-20 py-28 text-3xl flex justify-center'>No items in marketplace</h1>
    </div>
  )

  return (
    <div className="flex justify-center">
      <div>
      {isError && 
        <div class="bg-red-100 rounded-lg py-5 px-6 m-px text-base text-red-700 inline-flex items-center w-full" role="alert">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
          </svg>
          {error}
        </div>
      }
        <div className="p-12 text-center bg-blue-100 text-black">
          <h2 className="font-semibold text-4xl m-20">Create Your NFTs Now</h2>
          <a href="/create-item">
          <button
            type="button"
            className="inline-block px-6 py-3.5 mb-1 bg-blue-600 text-white font-semibold text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
          >
            MORE
          </button>
          </a>
        </div>

        <div className="justify-center px-10 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              nfts.map((nft, i) =>(
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  
                  <Image src={nft.image}
                      alt="Author"
                      width={500}
                      height={500}
                    />
                  <div className="p-4">
                    <p style={{ height: '45px'}} className="text-2xl font-semibold">
                        {nft.name}
                    </p>
                    <div style={{ height:'50px', overflow: 'hidden'}}>
                      <p className="text-gray-400">{nft.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800">
                    <p className="text-2xl mb-4 font-bold text-white">
                      {nft.price} ETH
                    </p>
                    <button className="w-full bg-blue-600 text-white font-bold py-2 px-12 rounded"
                    onClick={() => buyNFT(nft)}>Buy NFT</button>
                </div>
                </div>
              ))
            }
          </div>
       </div>
      </div>
    </div>
   )
}
