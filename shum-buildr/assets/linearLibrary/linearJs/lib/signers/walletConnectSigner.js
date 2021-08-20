import { providers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';

const WalletConnectSigner = ({chainId = 1,infuraId ='', rpc = {} }) => {
  const provider = new WalletConnectProvider({
    bridge: 'https://bridge.walletconnect.org',
    qrcode: false,
    infuraId,
    chainId,
    rpc,
  });

  provider.connector.on("display_uri", (err, payload) => {
    const uri = payload.params[0];
    $nuxt.$store.commit(
      "setWalletConnect",{
        uri,
        qrcode:true
      });
  });

  return UpdateWalletConnectSigner({provider});
};


export const UpdateWalletConnectSigner = ({provider}) => {
  let wrappedProvider = new providers.Web3Provider(provider);
  let signer = wrappedProvider.getSigner();
  signer.getNextAddresses = () => new Promise(resolve => resolve(wrappedProvider.listAccounts()));
  return signer;
}

export default WalletConnectSigner;