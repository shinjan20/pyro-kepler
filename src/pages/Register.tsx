import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Mail, Lock, User, AlertCircle, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const isRecruiter = searchParams.get('type') === 'recruiter';
    const returnTo = searchParams.get('returnTo');

    const handleEmailRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (!name || !email || !password || (isRecruiter && (!companyName || !companyWebsite))) {
                setError('Please fill out all fields.');
                setIsLoading(false);
                return;
            }

            if (isRecruiter) {
                const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];
                const domain = email.split('@')[1]?.toLowerCase();
                if (!domain || publicDomains.includes(domain)) {
                    setError('Recruiters must register with a valid company email address.');
                    setIsLoading(false);
                    return;
                }
            }

            // Success simulation
            setIsLoading(false);

            if (isRecruiter) {
                login('recruiter');
                navigate('/dashboard/recruiter');
            } else {
                login('student');
                navigate(returnTo || '/projects');
            }
        }, 1500);
    };

    const handleGoogleRegister = () => {
        setIsLoading(true);
        // Simulate Google OAuth redirect
        setTimeout(() => {
            setIsLoading(false);
            login('student');
            navigate(returnTo || '/projects');
        }, 1000);
    };

    return (
        <div className="relative min-h-screen pt-24 pb-12 flex flex-col justify-center sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#030712] transition-colors duration-500 overflow-hidden">
            {/* Animated Mesh Background Splashes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/20 dark:bg-brand-500/10 blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen"></div>
                {/* Noise texture overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-brand-500 to-purple-600 p-3 rounded-2xl shadow-xl shadow-brand-500/20 group-hover:shadow-brand-500/40 group-hover:scale-105 transition-all duration-300">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                    </Link>
                </div>
                <h2 className="mt-2 text-center text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-slate-900 dark:text-white">
                    {isRecruiter ? 'Join as a ' : 'Join as a '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500 dark:from-brand-400 dark:to-purple-400">
                        {isRecruiter ? 'Recruiter' : 'Student'}
                    </span>
                </h2>
                <p className="mt-3 text-center text-base text-slate-600 dark:text-slate-400">
                    {isRecruiter ? 'Find top talent through live projects' : 'Build experience with real-world projects'}
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="glass-card py-8 px-6 sm:px-10 relative overflow-hidden">
                    {/* Decorative blob */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl"></div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in zoom-in duration-300">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="space-y-5 relative z-10" onSubmit={handleEmailRegister}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                Full name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all input-interactive"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {isRecruiter && (
                            <>
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                        Company Name
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Briefcase className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                        </div>
                                        <input
                                            id="companyName"
                                            name="companyName"
                                            type="text"
                                            required={isRecruiter}
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all input-interactive"
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="companyWebsite" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                        Company Website
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Globe className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                        </div>
                                        <input
                                            id="companyWebsite"
                                            name="companyWebsite"
                                            type="url"
                                            required={isRecruiter}
                                            value={companyWebsite}
                                            onChange={(e) => setCompanyWebsite(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all input-interactive"
                                            placeholder="https://acme.com"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                Email address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all input-interactive"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all input-interactive"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-500 ml-1">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full flex justify-center py-3.5 px-4 rounded-2xl shadow-md shadow-brand-500/20 text-white font-bold text-base focus:outline-none overflow-hidden group/btn bg-brand-600 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 opacity-100 group-hover/btn:opacity-90 transition-opacity"></div>
                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover/btn:w-56 group-hover/btn:h-56 opacity-10 blur-xl"></span>
                                <span className="relative flex items-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </>
                                    ) : 'Create account'}
                                </span>
                            </button>
                        </div>
                    </form>

                    {!isRecruiter && (
                        <div className="mt-8 relative z-10">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-3 bg-white dark:bg-slate-900 text-slate-500 rounded-full text-xs font-semibold tracking-wide uppercase">
                                        Or sign up with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={handleGoogleRegister}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm bg-white dark:bg-[#0f172a]/50 hover:bg-slate-50 dark:hover:bg-[#1e293b]/80 text-sm font-medium text-slate-700 dark:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                        <path d="M1 1h22v22H1z" fill="none" />
                                    </svg>
                                    Continue with Google
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-500 relative z-10">
                    By registering, you agree to our{' '}
                    <a href="#" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Terms of Service</a> and{' '}
                    <a href="#" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">Privacy Policy</a>.
                </p>

                <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 relative z-10">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
