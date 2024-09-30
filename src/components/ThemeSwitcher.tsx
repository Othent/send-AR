import { ClassAttributes, ButtonHTMLAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitcher = (
    props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLButtonElement> &
        ButtonHTMLAttributes<HTMLButtonElement>
) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            // className="text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary"
            {...props}
        >
            {theme === 'light' ? (
                <Moon className={props.className} />
            ) : (
                <Sun className={props.className} />
            )}
        </button>
    );
};

export default ThemeSwitcher;
