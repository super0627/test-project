import { useState, useEffect } from "react";
import { ethers } from "ethers";

const MetaMaskConnect = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    console.log("hello")
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature!");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      setAccount(await signer.getAddress());
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <div style={{zIndex:99999999, position:"absolute", top:"20px", right:"20px"}}>
      {account ? (
        <p style={{color:"white"}}>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default MetaMaskConnect;
