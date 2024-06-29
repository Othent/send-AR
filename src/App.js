import React, { useState } from 'react';
import './App.css';
import * as othent from "@othent/kms";
import Arweave from "arweave";

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const userDetails = await othent.connect();
    setIsLoggedIn(true);
    const getBalance = await arweave.wallets.getBalance(
      userDetails.walletAddress,
    );
    const arBalance = arweave.ar.winstonToAr(getBalance);

    setBalance(arBalance);
    setUserEmail(userDetails.email);
    setUserWalletAddress(userDetails.walletAddress);
  };

  const handleSend = () => {
    setConfirmationVisible(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setTransactionStatus("");
    setConfirmationVisible(false);

    try {
      const transaction = await arweave.createTransaction({
        target: walletAddress,
        quantity: arweave.ar.arToWinston(amount),
      });

      const signedTxn = await othent.sign(transaction);

      const postedTxn = await arweave.transactions.post(signedTxn);

      const txID = transaction.id;

      if (postedTxn.status === 200) {
        setTransactionStatus(
          `Transaction successful. View on <a href="https://viewblock.io/arweave/tx/${txID}" target="_blank">Viewblock</a>`
        );
      } else {
        setTransactionStatus("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setTransactionStatus("Transaction failed. Please try again.");
    }

    setLoading(false);
    setWalletAddress("");
    setAmount("");
  };

  const handleCancel = () => {
    setConfirmationVisible(false);
  };

  return (
    <main className="main">
      {!isLoggedIn ? (
        <button className="loginButton" onClick={handleLogin}>
          Login with Othent
        </button>
      ) : (
        <div className="container">
          <p className="userInfo">Email: {userEmail}</p>
          <p className="userInfo">Wallet Address: {userWalletAddress}</p>
          <p className="balance">Current Balance: {balance} AR</p>
          <input
            type="text"
            placeholder="Recipient wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="input"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />
          <button className="sendButton" onClick={handleSend}>
            Send
          </button>
          {confirmationVisible && (
            <div className="confirmationModal">
              <p>
                You are about to send {amount} AR to {walletAddress}
              </p>
              <div className="confirmationButtons">
                <button
                  className="confirmButton"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
                <button className="cancelButton" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          {loading && <p>Sending transaction...</p>}
          {transactionStatus && (
            <p dangerouslySetInnerHTML={{ __html: transactionStatus }}></p>
          )}
        </div>
      )}
    </main>
  );
}

export default App;