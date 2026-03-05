import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'danger'
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    const colors = {
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
        info: 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-500'
    };

    const iconColors = {
        danger: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
        warning: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
        info: 'text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/30'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-full mb-4 ${iconColors[type]}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-1 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                        {title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 btn-interactive"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-5 py-2.5 rounded-xl font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 btn-interactive ${colors[type]}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
