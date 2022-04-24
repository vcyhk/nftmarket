import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

import {
    nftaddress,nftmarketaddress
} from '../config';
import NFT from '../contracts/abi/NFT_ABI.json';
import Market from '../contracts/abi/NFTMarket_ABI.json';
import Image from 'next/Image'

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({price: '', name: '', description:''})
    const [loading, setLoading] = useState();
    const router = useRouter();

    async function onChange(e) {
        const file = e.target.files[0]
        setLoading(true)
        try{ 
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}` //file saved in this url
            setFileUrl(url)
            setLoading(false)
        }catch(e){
            console.log('Error uploading file: ', e) //show error if upload unsuccessful
        }
    }

    async function createItem(){
        const {name, description, price} = formInput; //get the value from the form input
        
        //validation
        if(!name || !description || !price || !fileUrl) {
            return
        }

        const data = JSON.stringify({
            name, description, image: fileUrl
        });

        try{
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            //pass the url to save it on testnet after it has been uploaded to IPFS
            createSale(url)
        }catch(error){
            console.log(`Error uploading file: `, error)
        }
    }

    //2. List item for sale
    async function createSale(url){
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        //sign the transaction
        const signer = provider.getSigner();
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
        let transaction = await contract.createToken(url);
        let tx = await transaction.wait()

        //get the tokenId from the transaction above
        //returned events array, the first item from that event is the event, third item is the token id.
        console.log('Transaction: ',tx)
        console.log('Transaction events: ',tx.events[0])
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber() //convert it to a number

        //get a reference to the price entered in the form 
        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

        //get listing price
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.createMarketItem(
            nftaddress, tokenId, price, {value: listingPrice }
        )

        await transaction.wait()

        router.push('/')

    }

    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <h1 className="font-semibold text-4xl my-10">Create Your Item</h1>
                <input 
                    placeholder="Item Name"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, name: e.target.value})}
                    />
                <textarea
                     placeholder="Description"
                     className="mt-2 border rounded p-4"
                     onChange={e => updateFormInput({...formInput, description: e.target.value})}
                     />
                <input 
                    placeholder="Price (ETH)"
                    className="mt-2 border rounded p-4"
                    type="number"
                    onChange={e => updateFormInput({...formInput, price: e.target.value})}
                    />
                    <input
                        type="file"
                        name="Asset"
                        className="my-4"
                        onChange={onChange}
                    />
                     {
                        fileUrl && (                   
                            <Image
                            src={fileUrl}
                            alt="Author"
                            className="rounded mt-4"
                            width={500}
                            height={500} 
                          />
                        )
                    }
                    {loading && <div class="flex justify-center items-center">
                        <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>}
                    <button onClick={createItem}
                     className="font-bold mt-4 bg-gray-800 text-white rounded p-4 shadow-lg"
                     >Create NFT</button>
            </div>
        </div>
    )
}