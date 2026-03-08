import { X, CheckCircle, XCircle, FileText, User, Github, Linkedin, GraduationCap } from 'lucide-react';
import type { StudentProfile } from './StudentProfileCard';

interface ApplicantReviewViewProps {
    candidate: StudentProfile;
    onClose: () => void;
    onAccept: (candidateId: string) => void;
    onDecline: (candidateId: string) => void;
    isArchived?: boolean;
    onRevert?: (candidateId: string) => void;
    isMaxCapacity?: boolean;
}

const ApplicantReviewView = ({ candidate, onClose, onAccept, onDecline, isArchived = false, onRevert, isMaxCapacity = false }: ApplicantReviewViewProps) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg mt-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-brand-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reviewing Applicant</h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Candidate Details */}
                    <div className="w-full md:w-1/3">
                        <div className="flex flex-col items-center text-center">
                            {candidate.photoUrl ? (
                                <img
                                    src={candidate.photoUrl}
                                    alt={candidate.name}
                                    className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-slate-100 dark:border-slate-800 mb-4"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 font-bold text-3xl">
                                    {candidate.name.charAt(0)}
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
                            <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-1">{candidate.domain}</p>
                            <p className="text-sm text-slate-500 flex items-center justify-center gap-1">
                                <GraduationCap className="w-4 h-4" /> {candidate.college}
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Links & Docs</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        <FileText className="w-4 h-4" /> Resume.pdf
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        <Linkedin className="w-4 h-4" /> LinkedIn Profile
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        <Github className="w-4 h-4" /> GitHub Profile
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Application Info / Cover Letter */}
                    <div className="w-full md:w-2/3 md:pl-6 md:border-l md:border-slate-200 md:dark:border-slate-800">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Cover Letter Note</h4>
                        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700/80 prose prose-slate dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 shadow-sm whitespace-pre-line leading-relaxed">
                            {`Hi there,\n\nI am extremely interested in this role. I have previously completed ${candidate.completedProjects} project${candidate.completedProjects === 1 ? '' : 's'} related to ${candidate.domain}. My background at ${candidate.college} has prepared me well for the expectations listed in your project description.\n\nPlease find my resume attached. I am eager to discuss this further with you!\n\nBest regards,\n${candidate.name}`}
                        </div>

                        {/* Decision Actions */}
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-4">
                            {isArchived ? (
                                <button
                                    onClick={() => onRevert && onRevert(candidate.id)}
                                    className="flex-1 py-3 flex items-center justify-center gap-2 text-white bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors shadow-md font-bold btn-interactive"
                                >
                                    Revert to Applicant Pool
                                </button>
                            ) : (candidate as any).applicationStatus === 'accepted' ? (
                                <div className="flex-1 py-3 flex items-center justify-center gap-2 text-green-700 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 rounded-xl font-bold cursor-not-allowed">
                                    <CheckCircle className="w-5 h-5" /> Accepted
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => onDecline(candidate.id)}
                                        className="flex-1 py-3 flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition-colors font-bold btn-interactive"
                                    >
                                        <XCircle className="w-5 h-5" /> Decline
                                    </button>
                                    <button
                                        onClick={() => onAccept(candidate.id)}
                                        disabled={isMaxCapacity}
                                        title={isMaxCapacity ? "Project has reached maximum capacity" : ""}
                                        className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl transition-colors font-bold btn-interactive ${isMaxCapacity
                                                ? "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400"
                                                : "text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20"
                                            }`}
                                    >
                                        <CheckCircle className="w-5 h-5" /> {isMaxCapacity ? 'Capacity Reached' : 'Accept Candidate'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantReviewView;
