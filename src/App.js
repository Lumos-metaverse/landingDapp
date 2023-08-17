import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import abi from "./contract/abi.json"

function App() {
  const [contract, setContract] = useState();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const contractAddress = '0x55955fD05C03A06177e407dB8cC23c89a9ec5356';

  useEffect(() => {
    const fetchContract = async()=> {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      setContract(contract);
    }
    fetchContract();
  }, []);

  useEffect(() => {
    {contract && updateBalance()}
  }, [contract]);

  const updateBalance = async () => {
    const userAddress = window.ethereum.selectedAddress;
    const userBalance = await contract.getBalance(userAddress);
    const bal = userBalance.toString()
    setBalance(bal);
  };

  const deposit = async () => {
    const tx = await contract.deposit({ value: ethers.parseEther(amount) });
    await tx.wait();
    updateBalance();
  };

  const withdraw = async () => {
    const tx = await contract.withdraw(ethers.parseEther(amount));
    await tx.wait();
    updateBalance();
  };

  return (
    <div className="App">
      <h1>SimpleLending React App</h1>
      <p>Your Balance: {balance} ETH</p>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={deposit}>Deposit</button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
}

export default App;
