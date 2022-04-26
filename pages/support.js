//Display FAQ
export default function Support() {
  
  return (
    <div className="justify-center">
      <div class="p-6 m-6 shadow-lg rounded-lg bg-gray-100 text-gray-700">
        <h2 class="font-semibold text-3xl mb-5">What is NFT?</h2>
        <hr class="my-6 border-gray-300" />
        <p>
          <b>Ans:</b> A non-fungible token (NFT) is a non-interchangeable unit of data stored on a blockchain, a form of digital ledger, that can be sold and traded.
          Types of NFT data units may be associated with digital files such as photos, videos, and audio. Because each token is uniquely identifiable, 
          NFTs differ from most cryptocurrencies, such as Bitcoin, which are fungible.
        </p>
      </div>
      <div class="p-6 m-6 shadow-lg rounded-lg bg-gray-100 text-gray-700">
        <h2 class="font-semibold text-3xl mb-5">How to sell my NFTs?</h2>
        <hr class="my-6 border-gray-300" />
        <p>
          <b>Ans:</b> You can create your NFT and sell it in <a href="./create-item" className='text-sky-500'>Sell NFT</a>.
          However, you can't resell the NFT.
        </p>
      </div>
      <div class="p-6 m-6 shadow-lg rounded-lg bg-gray-100 text-gray-700">
        <h2 class="font-semibold text-3xl mb-5">How to check my NFT?</h2>
        <hr class="my-6 border-gray-300" />
        <p>
          <b>Ans:</b> You can check your NFT in <b>My NFT</b>.
        </p>
      </div>
      <div class="p-6 m-6 shadow-lg rounded-lg bg-gray-100 text-gray-700">
        <h2 class="font-semibold text-3xl mb-5">Can I check my transaction?</h2>
        <hr class="my-6 border-gray-300" />
        <p>
          <b>Ans:</b> If you would like to check the NFT which you sold or created. You can check in <a href="/creator-dashboard" className='text-sky-500'>Dashboard</a>. In the current stage, the market and NFT are launched in the Ethereum testnet. So you can check your transaction in the Rinkeby testnet.
        </p>
      </div>
      <div class="p-6 m-6 shadow-lg rounded-lg bg-gray-100 text-gray-700">
        <h2 class="font-semibold text-3xl mb-5">Why I need to pay twice when I create my NFT?</h2>
        <hr class="my-6 border-gray-300" />
        <p>
          <b>Ans:</b> The first payment is for creating the NFT. The second payment is for listing the NFT in the market. It is a fixed price: 0.005 ETH.
        </p>
      </div>
    </div>
   )
}
