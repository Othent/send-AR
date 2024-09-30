import ThemeSwitcher from '../components/ThemeSwitcher';

export function Footer() {
    return (
        <div className="flex w-full justify-end">
            <ThemeSwitcher className="h-8 w-8 text-3xl" />
        </div>
    );
}
