import { AlertTriangle, X } from 'lucide-react';

interface ProfanityWarningModalProps {
    error: string | null;
    onClose: () => void;
}

export default function ProfanityWarningModal({ error, onClose }: ProfanityWarningModalProps) {
    if (!error) return null;

    // Check if the error is related to profanity by looking for keywords
    const isProfanity = error.toLowerCase().includes('inappropriate') || error.toLowerCase().includes('professional');

    if (!isProfanity) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:hidden">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Modal Box */}
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 border border-red-100 dark:border-red-900/30">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                    Action Required
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                    {error}
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95 btn-interactive"
                >
                    Close Warning
                </button>
            </div>
        </div>
    );
}
