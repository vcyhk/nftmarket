import '../styles/globals.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Web3Modal from "web3modal"

export default function MyApp({ Component, pageProps }){

  const [account, setAccounts] = useState("Connect")
  

  useEffect(() => {
    loadAccount();
  }, []);

  //Show and update the adress of Metamask
  async function loadAccount() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const account = (connection.selectedAddress).toString();
    setAccounts((account.substring(0,4)+ '...'+ account.substring(account.length - 4)));
  }

  return (
    <div>
      <nav className=" p-6 bg-gray-800 place-self-center">
        <div className="flex-1 flex items-center justify-center sm:items-stretch">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/"><a className="text-4xl font-bold text-white">NFT MARKET</a></Link>
          </div>
          <div className="hidden sm:block sm:ml-6 self-center">
            <div className="flex space-x-4">
            <Link href="/">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
            </Link>
            <Link href="/create-item">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sell NFT</a>
            </Link>
            <Link href="/my-assets">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My NFT</a>
            </Link>
            <Link href="/creator-dashboard">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
            </Link>
            <Link href="/support">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Support</a>
            </Link>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center">
            <button onClick={loadAccount} className="bg-slate-100 mx-5 rounded p-2.5 shadow-md text-slate-500 flex items-center">
              <img src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" style={{ width:20, heigh:20, margin:5 }}/> 
              {account}
            </button>
          </div>
        </div>
        


        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link Link href="/">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
            </Link>
            <Link href="/create-item">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sell NFT</a>
            </Link>
            <Link href="/my-assets">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">My NFT</a>
            </Link>
            <Link href="/creator-dashboard">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</a>
            </Link>
            <Link href="/support">
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Support</a>
            </Link>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}
