import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_PROJECTS } from '../constants';
import { CheckCircle2, Clock, Home, Banknote, Tag, FileText, Download, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CompletedProjects() {
    const { userRole } = useAuth();
    const navigate = useNavigate();
    const [downloadingLetter, setDownloadingLetter] = useState<{ projectId: number, type: 'Certificate' | 'Completion Letter' } | null>(null);

    // Filter out only completed mock projects for demonstration
    const completedProjects = [MOCK_PROJECTS[4]];

    if (userRole !== 'student') {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold">Unauthorized. Students only.</h2>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[0%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <CheckCircle2 className="w-10 h-10 text-brand-500" />
                            Completed <span className="text-brand-500">Projects</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                            Review your successful collaborations, showcase your experience, and download your hard-earned certificates of completion.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/student')}
                        className="flex-shrink-0 text-sm font-medium px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors shadow-sm"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    {completedProjects.length === 0 ? (
                        <div className="py-20 px-6 glass-card text-center flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700">
                            <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-[2rem] mb-6 shadow-inner relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-brand-500/5 rounded-[2rem] animate-pulse"></div>
                                <GraduationCap className="w-12 h-12 text-slate-400 relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">No completed projects yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Finish your ongoing projects successfully to build your verified portfolio visible to recruiters here.</p>

                            <button
                                onClick={() => navigate('/projects')}
                                className="mt-8 px-6 py-3 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-600 dark:text-brand-400 font-bold rounded-xl transition-all flex items-center gap-2 "
                            >
                                Find New Projects
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedProjects.map(project => (
                                <div
                                    key={project.id}
                                    className="glass-card p-6 flex flex-col group/card hover:border-brand-500/50 transition-all opacity-90 hover:opacity-100"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <span className="inline-flex px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-bold tracking-widest uppercase">
                                            {project.category}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-800">
                                            Finished
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                                        {project.title}
                                    </h3>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center font-bold text-sm text-slate-500 border border-slate-200 dark:border-slate-800">
                                            {project.company.charAt(0)}
                                        </div>
                                        <span className="text-slate-600 dark:text-slate-400 font-semibold text-sm">
                                            {project.company}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-slate-50/50 dark:bg-[#030712]/50 border border-slate-100 dark:border-slate-800/50 text-sm font-medium">
                                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                                            <Clock className="w-4 h-4 mr-2 text-brand-500" /> {project.duration}
                                        </div>
                                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                                            <Home className="w-4 h-4 mr-2 text-purple-500" /> {project.type}
                                        </div>
                                        <div className="flex items-center text-slate-700 dark:text-slate-300 font-semibold col-span-2">
                                            <Banknote className="w-4 h-4 mr-2 text-emerald-500" />
                                            {project.remuneration === '0' ? 'Unpaid' : `₹${project.remuneration}/month`}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="flex items-center text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                                <Tag className="w-3 h-3 mr-1 opacity-50" /> {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDownloadingLetter({ projectId: project.id, type: 'Completion Letter' });
                                                    setTimeout(() => setDownloadingLetter(null), 2500);
                                                }}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold rounded-xl transition-all border border-brand-200 dark:border-brand-800"
                                            >
                                                <FileText className="w-4 h-4" /> Download Completion Letter
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDownloadingLetter({ projectId: project.id, type: 'Certificate' });
                                                    setTimeout(() => setDownloadingLetter(null), 2500);
                                                }}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                                            >
                                                <Download className="w-4 h-4" /> Download Certificate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Download Popup */}
            {downloadingLetter && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-none">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
                        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-500/10 rounded-full flex items-center justify-center mb-4 text-brand-500">
                            <Download className="w-8 h-8 animate-bounce" />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                            Downloading {downloadingLetter.type}...
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Please wait while we prepare your document.
                        </p>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-6 overflow-hidden">
                            <div className="bg-brand-500 h-full rounded-full animate-pulse w-full origin-left shrink-0 transition-all duration-1000"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
