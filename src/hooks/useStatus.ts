import { Othent } from '@othent/kms';
import Arweave from 'arweave';
import { createContext, useContext } from 'react';

export interface StatusContextType {
    connected: boolean;
    setConnected: (connected: boolean) => void;
    othent: Othent;
    arweave: Arweave;
    balance: string;
    setBalance: (balance: string) => void;
}

export const StatusContext = createContext<StatusContextType | undefined>(
    undefined
);

export const useStatus = () => {
    const context = useContext(StatusContext);
    if (context === undefined) {
        throw new Error('useStatus must be used within a StatusProvider');
    }
    return context;
};
