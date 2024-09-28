import { useStatus } from '../hooks/useStatus';

export function UserInfo() {
    const { othent, balance } = useStatus();

    const shortenAddress = (addr: string | undefined) =>
        !addr ? '' : addr.slice(0, 8) + '...' + addr.slice(-8);

    return (
        <div className="grid grid-cols-[auto_auto] items-end gap-x-2 gap-y-1">
            <div className="col-span-2 place-self-center">
                {othent.getSyncUserDetails()?.picture && (
                    <img
                        className="w-20 rounded-full"
                        src={othent.getSyncUserDetails()?.picture}
                        alt="avatar"
                    />
                )}
            </div>
            <div className="place-self-end">Email:</div>
            <div className="font-semibold">
                {othent.getSyncUserDetails()?.email}
            </div>

            <div className="place-self-end">Address: </div>
            <div className="font-semibold">
                <a
                    className="hover:underline"
                    target="_blank"
                    href={`https://viewblock.io/arweave/address/${othent.getSyncUserDetails()?.walletAddress}`}
                >
                    {shortenAddress(othent.getSyncUserDetails()?.walletAddress)}
                </a>
            </div>
            <div className="place-self-end">Balance: </div>
            <div className="font-extrabold">{balance} AR</div>
        </div>
    );
}
