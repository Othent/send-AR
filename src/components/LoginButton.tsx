import { useEffect } from 'react';
import { useStatus } from '../hooks/useStatus';

export function LoginButton() {
    const { othent, connected, setConnected } = useStatus();

    useEffect(() => {
        const checkConnected = async () => {
            const userDetails = await othent.getUserDetails();
            if (!userDetails) setConnected(false);
            else setConnected(true);
        };
        checkConnected();
    }, []);

    const handleLogin = async () => {
        const userDetails = await othent.connect();
        if (userDetails?.walletAddress) setConnected(true);
        else setConnected(false);
    };

    const handleLogout = async () => {
        await othent.disconnect();
        setConnected(false);
    };

    if (!connected)
        return (
            <button
                className="rounded-lg bg-[#2375EF] px-10 py-2 font-semibold text-white hover:opacity-90"
                onClick={handleLogin}
            >
                Login with Othent
            </button>
        );

    return (
        <button
            className="rounded-lg bg-[#2375EF] px-10 py-2 font-semibold text-white hover:opacity-90"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
}
