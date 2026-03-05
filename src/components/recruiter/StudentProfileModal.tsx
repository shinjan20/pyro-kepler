import { useState } from 'react';
import { X, Lock, Briefcase, GraduationCap, Mail, Github, Linkedin, User, Clock, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useProfanityFilter } from '../../hooks/useProfanityFilter';
import type { StudentProfile } from './StudentProfileCard';

interface StudentProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: StudentProfile | null;
    hasActiveProjects: boolean;
    onPostProjectClick: () => void;
}

const StudentProfileModal = ({ isOpen, onClose, profile, hasActiveProjects, onPostProjectClick }: StudentProfileModalProps) => {
    const [isMessaging, setIsMessaging] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messageSent, setMessageSent] = useState(false);
    const [error, setError] = useState('');
    const { containsProfanity } = useProfanityFilter();

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (containsProfanity(value)) {
            setError('Please use professional language. Unprofessional or inappropriate terms are strictly prohibited.');
        } else {
            setError('');
        }
        setMessageText(value);
    };

    if (!isOpen || !profile) return null;

    const handleSendMessage = () => {
        if (!messageText.trim() || error) return;
        // Simulate sending a message
        setMessageSent(true);
        setTimeout(() => {
            setIsMessaging(false);
            setMessageSent(false);
            setMessageText('');
        }, 2500);
    };

    const handleClose = () => {
        setIsMessaging(false);
        setMessageSent(false);
        setMessageText('');
        setError('');
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
            onClick={handleClose}
        >
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden mt-10 mb-10 border border-slate-200 dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-50 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white/50 dark:bg-slate-900/50 backdrop-blur p-2 rounded-full transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {hasActiveProjects ? (
                    /* UNLOCKED FULL PROFILE */
                    <div>
                        {/* Header Banner */}
                        <div className="h-32 bg-gradient-to-r from-brand-500 to-purple-600 w-full relative">
                            {/* Decorative pattern overlays could go here */}
                        </div>

                        <div className="px-8 pb-8">
                            <div className="relative -mt-16 mb-6 flex justify-between items-end">
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-lg overflow-hidden">
                                    {profile.photoUrl ? (
                                        <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-heading text-slate-300 dark:text-slate-600">
                                            {profile.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-500 transition-colors">
                                        <Github className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-500 transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white mb-2">{profile.name}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-brand-500" /> {profile.domain}</span>
                                    <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-purple-500" /> {profile.college}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 border-b border-slate-200 dark:border-slate-800 pb-2">About</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Passionate {profile.domain.toLowerCase()} student with a strong track record of delivering quality work.
                                        I am looking for challenging live projects to further hone my skills and contribute to real-world products.
                                    </p>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Live Project Experience</h3>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-slate-900 dark:text-white">Total Completed</span>
                                        <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full text-sm font-bold">
                                            {profile.completedProjects} Projects
                                        </span>
                                    </div>
                                </div>

                                {/* Detailed Past Projects */}
                                {profile.pastProjects && profile.pastProjects.length > 0 && (
                                    <div className="space-y-3">
                                        {profile.pastProjects.map((project, idx) => (
                                            <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-lg shadow-sm">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{project.title}</h4>
                                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {project.company}</span>
                                                    <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {project.domain}</span>
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {project.duration}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 space-y-4">
                                {!isMessaging ? (
                                    <button
                                        onClick={() => setIsMessaging(!isMessaging)}
                                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-slate-900/20 dark:shadow-white/10 flex items-center justify-center gap-2"
                                    >
                                        <Mail className="w-5 h-5" /> Message Candidate
                                    </button>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {messageSent ? (
                                            <div className="flex flex-col items-center justify-center py-6 text-brand-600 dark:text-brand-400">
                                                <CheckCircle2 className="w-10 h-10 mb-3" />
                                                <p className="font-bold text-lg">Message Sent!</p>
                                                <p className="text-sm opacity-80 mt-1">They will get back to you soon.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between mb-3 text-slate-800 dark:text-slate-200">
                                                    <h4 className="font-bold flex items-center gap-2"><Mail className="w-4 h-4" /> New Message</h4>
                                                    <button onClick={() => setIsMessaging(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {error && (
                                                    <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-in fade-in zoom-in-95 duration-200">
                                                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                                        <p className="text-xs font-medium text-red-700 dark:text-red-400">
                                                            {error}
                                                        </p>
                                                    </div>
                                                )}
                                                <textarea
                                                    value={messageText}
                                                    onChange={handleMessageChange}
                                                    placeholder="Hi, we'd love to discuss a potential project opportunity with you..."
                                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none h-28 mb-3 input-interactive"
                                                    autoFocus
                                                ></textarea>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={handleSendMessage}
                                                        disabled={!messageText.trim() || !!error}
                                                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 text-white font-medium rounded-lg text-sm transition-colors flex items-center gap-2"
                                                    >
                                                        <Send className="w-4 h-4" /> Send
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* LOCKED STATE */
                    <div className="p-8 pb-10 text-center relative overflow-hidden">
                        {/* Abstract blurred background shapes */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-full blur-3xl -z-10 opacity-70"></div>

                        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                            <Lock className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            {/* Small profile icon hint behind lock */}
                            <User className="absolute w-12 h-12 text-slate-200 dark:text-slate-700 -z-10 opacity-50 blur-[2px]" />
                        </div>

                        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2 relative z-10">
                            Profile Locked
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto relative z-10">
                            You must have at least one live project posted to view detailed candidate profiles and contact students directly.
                        </p>

                        <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-500/20 rounded-2xl p-6 relative z-10">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Unlock full access instantly</h3>
                            <button
                                onClick={() => {
                                    handleClose();
                                    onPostProjectClick();
                                }}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md shadow-brand-500/20 hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                            >
                                <Briefcase className="w-5 h-5" /> Post a Project Now
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfileModal;
