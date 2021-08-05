import { providers } from "ethers";

const MetamaskSigner = () => {


    const { ethereum } = window;
    const provider = new providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    signer.getNextAddresses = () =>
        new Promise(resolve => resolve(ethereum.enable()));
    return signer;


    // console.log("xxl MetamaskSigner : " );
    // const { ethereum } = window;

    // console.log(`xxl ethereum ${ethereum}`);
    // console.log(ethereum);
    // const provider = new providers.Web3Provider(ethereum);

    // console.log(`xxl provider ${provider}`);
    // console.log(provider);

    // const signer = provider.getSigner();

    // console.log(`xxl signer ${signer}`);
    // console.log(signer);

    // signer.getNextAddresses = () =>{
    //     console.log("xxl MetamaskSigner getNextAddresses");
    //     new Promise(resolve => resolve(ethereum.enable()));
    // }
        
    // return signer;

    
};

export default MetamaskSigner;
