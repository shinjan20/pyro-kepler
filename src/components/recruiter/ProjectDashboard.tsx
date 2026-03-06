import { useState, useEffect } from 'react';
import { X, Briefcase, MapPin, Clock, Users, FileText, Download, GraduationCap } from 'lucide-react';
import type { StudentProfile } from './StudentProfileCard';
import ApplicantReviewView from './ApplicantReviewView';
import WorkingCandidateView from './WorkingCandidateView';

interface ProjectDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
    onArchive?: (projectId: string) => void;
    onAcceptCandidate?: (projectId: string, candidateId: string) => void;
    onDeclineCandidate?: (projectId: string, candidateId: string) => void;
    onMessageWorkingCandidate?: (projectId: string, candidateId: string) => void;
    onSendLetter?: (projectId: string, candidateId: string, type: 'joining' | 'completion', content: string) => void;
    onCompleteProject?: (projectId: string, candidateId: string) => void;
    onRevertCandidate?: (projectId: string, candidateId: string) => void;
    initialTab?: 'details' | 'applicants' | 'archived' | 'working';
}

const ProjectDashboard = ({ isOpen, onClose, project, onArchive, onAcceptCandidate, onDeclineCandidate, onMessageWorkingCandidate, onSendLetter, onCompleteProject, onRevertCandidate, initialTab = 'details' }: ProjectDashboardProps) => {
    const [activeTab, setActiveTab] = useState<'details' | 'applicants' | 'archived' | 'working'>(initialTab);
    const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);
    const [reviewingCandidate, setReviewingCandidate] = useState<StudentProfile | null>(null);
    const [reviewingWorkingCandidate, setReviewingWorkingCandidate] = useState<StudentProfile | null>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    const resetViews = () => {
        setReviewingCandidate(null);
        setReviewingWorkingCandidate(null);
    };

    if (!isOpen || !project) return null;

    const renderCandidateList = (candidates: StudentProfile[], emptyMessage: string, isWorkingList: boolean = false) => {
        if (!candidates || candidates.length === 0) {
            return (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Users className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">{emptyMessage}</h3>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidates.map((candidate: any) => (
                    <div
                        key={candidate.id}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:border-brand-500/50 hover:shadow-md cursor-pointer transition-all"
                        onClick={() => {
                            if (isWorkingList) {
                                setReviewingWorkingCandidate(candidate);
                            } else {
                                setReviewingCandidate(candidate);
                            }
                        }}
                    >
                        {candidate.photoUrl ? (
                            <img src={candidate.photoUrl} alt={candidate.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold shrink-0">
                                {candidate.name.charAt(0)}
                            </div>
                        )}
                        <div className="text-center sm:text-left flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{candidate.name}</h4>
                            <p className="text-xs text-brand-600 dark:text-brand-400 font-medium truncate">{candidate.domain}</p>
                            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 mt-1 truncate">
                                <GraduationCap className="w-3.5 h-3.5 shrink-0" /> {candidate.college}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 inline-block px-2 py-1 rounded-md">
                                    {candidate.completedProjects} Projects Completed
                                </div>
                                {candidate.applicationStatus === 'accepted' && (
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-2 py-1 rounded-md text-[10px] uppercase tracking-wider">
                                        Accepted
                                    </span>
                                )}
                                {candidate.applicationStatus === 'rejected' && (
                                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold px-2 py-1 rounded-md text-[10px] uppercase tracking-wider">
                                        Rejected
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => {
                onClose();
                setIsConfirmingArchive(false);
                setReviewingCandidate(null);
            }}
        >
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl relative overflow-hidden mt-10 mb-10 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Banner */}
                <div className="bg-slate-50 dark:bg-slate-800/80 px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            {project.status === 'completed' ? (
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                    Completed
                                </span>
                            ) : (
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
                                    Active Status
                                </span>
                            )}
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Posted {new Date(project.postedAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mb-2">
                            {project.role}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-brand-500" /> {project.domain}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-purple-500" /> {project.tenure} Months</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 z-10">
                        <button
                            onClick={() => {
                                onClose();
                                setIsConfirmingArchive(false);
                                setReviewingCandidate(null);
                            }}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white/80 dark:bg-slate-900/80 shadow-sm border border-slate-200 dark:border-slate-700 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {project.status !== 'completed' && onArchive && (
                            <div className="relative">
                                {!isConfirmingArchive ? (
                                    <button
                                        onClick={() => setIsConfirmingArchive(true)}
                                        className="text-xs font-medium px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                                    >
                                        Archive Project
                                    </button>
                                ) : (
                                    <div className="flex flex-col items-end gap-2 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 p-3 rounded-xl shadow-lg absolute right-0 top-0 w-64 z-10 animate-in fade-in zoom-in-95 duration-200">
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                                            Are you sure? Once archived, this project will no longer be visible to students for applying.
                                        </p>
                                        <div className="flex gap-2 w-full mt-1">
                                            <button
                                                onClick={() => setIsConfirmingArchive(false)}
                                                className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onArchive(project.id);
                                                    setIsConfirmingArchive(false);
                                                }}
                                                className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                            >
                                                Confirm Archive
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-8 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <nav className="-mb-px flex space-x-6 md:space-x-8 overflow-x-auto hide-scrollbar">
                        <button
                            onClick={() => { setActiveTab('details'); resetViews(); }}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'details'
                                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                }`}
                        >
                            Project Details
                        </button>
                        <button
                            onClick={() => { setActiveTab('applicants'); resetViews(); }}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'applicants'
                                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                }`}
                        >
                            Applicants
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-0.5 px-2 rounded-full text-xs">
                                {project.appliedCandidates?.length || 0}
                            </span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('working'); resetViews(); }}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'working'
                                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                }`}
                        >
                            Currently Working
                            <span className="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 py-0.5 px-2 rounded-full text-xs">
                                {project.workingCandidates?.length || 0}
                            </span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('archived'); resetViews(); }}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'archived'
                                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                }`}
                        >
                            Archived Candidates
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-0.5 px-2 rounded-full text-xs">
                                {project.archivedCandidates?.length || 0}
                            </span>
                        </button>
                    </nav>
                </div>

                {/* Scrollable Content Area */}
                <div className="px-8 py-6 flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#0a0f1d]/50">
                    {reviewingCandidate ? (
                        <div className="animate-in slide-in-from-right-8 duration-300">
                            <button
                                onClick={() => setReviewingCandidate(null)}
                                className="mb-4 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
                            >
                                ← Back to list
                            </button>
                            <ApplicantReviewView
                                candidate={reviewingCandidate}
                                onClose={() => setReviewingCandidate(null)}
                                onAccept={(id) => {
                                    if (onAcceptCandidate) onAcceptCandidate(project.id, id);
                                    setReviewingCandidate(null);
                                }}
                                onDecline={(id) => {
                                    if (onDeclineCandidate) onDeclineCandidate(project.id, id);
                                    setReviewingCandidate(null);
                                }}
                                isArchived={activeTab === 'archived'}
                                onRevert={(id) => {
                                    if (onRevertCandidate) onRevertCandidate(project.id, id);
                                    setReviewingCandidate(null);
                                }}
                            />
                        </div>
                    ) : reviewingWorkingCandidate ? (
                        <div className="animate-in slide-in-from-right-8 duration-300">
                            <button
                                onClick={() => setReviewingWorkingCandidate(null)}
                                className="mb-4 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
                            >
                                ← Back to Currently Working
                            </button>
                            <WorkingCandidateView
                                candidate={reviewingWorkingCandidate}
                                onClose={() => setReviewingWorkingCandidate(null)}
                                onMessage={(id) => {
                                    if (onMessageWorkingCandidate) onMessageWorkingCandidate(project.id, id);
                                }}
                                onSendLetter={(id, type, content) => {
                                    if (onSendLetter) onSendLetter(project.id, id, type, content);
                                }}
                                onCompleteProject={(id) => {
                                    if (onCompleteProject) onCompleteProject(project.id, id);
                                }}
                            />
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300 h-full">
                            {activeTab === 'details' && (
                                <div className="space-y-8">
                                    {/* Key Info Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
                                            <div className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Domain</div>
                                            <div className="font-bold text-sm text-slate-900 dark:text-white truncate" title={project.domain}>{project.domain}</div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
                                            <div className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration</div>
                                            <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{project.tenure} Months</div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
                                            <div className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">Stipend</div>
                                            <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                                {project.remuneration === '0' || project.remuneration === 0 ? 'Unpaid' : `₹${project.remuneration}`}
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
                                            <div className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Openings</div>
                                            <div className="font-bold text-sm text-brand-600 dark:text-brand-400 truncate">{project.positions || 1}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-brand-500" /> Objective
                                        </h3>
                                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
                                            {project.objective}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Candidate Expectations</h3>
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
                                            {project.expectations}
                                        </div>
                                    </div>

                                    {project.attachmentName && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Attachments</h3>
                                            <div className="flex items-center justify-between p-5 bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-900/40 rounded-xl max-w-md">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-brand-500">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{project.attachmentName}</p>
                                                        <p className="text-xs text-slate-500 font-medium">Job Description Document</p>
                                                    </div>
                                                </div>
                                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors shadow-sm btn-interactive">
                                                    <Download className="w-4 h-4" /> Download
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'applicants' && (
                                renderCandidateList(project.appliedCandidates, "No pending applicants at the moment.")
                            )}

                            {activeTab === 'working' && (
                                renderCandidateList(project.workingCandidates, "No candidates are currently working on this project.", true)
                            )}

                            {activeTab === 'archived' && (
                                renderCandidateList(project.archivedCandidates, "No archived candidates.")
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDashboard;
