import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HERO_COMPANIES, HERO_STATS } from '../constants';

const Hero = () => {
    return (
        <div className="relative min-h-[95vh] w-full max-w-[100vw] flex flex-col justify-center pt-20 pb-12 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
            {/* Animated Mesh Background Splashes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 w-full h-full">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] max-w-[600px] h-[60vw] max-h-[600px] rounded-full bg-brand-500/30 dark:bg-brand-500/20 blur-[100px] md:blur-[140px] animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute top-[15%] right-[-15%] w-[70vw] max-w-[700px] h-[70vw] max-h-[700px] rounded-full bg-pink-500/30 dark:bg-pink-500/20 blur-[100px] md:blur-[140px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute bottom-[-30%] left-[10%] w-[60vw] max-w-[600px] h-[60vw] max-h-[600px] rounded-full bg-purple-500/30 dark:bg-purple-500/20 blur-[100px] md:blur-[140px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen"></div>
                {/* Noise texture overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay w-full h-full" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8 sm:pt-16 flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center justify-center">

                    {/* Glowing Notification Pill */}
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full animated-border-badge backdrop-blur-3xl bg-white/90 dark:bg-slate-900/90 text-brand-700 dark:text-brand-300 font-bold text-sm sm:text-base mb-6 sm:mb-10 shadow-[0_0_30px_rgba(99,102,241,0.25)] dark:shadow-[0_0_30px_rgba(99,102,241,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-700 z-20 relative max-w-[95vw] text-center">
                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600 dark:bg-brand-500"></span>
                        </span>
                        <span>New exclusive live projects added weekly</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[6.5rem] font-heading font-black tracking-tighter text-slate-900 dark:text-white mb-6 sm:mb-8 leading-[1.2] sm:leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 max-w-full break-words px-2">
                        Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-pink-500 to-purple-600 animate-gradient pb-1 sm:pb-2">Edge</span> <br className="hidden sm:block" /> with Remote Experience
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 px-2 sm:px-0 leading-relaxed max-w-full break-words">
                        Connect with top companies globally. Work exclusively on Work-From-Home (WFH) engineering and management projects. <br className="hidden sm:block" /><span className="text-slate-900 dark:text-slate-200 inline-block mt-2">Stand out before you graduate.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-max mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 px-4 sm:px-0">
                        <Link to="/register?type=student" className="group w-full sm:w-auto overflow-hidden relative p-[1px] rounded-2xl btn-interactive">
                            {/* Animated Border Gradient */}
                            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-base sm:text-lg py-3.5 sm:py-4 px-6 sm:px-8 rounded-[15px] transition-all overflow-hidden h-full z-10 w-full group-hover:bg-slate-800 dark:group-hover:bg-slate-100 shadow-2xl shadow-brand-500/20">
                                Join as a Student <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                            </div>
                        </Link>

                        <Link to="/register?type=recruiter" className="w-full sm:w-auto flex items-center justify-center gap-2 glass text-slate-900 dark:text-white hover:bg-white/80 dark:hover:bg-slate-800/80 font-semibold text-base sm:text-lg py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl border border-slate-300 dark:border-slate-700 btn-interactive hover:shadow-brand-500/10 group">
                            <Briefcase className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-brand-500 transition-colors shrink-0" /> Hire Talent
                        </Link>
                    </div>
                </div>

                <div className="mt-16 sm:mt-24 w-full max-w-[100vw] sm:max-w-7xl mx-auto overflow-hidden">
                    <p className="text-center text-xs font-bold text-slate-500 tracking-[0.2em] uppercase mb-8 opacity-80">
                        Trusted by hyper-growth teams globally
                    </p>

                    {/* Glass Marquee Container */}
                    <div className="glass rounded-3xl py-8 border border-white/40 dark:border-white/5 relative overflow-hidden mask-edges shadow-xl shadow-brand-500/5 w-full">
                        <div className="flex overflow-hidden relative w-full group [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)] sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                            <div className="flex items-center gap-12 sm:gap-16 md:gap-24 animate-scroll whitespace-nowrap min-w-max px-4 sm:px-8">
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
                <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0 w-full overflow-hidden">
                    {HERO_STATS.map((stat, i) => (
                        <div key={i} className="glass-card p-4 sm:p-6 flex flex-col items-center justify-center gap-1 text-center group">
                            <div className="text-3xl sm:text-5xl font-heading font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 group-hover:scale-110 transition-transform duration-500">
                                {stat.count}
                            </div>
                            <div className="font-bold text-slate-800 dark:text-slate-200 mt-1 text-sm sm:text-base">{stat.label}</div>
                            <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
