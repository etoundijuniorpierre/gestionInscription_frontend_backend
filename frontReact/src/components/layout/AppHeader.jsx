import Logo from '../common/Logo';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import './AppHeader.css';

const AppHeader = () => {
    return (
        <>
            <style>
                {/* Your custom CSS for underline-from-center */}
            </style>
            <nav className="z-50 bg-white shadow-md py-[0.65rem] px-6 md:px-12">
                <div className="flex items-center justify-between max-w-full mx-auto">
                    <Logo />
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex space-x-6 text-lg font-medium text-[#000]">
                            <Link
                                to="/"
                                className="underline-from-center hover:text-[#2A3B7C] pb-1 transition duration-800"
                            >
                                Accueil
                            </Link>
                            <a
                                href="#nos-filieres"
                                className="underline-from-center hover:text-[#2A3B7C] pb-1 transition duration-800"
                            >
                                Nos Formations
                            </a>
                            <a
                                href="#contact"
                                className="underline-from-center hover:text-[#2A3B7C] pb-1 transition duration-800"
                            >
                                Contact
                            </a>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/register">
                                {/* Add w-40 class to enforce a consistent width */}
                                <Button primary className="w-40">
                                    S'inscrire
                                </Button>
                            </Link>
                            <Link to="/login">
                                {/* Add w-40 class to enforce a consistent width */}
                                <Button secondary className="w-40">
                                    Se connecter
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default AppHeader;