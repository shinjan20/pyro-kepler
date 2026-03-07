import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_PROJECTS, MOCK_MESSAGES } from '../constants';
import { Briefcase, CheckCircle2, Archive, Clock, Home, Banknote, Calendar, Tag, X, CalendarCheck, MessageSquare, Download, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentMessagingHub from '../components/student/StudentMessagingHub';

const timeAgo = (dateInput?: string) => {
    if (!dateInput) return 'Recently';
    const seconds = Math.floor((new Date().getTime() - new Date(dateInput).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return 'Just now';
};

export default function StudentDashboard() {
    const { userName, userRole } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'applied' | 'interviews' | 'ongoing' | 'messages' | 'archived'>('applied');
    const [viewingApplicationId, setViewingApplicationId] = useState<number | null>(null);
    const [downloadingLetter, setDownloadingLetter] = useState<{ projectId: number, type: 'Offer Letter' | 'Completion Letter' } | null>(null);
    const [threads, setThreads] = useState<any[]>(() => {
        // Hydrate threads with project/company data for the demo
        return MOCK_MESSAGES.map(thread => {
            const project = MOCK_PROJECTS.find(p => p.id.toString() === thread.projectId);
            return {
                ...thread,
                projectName: project?.title || 'Unknown Project',
                companyName: project?.company || 'Unknown Company'
            }
        });
    });

    // Read applications from localStorage
    const savedApps = JSON.parse(localStorage.getItem('pyroApplications') || '[]');
    const appliedProjectIds = savedApps.map((app: any) => app.projectId);

    // Get actual project details for applied projects
    const appliedProjects = MOCK_PROJECTS.filter(p => appliedProjectIds.includes(p.id));

    // Simulate different project lists by slicing MOCK_PROJECTS for demo purposes
    const ongoingProjects = [MOCK_PROJECTS[2]];
    const interviewProjects = MOCK_PROJECTS.slice(1, 2);
    // Grouping completed and rejected mock data into "archived"
    const archivedProjects = [
        { ...MOCK_PROJECTS[3], archiveStatus: 'Interview Rejected', archiveStatusColor: 'text-red-500 bg-red-500/10' },
        { ...MOCK_PROJECTS[4], archiveStatus: 'Completed', archiveStatusColor: 'text-brand-500 bg-brand-500/10' },
        { ...MOCK_PROJECTS[0], archiveStatus: 'Positions Filled', archiveStatusColor: 'text-slate-500 bg-slate-500/10' },
        { ...MOCK_PROJECTS[1], archiveStatus: 'Expired', archiveStatusColor: 'text-amber-500 bg-amber-500/10' }
    ];

    if (userRole !== 'student') {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold">Unauthorized. Students only.</h2>
            </div>
        );
    }

    const renderProjectsList = (projects: typeof MOCK_PROJECTS, emptyMessage: string, iconType: 'archive' | 'rejected' | 'briefcase' = 'briefcase') => {
        if (projects.length === 0) {
            return (
                <div className="col-span-full py-20 px-6 glass-card text-center flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-[2rem] mb-6 shadow-inner relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-brand-500/5 rounded-[2rem] animate-pulse"></div>
                        {iconType === 'archive' && <Archive className="w-12 h-12 text-slate-400 relative z-10" />}
                        {iconType === 'rejected' && <XCircle className="w-12 h-12 text-slate-400 relative z-10" />}
                        {iconType === 'briefcase' && <Briefcase className="w-12 h-12 text-slate-400 relative z-10" />}
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">Nothing to see here</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{emptyMessage}</p>

                    {iconType === 'briefcase' && (
                        <button
                            onClick={() => navigate('/projects')}
                            className="mt-8 px-6 py-3 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-600 dark:text-brand-400 font-bold rounded-xl transition-all flex items-center gap-2 btn-interactive"
                        >
                            Browse matching projects
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                {projects.map(project => (
                    <div
                        key={project.id}
                        className="glass-card p-4 sm:p-6 flex flex-col group/card hover:border-brand-500/50 transition-all"
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <span className="inline-flex px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-bold tracking-widest uppercase">
                                {project.category}
                            </span>
                            {activeTab === 'ongoing' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Hired
                                </span>
                            )}
                            {activeTab === 'archived' && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${(project as any).archiveStatusColor}`}>
                                    <Archive className="w-3.5 h-3.5" /> {(project as any).archiveStatus}
                                </span>
                            )}
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

                        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                            {project.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="flex items-center text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                    <Tag className="w-3 h-3 mr-1 opacity-50" /> {tag}
                                </span>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <div className="flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1" /> Applied {timeAgo(project.postedAt)}
                            </div>
                            <div className="flex items-center gap-2">
                                {activeTab === 'applied' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setViewingApplicationId(project.id);
                                        }}
                                        className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300"
                                    >
                                        View Application
                                    </button>
                                )}
                                {activeTab === 'ongoing' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDownloadingLetter({ projectId: project.id, type: 'Offer Letter' });

                                            // Simulate downloading and then auto-close
                                            setTimeout(() => {
                                                setDownloadingLetter(null);
                                            }, 2500);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 rounded-lg font-semibold transition-colors btn-interactive"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Offer Letter
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="relative min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[0%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10 text-center lg:text-left">
                    <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white mb-2">
                        Student <span className="text-brand-500">Dashboard</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Welcome back, {userName}. Track your project applications and offers here.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Navigation Cards */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-3">
                        <button
                            onClick={() => setActiveTab('applied')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${activeTab === 'applied'
                                ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <span className="flex items-center font-bold">
                                <Briefcase className={`w-5 h-5 mr-3 ${activeTab === 'applied' ? 'text-white' : 'text-brand-500'}`} />
                                Applied
                            </span>
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${activeTab === 'applied' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                {appliedProjects.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('interviews')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${activeTab === 'interviews'
                                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <span className="flex items-center font-bold">
                                <CalendarCheck className={`w-5 h-5 mr-3 ${activeTab === 'interviews' ? 'text-white' : 'text-amber-500'}`} />
                                Interviews
                            </span>
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${activeTab === 'interviews' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                {interviewProjects.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('ongoing')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${activeTab === 'ongoing'
                                ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-500/20'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-green-600 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <span className="flex items-center font-bold">
                                <CheckCircle2 className={`w-5 h-5 mr-3 ${activeTab === 'ongoing' ? 'text-white' : 'text-green-500'}`} />
                                Ongoing
                            </span>
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${activeTab === 'ongoing' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                {ongoingProjects.length}
                            </span>
                        </button>



                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${activeTab === 'messages'
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-600 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <span className="flex items-center font-bold">
                                <MessageSquare className={`w-5 h-5 mr-3 ${activeTab === 'messages' ? 'text-white' : 'text-purple-500'}`} />
                                Messages
                            </span>
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${activeTab === 'messages' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                {threads.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('archived')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${activeTab === 'archived'
                                ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-700 shadow-md shadow-slate-900/20'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-500 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <span className="flex items-center font-bold">
                                <Archive className={`w-5 h-5 mr-3 ${activeTab === 'archived' ? 'text-white' : 'text-slate-500'}`} />
                                Archived
                            </span>
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${activeTab === 'archived' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                {archivedProjects.length}
                            </span>
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                                {activeTab} Projects
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {activeTab === 'applied' && "Projects you have recently applied to."}
                                {activeTab === 'interviews' && "Projects where you have been accepted for an interview."}
                                {activeTab === 'ongoing' && "Congratulations! You have been hired for these projects."}
                                {activeTab === 'messages' && "Communications with recruiters for your applied projects."}
                                {activeTab === 'archived' && "Projects that have concluded. View them here, but completion certificates live on the Completed Projects page."}
                            </p>
                        </div>

                        {activeTab === 'applied' && renderProjectsList(appliedProjects, "You haven't applied to any live projects yet. Start hunting to build your portfolio!", 'briefcase')}
                        {activeTab === 'interviews' && renderProjectsList(interviewProjects, "You don't have any scheduled interviews right now. Keep applying to land one!", 'briefcase')}
                        {activeTab === 'ongoing' && renderProjectsList(ongoingProjects, "You aren't currently part of any active selections. Your time will come!", 'briefcase')}
                        {activeTab === 'messages' && <StudentMessagingHub threads={threads} setThreads={setThreads} />}
                        {activeTab === 'archived' && renderProjectsList(archivedProjects as any, "None of your recent applications have been archived yet.", 'archive')}
                    </div>
                </div>
            </div>

            {/* View Application Modal */}
            {viewingApplicationId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setViewingApplicationId(null)}
                    />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-brand-500/10 border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                            <div>
                                <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                                    Application Details
                                </h2>
                                <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mt-0.5">
                                    {MOCK_PROJECTS.find(p => p.id === viewingApplicationId)?.title} at {MOCK_PROJECTS.find(p => p.id === viewingApplicationId)?.company}
                                </p>
                            </div>
                            <button
                                onClick={() => setViewingApplicationId(null)}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto hide-scrollbar space-y-6">
                            {(() => {
                                const app = savedApps.find((a: any) => a.projectId === viewingApplicationId);
                                if (!app) return <p>Application not found.</p>;
                                return (
                                    <>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cover Letter</h3>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                                {app.coverLetter}
                                            </div>
                                        </div>
                                        {app.portfolioUrl && (
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Portfolio URL</h3>
                                                <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">
                                                    {app.portfolioUrl}
                                                </a>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Availability</h3>
                                            <p className="text-slate-700 dark:text-slate-300 capitalize">{app.availability.replace(/_/g, ' ')}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Applied On</h3>
                                            <p className="text-slate-700 dark:text-slate-300">{new Date(app.appliedAt).toLocaleDateString()}</p>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Download Popup */}
            {downloadingLetter && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-none">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
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
