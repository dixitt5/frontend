import Web3 from "web3";
import Portis from '@portis/web3';
import { METAMASK_WALLET, PORTIS_WALLET } from "../constants/constants";

const getWeb3 = (wallet: string) =>
  new Promise(async (resolve, reject) => {
    let _window = window as any
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    _window.ethereum.on('accountsChanged', (accounts: any) => {
      console.log("ACCOUNTS ", accounts)
      window.location.reload();
      // Time to reload your interface with accounts[0]!
    })

    if (wallet === PORTIS_WALLET) {

      const appId: any = process.env.REACT_APP_PORTIS_APP_ID
      const appNetwork: any = process.env.REACT_APP_DAPP_NETWORK

      const portis = new Portis(appId, appNetwork);
      const web3 = new Web3(portis.provider);
      resolve(web3);
    }

    else if (wallet === METAMASK_WALLET) {

      // _window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (_window.ethereum) {
        const web3 = new Web3(_window.ethereum);
        try {
          // Request account access if needed
          await _window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (_window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = _window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "https://testnetv3.matic.network"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
      // });
    }
  });

export default getWeb3;