import { Search, FileEdit, Award } from 'lucide-react';

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-12 sm:py-16 md:py-24 bg-slate-50 dark:bg-slate-950 scroll-mt-20 md:scroll-mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
                        How ProjectMatch Works
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                        A simple 3-step process to bridge the gap between academic learning and industry experience.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 relative">
                    {/* Connecting line (hidden on mobile/tablet) */}
                    <div className="hidden lg:block absolute top-[72px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-brand-100 via-brand-500 to-brand-100 dark:from-brand-900 dark:via-brand-500 dark:to-brand-900 z-0 opacity-50"></div>

                    {[
                        {
                            step: '01',
                            title: 'Discover Projects',
                            description: 'Browse through our curated list of live projects from top companies in your field of study.',
                            icon: <Search className="w-8 h-8 text-white" />,
                            color: 'bg-blue-500',
                            shadow: 'shadow-blue-500/30'
                        },
                        {
                            step: '02',
                            title: 'Apply & Work',
                            description: 'Submit your application. Once accepted, collaborate directly with industry professionals and mentors.',
                            icon: <FileEdit className="w-8 h-8 text-white" />,
                            color: 'bg-brand-500',
                            shadow: 'shadow-brand-500/30'
                        },
                        {
                            step: '03',
                            title: 'Build Experience',
                            description: 'Deliver real impact, earn certificates, and add verified industry experience to your resume.',
                            icon: <Award className="w-8 h-8 text-white" />,
                            color: 'bg-purple-500',
                            shadow: 'shadow-purple-500/30'
                        }
                    ].map((item, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2 hover:drop-shadow-xl bg-white dark:bg-slate-900/50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl ${item.color} shadow-lg ${item.shadow} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                {item.icon}
                            </div>
                            <div className="text-brand-600 dark:text-brand-400 font-bold text-xs sm:text-sm tracking-widest uppercase mb-1 sm:mb-2">
                                Step {item.step}
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2 sm:mb-3">
                                {item.title}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
