import React, { useState, ReactNode, useMemo, useEffect } from 'react';
import { StatusContext } from '../hooks/useStatus';
import { Othent } from '@othent/kms';
import Arweave from 'arweave';
import { APP_INFO } from '../utils/constants';

export const StatusProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState('0');
    const othent = useMemo(
        () => new Othent({ appInfo: APP_INFO, persistLocalStorage: true }),
        []
    );
    const arweave = useMemo(() => Arweave.init({}), []);

    useEffect(() => {
        if (othent.getSyncUserDetails()?.walletAddress) setConnected(true);
    }, [othent]);

    return (
        <StatusContext.Provider
            value={{
                othent,
                arweave,
                connected,
                setConnected,
                balance,
                setBalance,
            }}
        >
            {children}
        </StatusContext.Provider>
    );
};
