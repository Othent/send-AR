import { Content } from '../components/Content';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function MainLayout() {
    return (
        <div className="flex h-screen flex-col place-content-between items-center bg-slate-200 p-4 text-slate-950 dark:bg-slate-800 dark:text-slate-50">
            <Header />
            <Content />
            <Footer />
        </div>
    );
}
