import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HERO_COMPANIES, HERO_STATS } from '../constants';

const Hero = () => {
    return (
        <div className="relative min-h-[95vh] flex flex-col justify-center pt-20 pb-12 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
            {/* Animated Mesh Background Splashes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/20 dark:bg-brand-500/10 blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen"></div>
                {/* Noise texture overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
                <div className="text-center max-w-4xl mx-auto">

                    {/* Glowing Notification Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/30 dark:border-brand-400/20 text-brand-700 dark:text-brand-300 font-medium text-sm mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)] animate-in fade-in slide-in-from-bottom-4 duration-700 z-20 relative">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                        </span>
                        New exclusive WFH live projects added weekly
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/20 to-purple-500/20 blur-md -z-10"></div>
                    </div>

                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-heading font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 animate-gradient">Edge</span> with 100% Remote Experience
                    </h1>

                    <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Connect with top companies globally. Work exclusively on Work-From-Home (WFH) engineering and management projects. <span className="text-slate-900 dark:text-slate-200">Stand out before you graduate.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link to="/register?type=student" className="group w-full sm:w-auto relative p-[1px] rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/20 active:scale-95 transition-all duration-300">
                            {/* Animated Border Gradient */}
                            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-lg py-4 px-8 rounded-[15px] transition-all relative overflow-hidden h-full z-10 w-full group-hover:bg-slate-800 dark:group-hover:bg-slate-100">
                                Join as a Student <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        <Link to="/register?type=recruiter" className="w-full sm:w-auto flex items-center justify-center gap-2 glass text-slate-900 dark:text-white hover:bg-white/80 dark:hover:bg-slate-800/80 font-semibold text-lg py-4 px-8 rounded-2xl transition-all hover:shadow-xl hover:shadow-brand-500/10 group active:scale-95 border border-slate-300 dark:border-slate-700">
                            <Briefcase className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-brand-500 transition-colors" /> Hire Talent
                        </Link>
                    </div>
                </div>

                <div className="mt-24 w-full max-w-7xl mx-auto">
                    <p className="text-center text-xs font-bold text-slate-500 tracking-[0.2em] uppercase mb-8 opacity-80">
                        Trusted by hyper-growth teams globally
                    </p>

                    {/* Glass Marquee Container */}
                    <div className="glass rounded-3xl py-8 border border-white/40 dark:border-white/5 relative overflow-hidden mask-edges shadow-xl shadow-brand-500/5">
                        <div className="flex overflow-hidden relative group [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                            <div className="flex items-center gap-16 md:gap-24 animate-scroll whitespace-nowrap min-w-max px-8">
                                {[...HERO_COMPANIES, ...HERO_COMPANIES].map((company, index) => (
                                    <div key={index} className={`flex items-center gap-3 text-slate-400 dark:text-slate-500 transition-all duration-300 cursor-default grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:scale-105 ${company.colorHoverClass}`}>
                                        <company.icon className="w-8 h-8 md:w-10 md:h-10" />
                                        <span className="text-2xl md:text-3xl font-bold font-heading">{company.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Stats Grid */}
                <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
                    {HERO_STATS.map((stat, i) => (
                        <div key={i} className="glass-card p-6 flex flex-col items-center justify-center gap-1 text-center group">
                            <div className="text-4xl sm:text-5xl font-heading font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 group-hover:scale-110 transition-transform duration-500">
                                {stat.count}
                            </div>
                            <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">{stat.label}</div>
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
