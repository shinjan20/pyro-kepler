import { X, Briefcase, MapPin, Clock, Users, FileText, Download, GraduationCap, User } from 'lucide-react';
import { useState } from 'react';

interface ProjectDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
    onArchive?: (projectId: string) => void;
}

const ProjectDetailsModal = ({ isOpen, onClose, project, onArchive }: ProjectDetailsModalProps) => {
    const [activeTab, setActiveTab] = useState<'details' | 'applications'>('details');
    const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);

    if (!isOpen || !project) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => {
                onClose();
                setIsConfirmingArchive(false);
            }}
        >
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl relative overflow-hidden mt-10 mb-10 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
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
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'details'
                                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                }`}
                        >
                            Project Details
                        </button>
                        <button
                            onClick={() => setActiveTab('applications')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'applications'
                                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                }`}
                        >
                            {project.status === 'completed'
                                ? `Candidates Worked (${project.candidates?.length || 0})`
                                : `Currently Working (${project.candidates?.length || 0})`}
                        </button>
                    </nav>
                </div>

                {/* Scrollable Content Area */}
                <div className="px-8 py-6 overflow-y-auto grow">
                    {activeTab === 'details' ? (
                        <div className="space-y-8">
                            {/* Key Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                    <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Domain</div>
                                    <div className="font-bold text-slate-900 dark:text-white">{project.domain}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                    <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration</div>
                                    <div className="font-bold text-slate-900 dark:text-white">{project.tenure} Months</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                    <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">Stipend</div>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                        {project.remuneration === '0' || project.remuneration === 0 ? 'Unpaid' : project.remuneration}
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                    <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Openings</div>
                                    <div className="font-bold text-brand-600 dark:text-brand-400">{project.positions || 1}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-brand-500" /> Objective
                                </h3>
                                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                                    {project.objective}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Candidate Expectations</h3>
                                <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/60 p-5 rounded-2xl whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {project.expectations}
                                </div>
                            </div>

                            {project.attachmentName && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Attachments</h3>
                                    <div className="flex items-center justify-between p-4 bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-900/40 rounded-xl max-w-md">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-brand-500">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white text-sm">{project.attachmentName}</p>
                                                <p className="text-xs text-slate-500">Job Description Document</p>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm">
                                            <Download className="w-4 h-4" /> Download
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        project.candidates && project.candidates.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                    {project.status === 'completed' ? 'Candidates who completed this project' : 'Candidates currently working on this project'}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {project.candidates.map((candidate: any) => (
                                        <div key={candidate.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                                            {candidate.photoUrl ? (
                                                <img src={candidate.photoUrl} alt={candidate.name} className="w-14 h-14 rounded-full object-cover shadow-sm bg-white dark:bg-slate-900" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                                    <User className="w-6 h-6" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{candidate.name}</h4>
                                                <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> {candidate.domain}</span>
                                                    <span className="flex items-center gap-1.5"><GraduationCap className="w-3 h-3" /> {candidate.college}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                                    {project.status === 'completed' ? 'No Candidates Found' : 'No Candidates Yet'}
                                </h3>
                                <p>
                                    {project.status === 'completed'
                                        ? 'There are no candidates recorded for this completed project.'
                                        : 'No candidates have started working on this active project yet.'}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsModal;
