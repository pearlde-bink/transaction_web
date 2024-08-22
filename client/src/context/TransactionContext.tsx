/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";
import { MetaMaskInpageProvider } from "@metamask/providers";

import { Transaction } from "ethers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export const TransactionContext = React.createContext("");

const { ethereum } = window;

const getEthereumContract = async () => {
  // const provider = new ethers.providers.Web3Provider(ethereum);
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }: any) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  const [formData, setFormData] = useState({
    addressTo: "",
    amount: 0,
    keyword: "",
    message: "",
  });

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const transactionContract = await getEthereumContract();

      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction: any) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );

      console.log("structuredTransactions: ", structuredTransactions);
      setTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const isMetaMask = ethereum && ethereum.isMetaMask;

      if (isMetaMask) {
        const accounts = await ethereum.request({ method: "eth_accounts" }); //check exist account
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          getAllTransactions();
        }
        // console.log(accounts);
      } else {
        alert(
          "MetaMask is not detected. Please ensure MetaMask is installed and enabled."
        );
      }
    } catch (err) {
      console.log(err);
      throw new Error("No ethereum object");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = await getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (err) {
      console.log(err);
      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const isMetaMask = ethereum && ethereum.isMetaMask;

      if (isMetaMask) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        }); // request all account then user can choose one
        setCurrentAccount(accounts[0]);
        console.log("connect successfully");
        console.log("currentAccount: ", currentAccount);
      } else {
        alert(
          "MetaMask is not detected. Please ensure MetaMask is installed and enabled."
        );
      }
    } catch (err) {
      console.log(err);
      throw new Error("No ethereum object");
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount("");
    localStorage.clear();
    console.log("disconnected");
    console.log("currentAccount: ", currentAccount);
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = await getEthereumContract();

      const parsedAmount = ethers.parseEther(amount.toString()); // convert to gwei

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //2100gwei
            value: parsedAmount._hex,
          },
        ],
      });

      //to store transactions
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();

      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      //increase transaction count
      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());

      location.reload();
    } catch (err) {
      console.log(err);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// 0xE95C97d6659ebCD8a8e4a7af691CF46b9Ca13BC8
