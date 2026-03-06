import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Mail, Lock, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const type = searchParams.get('type') as 'student' | 'recruiter' | null;
    const returnTo = searchParams.get('returnTo');

    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [resetMessage, setResetMessage] = useState('');

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (email && password) {
                // Success simulation
                setIsLoading(false);
                login(type || 'student');

                if (type === 'recruiter') {
                    navigate('/dashboard/recruiter');
                } else {
                    navigate(returnTo || '/projects');
                }
            } else {
                setError('Please enter both email and password.');
                setIsLoading(false);
            }
        }, 1500);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // Simulate Google OAuth redirect
        setTimeout(() => {
            setIsLoading(false);
            login(type || 'student');

            if (type === 'recruiter') {
                navigate('/dashboard/recruiter');
            } else {
                navigate(returnTo || '/projects');
            }
        }, 1000);
    };

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address to reset your password.');
            return;
        }
        setIsLoading(true);
        setError('');
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setResetMessage('If an account exists with this email, you will receive a password reset link shortly.');
            setTimeout(() => {
                setIsResettingPassword(false);
                setResetMessage('');
            }, 5000);
        }, 1000);
    };

    if (!type) {
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
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500 dark:from-brand-400 dark:to-purple-400">ProjectMatch</span>
                    </h2>
                    <p className="mt-3 text-center text-base text-slate-600 dark:text-slate-400">
                        Choose how you want to continue
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="glass-card py-10 px-6 sm:px-10">
                        <div className="space-y-5">
                            <Link to="/login?type=student" className="relative group block w-full">
                                <div className="absolute inset-0 bg-brand-500/20 rounded-[1.25rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative flex items-center p-5 border border-slate-200 dark:border-white/10 hover:border-brand-500/50 rounded-[1.25rem] transition-all bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="p-3.5 bg-brand-500/10 text-brand-400 rounded-xl group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300">
                                            <GraduationCap className="w-7 h-7" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Student</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Find projects and build experience</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/login?type=recruiter" className="relative group block w-full">
                                <div className="absolute inset-0 bg-purple-500/20 rounded-[1.25rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative flex items-center p-5 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 rounded-[1.25rem] transition-all bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                                            <Briefcase className="w-7 h-7" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recruiter</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Post projects and find top talent</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                            Register for free
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                <div className="flex justify-center mb-6">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-brand-500 to-purple-600 p-3 rounded-2xl shadow-xl shadow-brand-500/20 group-hover:shadow-brand-500/40 group-hover:scale-105 transition-all duration-300">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                    </Link>
                </div>
                <h2 className="mt-2 text-center text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-slate-900 dark:text-white">
                    Sign in as {type === 'recruiter' ? 'Recruiter' : 'Student'}
                </h2>
                <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">
                    Or{' '}
                    <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors pointer-events-auto">
                        sign in as a different user type
                    </Link>
                </p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="glass-card py-10 px-6 sm:px-10 relative overflow-hidden">

                    {/* Decorative blob */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl"></div>

                    {error && (
                        <div className="mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {resetMessage && (
                        <div className="mb-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl flex items-start gap-3">
                            <p className="text-sm font-medium">{resetMessage}</p>
                        </div>
                    )}

                    {isResettingPassword ? (
                        <form className="space-y-6 relative z-10" onSubmit={handlePasswordReset}>
                            <div>
                                <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="reset-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all input-interactive"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-brand-500/20 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 btn-interactive"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Send Reset Link'}
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => { setIsResettingPassword(false); setError(''); }}
                                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    Back to sign in
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6 relative z-10" onSubmit={handleEmailLogin}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all input-interactive"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all input-interactive"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end text-sm">
                                <button type="button" onClick={() => { setIsResettingPassword(true); setError(''); }} className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
                                    Forgot password?
                                </button>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-brand-500/20 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 btn-interactive"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Sign in'}
                                </button>
                            </div>
                        </form>
                    )}
                    {type !== 'recruiter' && (
                        <div className="mt-8 relative z-10">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 rounded-full">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 btn-interactive"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                        Register for free
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
