import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import { useWallet, UseWalletProvider } from 'use-wallet';

const ADDRESS = "CONTRACT ADDRESS";
const ABI = [];

const App = () => {
    const wallet = useWallet();
    const mint = async () => {
        window.web3 = new Web3(window.ethereum);
        const metaCoinContract = new window.web3.eth.Contract(ABI, ADDRESS);
        const tokenNumber = 1;
        const metaCoinPrice = await metaCoinContract.methods.metabaesPrice().call();
        const price = Number(metaCoinPrice) * tokenNumber;
        const gasAmount = await metaCoinContract.methods.mintMetabaes(tokenNumber).estimateGas({from: wallet.account, value: price})
        metaCoinContract.methods
          .mintMetabaes(tokenNumber)
          .send({from: wallet.account, value: price, gas: String(gasAmount)})
          .on('transactionHash', function(hash){
            console.log("transactionHash", hash)
          })
          .on('receipt', function(receipt) {
            console.log('receipt', receipt)
          })
          .on('confirmation', function(confirmationNumber, receipt){
            console.log('confirmation', confirmationNumber, "receipt", receipt)
          })
          .on('error', console.error)
    }
    return(
        <div>
            <button onClick={mint}>
                mint
            </button>
            <button onClick={() => wallet.connect()}>
                Connect Metamask
            </button>
        </div>
    )
}


ReactDOM.render(
    <UseWalletProvider
        chainId={1}
        connectors={{
            fortmatic: { apiKey: '' },
            walletconnect: { rpcUrl: '' },
            walletlink: { url: '' },
        }}
    >
        <App />
    </UseWalletProvider>,
    document.getElementById('root')
);