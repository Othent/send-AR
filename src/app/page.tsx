"use client";
import styles from "./page.module.css";
import { useState } from "react";
import * as othent from "@othent/kms";
import Arweave from "arweave";

const arweave = Arweave.init({});

export default function Home() {
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
        setTransactionStatus(`Transaction successful. View on <a href="https://viewblock.io/arweave/tx/${txID}" target="_blank">Viewblock</a>`);
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
    <main className={styles.main}>
      {!isLoggedIn ? (
        <button className={styles.loginButton} onClick={handleLogin}>
          Login with Othent
        </button>
      ) : (
        <div className={styles.container}>
          <p className={styles.userInfo}>Email: {userEmail}</p>
          <p className={styles.userInfo}>Wallet Address: {userWalletAddress}</p>
          <p className={styles.balance}>Current Balance: {balance} AR</p>
          <input
            type="text"
            placeholder="Recipient wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className={styles.input}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.input}
          />
          <button className={styles.sendButton} onClick={handleSend}>
            Send
          </button>
          {confirmationVisible && (
            <div className={styles.confirmationModal}>
              <p>
                You are about to send {amount} AR to {walletAddress}
              </p>
              <div className={styles.confirmationButtons}>
                <button
                  className={styles.confirmButton}
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
                <button className={styles.cancelButton} onClick={handleCancel}>
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