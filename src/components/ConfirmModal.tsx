import { useState } from 'react';

export interface ConfirmModalProps {
    handleConfirm: (confirm: boolean) => void;
}

export function ConfirmModal(
    props: React.PropsWithChildren<ConfirmModalProps>
) {
    const { children, handleConfirm } = props;
    const [visible, setVisible] = useState(true);

    const handleClick = (confirm: boolean) => {
        handleConfirm(confirm);
        setVisible(false);
    };

    if (!visible) return <></>;

    return (
        <div className="absolute z-10 flex w-[32rem] flex-col items-center justify-center space-y-3 rounded-lg border border-slate-300 bg-slate-50 p-10 shadow-lg shadow-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:shadow-slate-800">
            <div className="flex w-full items-center justify-center text-center">
                {children}
            </div>
            <div className="flex space-x-4">
                <button
                    className="rounded-lg bg-[#28a745] px-10 py-2 text-xl font-semibold text-white hover:opacity-90"
                    onClick={() => handleClick(true)}
                >
                    Confirm
                </button>
                <button
                    className="rounded-lg bg-red-600 px-10 py-2 text-xl font-semibold text-white hover:opacity-90"
                    onClick={() => handleClick(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
