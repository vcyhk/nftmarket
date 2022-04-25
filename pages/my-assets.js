import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Image from 'next/image'
import 'tw-elements'

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [nftListDetail, setNftListDetail] = useState({name: '', price:'',seller:'', owner:''})
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }

  async function setSaleDetail(i){
    setNftListDetail({name: nfts[i].name, price: nfts[i].price, seller: nfts[i].seller, owner:nfts[i].owner});
  }

  async function checkNft(){

  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl flex justify-center">No items to display</h1>)

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <h2 className="font-semibold text-3xl my-4">My NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <Image
                            src={nft.image}
                            alt="Author"
                            className="rounded"
                            width={300}
                            height={300} 
                          />
                <div className="p-4 bg-gray-800 text-white">
                  <p style={{ height: '45px'}} className="text-2xl font-semibold">
                        {nft.name}
                  </p>
                  <p className="mb-3 text-2xl font-bold">Price - {nft.price} ETH</p>
                  <button type="button" class="w-full bg-blue-600 font-bold py-2 px-12 rounded" 
                        data-bs-toggle="modal" 
                        data-bs-target="#Modal"
                        onClick={() => setSaleDetail(i)}>
                    Detail
                  </button>

                  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                    id="Modal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
                    <div class="modal-dialog relative w-auto pointer-events-none">
                      <div
                        class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div
                          class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                          <h5 class="text-xl font-medium leading-normal text-gray-800" id="ModalLabel">NFT Detail</h5>
                          <button type="button"
                            class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body relative p-4">
                          <p className="text-2xl font-bold text-black">{nftListDetail.name}</p>
                          <p className="text-base text-black">Price: {nftListDetail.price} ETH</p>
                          <p className="text-base text-black">Seller: {nftListDetail.seller}</p>
                          <p className="text-base text-black">Owner: {nftListDetail.owner}</p>
                        </div>
                        <div
                          class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                          <button
                            onClick={checkNft}
                            disabled
                            className="font-bold mx-10 bg-neutral-200 text-neutral-600 rounded p-4 shadow-md"
                            >YOU ARE NOT ALLOWED TO SELL IT NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="offcanvas offcanvas-bottom fixed bottom-0 flex flex-col max-w-full bg-white invisible bg-clip-padding shadow-sm outline-none transition duration-300 ease-in-out text-gray-700 left-0 right-0 border-none h-1/3 max-h-full" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
                    <div class="offcanvas-header flex items-center justify-between p-4 bg-current">
                      <h5 class="offcanvas-title mb-0 leading-normal font-semibold text-white" id="offcanvasBottomLabel">NFT Detail</h5>
                      <button type="button" class="bg-white btn-close box-content w-4 h-4 p-2 -my-5 -mr-2 text-black border-none rounded opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="my-5">
                      <p className="mx-10 my-2 text-2xl font-bold text-black">{nftListDetail.name}</p>
                      <p className="mx-10 text-xl text-black">Price: {nftListDetail.price} ETH</p>
                      <p className="mx-10 text-xl text-black">Seller: {nftListDetail.seller}</p>
                      <p className="mx-10 text-xl text-black">Owner: {nftListDetail.owner}</p>
                    </div>
                    <button
                    onClick={checkNft}
                    disabled
                    className="font-bold mx-10 bg-neutral-200 text-neutral-600 rounded p-4 shadow-lg"
                    >YOU ARE NOT ALLOWED TO SELL IT NOW</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}