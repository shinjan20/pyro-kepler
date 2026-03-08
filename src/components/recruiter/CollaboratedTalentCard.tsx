import { useState } from 'react';
import { MapPin, Star, Mail, X, AlertTriangle, Send, CheckCircle2, MessageSquarePlus, StarHalf } from 'lucide-react';
import { checkTextForProfanityAsync } from '../../utils/profanityFilter';
import ProfanityWarningModal from '../ProfanityWarningModal';

interface CollaboratedTalent {
    id: string | number;
    candidateId: string;
    projectId: string;
    name: string;
    photoUrl: string;
    domain: string;
    projectName: string;
    review: string;
    rating: number;
}

interface CollaboratedTalentCardProps {
    collab: CollaboratedTalent;
    onMessageInitiated?: (projectId: string, candidateId: string, message: string) => void;
}

const CollaboratedTalentCard = ({ collab, onMessageInitiated }: CollaboratedTalentCardProps) => {
    const [isMessaging, setIsMessaging] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messageSent, setMessageSent] = useState(false);
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Feedback State
    const [isAddingFeedback, setIsAddingFeedback] = useState(collab.rating === 0 || !collab.review);
    const [rating, setRating] = useState(collab.rating);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState(collab.review || '');
    const [feedbackSaved, setFeedbackSaved] = useState(false);

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError('');
        setMessageText(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || error) return;

        setIsSending(true);
        const hasProfanity = await checkTextForProfanityAsync(messageText);

        if (hasProfanity) {
            setError('Please use professional language. Unprofessional or inappropriate terms are strictly prohibited.');
            setIsSending(false);
            return;
        }

        // Simulate sending a message
        if (onMessageInitiated) {
            onMessageInitiated(collab.projectId, String(collab.candidateId), messageText);
        }

        setMessageSent(true);
        setIsSending(false);
        setTimeout(() => {
            setIsMessaging(false);
            setMessageSent(false);
            setMessageText('');
        }, 2500);
    };

    const getStarColorClass = (val: number) => {
        if (val <= 2) return 'text-red-500 hover:text-red-400 group-hover:text-red-400';
        if (val <= 3) return 'text-yellow-500 hover:text-yellow-400 group-hover:text-yellow-400';
        return 'text-green-500 hover:text-green-400 group-hover:text-green-400';
    };

    const getRatingContainerColorClass = (val: number) => {
        if (val === 0) return 'text-slate-400 bg-slate-100 dark:bg-slate-800';
        if (val <= 2) return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
        if (val <= 3) return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
        return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
    };

    const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError('');
        setFeedbackText(e.target.value);
    };

    const handleSaveFeedback = async () => {
        if (rating === 0) return;

        setIsSending(true);
        const hasProfanity = await checkTextForProfanityAsync(feedbackText);
        setIsSending(false);

        if (hasProfanity) {
            setError('Please use professional language in your feedback. Unprofessional or inappropriate terms are strictly prohibited.');
            return;
        }

        setError('');

        // In a real app, this would save to the backend. Here we just update the UI state.
        setFeedbackSaved(true);
        setTimeout(() => {
            setIsAddingFeedback(false);
            collab.rating = rating;
            collab.review = feedbackText;
            setFeedbackSaved(false);
        }, 1500);
    };

    return (
        <div className="glass-card p-4 sm:p-6 flex flex-col hover:border-brand-500/50 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4 mb-4">
                <img src={collab.photoUrl} alt={collab.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" />
                <div>
                    <h3 className="font-bold font-heading text-lg text-slate-900 dark:text-white">{collab.name}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {collab.domain}</p>
                </div>
            </div>

            <div className={`bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 flex-grow transition-all ${isAddingFeedback ? 'ring-2 ring-brand-500/30' : ''}`}>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Project</h4>
                <p className="font-medium text-slate-800 dark:text-slate-200 mb-3">{collab.projectName}</p>

                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feedback</h4>
                    {!isAddingFeedback && collab.rating > 0 && (
                        <button
                            onClick={() => setIsAddingFeedback(true)}
                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium flex items-center gap-1"
                        >
                            <MessageSquarePlus className="w-3 h-3" /> Edit
                        </button>
                    )}
                </div>

                {isAddingFeedback ? (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        {feedbackSaved ? (
                            <div className="flex flex-col items-center justify-center py-4 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-8 h-8 mb-2" />
                                <p className="font-bold text-sm">Feedback Saved!</p>
                            </div>
                        ) : (
                            <>
                                <ProfanityWarningModal error={error} onClose={() => setError('')} />
                                {error && (
                                    <div className={`mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200 ${(error.toLowerCase().includes('inappropriate') || error.toLowerCase().includes('professional')) ? 'hidden md:flex' : 'flex'}`}>
                                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs font-medium text-red-700 dark:text-red-400">
                                            {error}
                                        </p>
                                    </div>
                                )}
                                <textarea
                                    value={feedbackText}
                                    onChange={handleFeedbackChange}
                                    placeholder="Share your experience working with this candidate..."
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none h-20 mb-3 input-interactive"
                                ></textarea>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const currentRating = hoverRating || rating;
                                            const isActive = star <= Math.ceil(currentRating);
                                            const isHalf = isActive && star > currentRating;
                                            const colorClass = isActive ? getStarColorClass(currentRating) : 'text-slate-300 dark:text-slate-600 hover:text-slate-400';

                                            const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
                                                const bounds = e.currentTarget.getBoundingClientRect();
                                                const x = e.clientX - bounds.left;
                                                const isLeftHalf = x < bounds.width / 2;
                                                setHoverRating(isLeftHalf ? star - 0.5 : star);
                                            };

                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    disabled={feedbackSaved}
                                                    className={`p-0.5 focus:outline-none transition-colors group relative ${colorClass}`}
                                                    onMouseMove={handleMouseMove}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(hoverRating || star)}
                                                >
                                                    {isHalf ? (
                                                        <StarHalf className="w-5 h-5 fill-current" />
                                                    ) : (
                                                        <Star className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                                                    )}
                                                </button>
                                            );
                                        })}
                                        {rating > 0 && <span className="text-xs font-bold ml-1 text-slate-500 w-4">{rating}</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        {collab.rating > 0 && (
                                            <button
                                                onClick={() => {
                                                    setIsAddingFeedback(false);
                                                    setRating(collab.rating);
                                                    setFeedbackText(collab.review);
                                                }}
                                                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            onClick={handleSaveFeedback}
                                            disabled={rating === 0}
                                            className="px-4 py-1.5 text-xs bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 text-white font-bold rounded-lg shadow-sm transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                        {collab.review ? `"${collab.review}"` : "No feedback provided yet."}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mb-4 h-10">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Your Rating</span>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all ${getRatingContainerColorClass(collab.rating)}`}>
                    {collab.rating > 0 && (collab.rating % 1 !== 0 ? <StarHalf className="w-4 h-4 fill-current" /> : <Star className="w-4 h-4 fill-current" />)}
                    {collab.rating === 0 && <Star className="w-4 h-4" />}
                    {collab.rating > 0 ? collab.rating.toFixed(1) : 'Unrated'}
                </div>
            </div>

            {/* Messaging Section */}
            <div className="pt-2">
                {!isMessaging ? (
                    <button
                        onClick={() => setIsMessaging(true)}
                        className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:-translate-y-0.5 transition-transform shadow-md shadow-slate-900/10 dark:shadow-white/5 flex items-center justify-center gap-2 btn-interactive"
                    >
                        <Mail className="w-4 h-4" /> Message {collab.name.split(' ')[0]}
                    </button>
                ) : (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-inner animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {messageSent ? (
                            <div className="flex flex-col items-center justify-center py-4 text-brand-600 dark:text-brand-400">
                                <CheckCircle2 className="w-8 h-8 mb-2" />
                                <p className="font-bold">Message Sent!</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-3 text-slate-800 dark:text-slate-200">
                                    <h4 className="text-sm font-bold flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Direct Message</h4>
                                    <button onClick={() => { setIsMessaging(false); setError(''); setMessageText(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <ProfanityWarningModal error={error} onClose={() => setError('')} />
                                {error && (
                                    <div className={`mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200 ${(error.toLowerCase().includes('inappropriate') || error.toLowerCase().includes('professional')) ? 'hidden md:flex' : 'flex'}`}>
                                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs font-medium text-red-700 dark:text-red-400">
                                            {error}
                                        </p>
                                    </div>
                                )}
                                <textarea
                                    value={messageText}
                                    onChange={handleMessageChange}
                                    placeholder="Type your message..."
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none h-24 mb-3 input-interactive"
                                    autoFocus
                                ></textarea>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!messageText.trim() || !!error || isSending}
                                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isSending ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <><Send className="w-3.5 h-3.5" /> Send</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollaboratedTalentCard;
