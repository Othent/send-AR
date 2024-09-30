import { LoginButton } from './LoginButton';

export function Header() {
    return (
        <div className="flex w-full place-content-between">
            <img className="w-14" src="/icon.svg" alt="logo" />
            <div className="text-5xl"> </div>
            <LoginButton />
        </div>
    );
}
