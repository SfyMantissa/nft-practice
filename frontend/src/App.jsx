import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import LoadingIndicator from './Components/LoadingIndicator';
import Arena from './Components/Arena';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import nftPractice from './utils/NFTPractice.json';

const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        setIsLoading(false);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found.');
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const renderContent = () => {

    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://c.tenor.com/AzIExqZBjNoAAAAC/anime-slap.gif"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    const checkNetwork = async () => {
      try {
        if (window.ethereum.networkVersion !== '4') {
          alert('Please, connect to Rinkeby!')
        }
      } catch (error) {
        consolg.log(error)
      }
    };

    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {

    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        nftPractice.abi,
        signer
      );
      console.log("Connection successful.")
      const txn = await gameContract.checkIfUserHasNFT();
      console.log("Checked user NFT.")
      if (txn.name) {
        console.log('User has a character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }
      setIsLoading(false);
    };

    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">💫 Mega Epic Turbo Giga Battle 💫</p>
          <p className="sub-text">Just fight, lol.</p>
          {renderContent()}
        </div>
        <div className="footer-container">
        </div>
      </div>
    </div>
  );
};

export default App;
