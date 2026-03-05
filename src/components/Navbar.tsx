import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { userRole, userName, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full max-w-7xl mx-auto left-0 right-0 top-4 z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 ${isScrolled ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
            }`}>
            <div className={`transition-all duration-500 rounded-2xl mx-auto ${isScrolled ? 'glass shadow-xl shadow-brand-500/5 border border-white/20 dark:border-slate-800/60' : 'bg-transparent border-transparent'}`}>
                <div className="flex justify-between items-center h-16 md:h-20 px-4 md:px-8">
                    <Link
                        to={isAuthenticated ? (userRole === 'recruiter' ? '/dashboard/recruiter' : '/projects') : '/'}
                        className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="bg-gradient-to-r from-brand-500 to-purple-600 p-2 md:p-2.5 rounded-xl shadow-lg shadow-brand-500/20">
                            <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <span className="font-heading font-extrabold text-xl md:text-2xl tracking-tight text-slate-900 dark:text-white">
                            ProjectHub
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {(!isAuthenticated || userRole === 'student') && (
                            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors">Home</Link>
                        )}
                        {(!isAuthenticated || userRole === 'student') && (
                            <Link to="/projects" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors">Find WFH Projects</Link>
                        )}
                        {userRole === 'recruiter' && (
                            <Link to="/dashboard/recruiter" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors">Dashboard</Link>
                        )}
                        {!isAuthenticated && (
                            <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors">How it Works</a>
                        )}
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <span className="max-w-[120px] truncate">{userName}</span>
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{userRole}</p>
                                            </div>
                                            <div className="p-2 flex flex-col gap-1">
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left font-medium"
                                                >
                                                    <SettingsIcon className="w-4 h-4" /> Account Settings
                                                </Link>
                                                <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-left"
                                                >
                                                    <LogOut className="w-4 h-4" /> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="text-white bg-brand-600 hover:bg-brand-700 font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-brand-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all btn-interactive">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 focus:outline-none">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden glass mt-2 rounded-2xl border border-white/20 dark:border-slate-800/60 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
                        {(!isAuthenticated || userRole === 'student') && (
                            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Home</Link>
                        )}
                        {(!isAuthenticated || userRole === 'student') && (
                            <Link to="/projects" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800">Find Projects</Link>
                        )}
                        {userRole === 'recruiter' && (
                            <Link to="/dashboard/recruiter" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</Link>
                        )}
                        {!isAuthenticated && (
                            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">How it Works</a>
                        )}

                        <div className="pt-4 flex flex-col gap-3 px-3">
                            {isAuthenticated ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{userRole}</p>
                                        </div>
                                    </div>

                                    <Link
                                        to="/settings"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center gap-2"
                                    >
                                        <SettingsIcon className="w-5 h-5" /> Account Settings
                                    </Link>

                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-center py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex justify-center items-center gap-2">
                                        <LogOut className="w-5 h-5" /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
