import { useState } from 'react';
import { MapPin, Star, Mail, X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { useProfanityFilter } from '../../hooks/useProfanityFilter';

interface CollaboratedTalent {
    id: string | number;
    name: string;
    photoUrl: string;
    domain: string;
    projectName: string;
    review: string;
    rating: number;
}

interface CollaboratedTalentCardProps {
    collab: CollaboratedTalent;
}

const CollaboratedTalentCard = ({ collab }: CollaboratedTalentCardProps) => {
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

    return (
        <div className="glass-card p-4 sm:p-6 flex flex-col hover:border-brand-500/50 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4 mb-4">
                <img src={collab.photoUrl} alt={collab.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" />
                <div>
                    <h3 className="font-bold font-heading text-lg text-slate-900 dark:text-white">{collab.name}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {collab.domain}</p>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 flex-grow">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Project</h4>
                <p className="font-medium text-slate-800 dark:text-slate-200 mb-3">{collab.projectName}</p>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Feedback</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{collab.review}"</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mb-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Your Rating</span>
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    {collab.rating.toFixed(1)}
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
                                {error && (
                                    <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200">
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
                                        disabled={!messageText.trim() || !!error}
                                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 text-white font-medium rounded-lg text-sm transition-colors flex items-center gap-2"
                                    >
                                        <Send className="w-3.5 h-3.5" /> Send
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
