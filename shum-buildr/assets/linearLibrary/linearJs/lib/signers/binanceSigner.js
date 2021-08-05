import { providers } from "ethers";

const BinanceSigner = () => {
    const { BinanceChain } = window;
    const provider = new providers.Web3Provider(BinanceChain);
    const signer = provider.getSigner();
    signer.getNextAddresses = () =>{
        console.log("xxl BinanceSigner getNextAddresses");
        new Promise(resolve => resolve(BinanceChain.enable()));

    }

    return signer;
};

export default BinanceSigner;
