import { useEffect, useState } from 'react';
import { useStatus } from '../hooks/useStatus';
import { UserInfo } from './UserInfo';
import { ConfirmModal } from './ConfirmModal';

export function Content() {
    const [walletAddress, setWalletAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [txStatus, setTxStatus] = useState('');
    const [txId, setTxId] = useState('');
    const [loading, setLoading] = useState(false);
    const { othent, arweave, connected, setBalance } = useStatus();

    useEffect(() => {
        if (!connected) return;

        const updateBalance = async () => {
            const getBalance = await arweave.wallets.getBalance(
                othent.getSyncUserDetails()?.walletAddress as string
            );
            const arBalance = arweave.ar.winstonToAr(getBalance);
            setBalance(arBalance);
        };

        updateBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected]);

    const handleSend = () => {
        setConfirmationVisible(true);
    };

    const reset = () => {
        setWalletAddress('');
        setAmount('');
        setLoading(false);
        setConfirmationVisible(false);
        setTxId('');
        setTxStatus('');
    };

    const handleConfirm = async (confirm: boolean) => {
        if (!confirm) {
            setConfirmationVisible(false);
            return;
        }

        setLoading(true);
        setTxStatus('');
        setConfirmationVisible(false);

        try {
            const transaction = await arweave.createTransaction({
                target: walletAddress,
                quantity: arweave.ar.arToWinston(amount),
            });
            const signedTx = await othent.sign(transaction);
            const postedTx = await arweave.transactions.post(signedTx);
            setTxId(signedTx.id);
            setTxStatus(`${postedTx.status}`);
            console.log(signedTx);
            console.log(postedTx);
        } catch (error) {
            console.error(error);
            setTxStatus('999');
        }

        setLoading(false);
        setWalletAddress('');
        setAmount('');
    };

    if (!connected) return 'Please Login to continue';

    return (
        <main className="rounded-lg bg-slate-100 px-16 py-10 shadow-lg shadow-slate-400 dark:bg-slate-900 dark:shadow-slate-600">
            <div className="flex flex-col items-center space-y-4">
                <UserInfo />
                <div className="flex flex-col items-center space-y-4">
                    <input
                        type="text"
                        placeholder="Recipient wallet address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-80 rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-80 rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                    <button
                        className="rounded-lg bg-[#28a745] px-10 py-2 text-xl font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:hover:opacity-100"
                        onClick={handleSend}
                        disabled={
                            !amount ||
                            !walletAddress ||
                            confirmationVisible ||
                            loading
                        }
                    >
                        Send
                    </button>
                    {loading && <p>Sending transaction...</p>}
                    {txStatus && (
                        <div>
                            {txStatus === '200' ? (
                                <div>
                                    Transaction successful. View on{' '}
                                    <a
                                        className="font-bold hover:underline"
                                        href={`https://viewblock.io/arweave/tx/${txId}`}
                                        target="_blank"
                                    >
                                        Viewblock
                                    </a>
                                </div>
                            ) : (
                                <div>
                                    Transaction failed. Please{' '}
                                    <a
                                        className="cursor-pointer text-blue-600 underline"
                                        onClick={reset}
                                    >
                                        clear the form
                                    </a>{' '}
                                    and try again.
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {confirmationVisible && (
                    <ConfirmModal handleConfirm={handleConfirm}>
                        <p>
                            You are about to{' '}
                            <span className="font-bold">send {amount} AR</span>{' '}
                            to{' '}
                            <span className="font-bold">{walletAddress}</span>
                        </p>
                    </ConfirmModal>
                )}
            </div>
        </main>
    );
}
