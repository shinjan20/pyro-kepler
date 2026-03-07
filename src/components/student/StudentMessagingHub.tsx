import { useState, useRef } from 'react';
import { Send, Clock, MessageSquare, Briefcase, ChevronLeft, AlertCircle, Paperclip, FileText, X } from 'lucide-react';
import { checkTextForProfanityAsync } from '../../utils/profanityFilter';

interface StudentMessagingHubProps {
    threads: any[];
    setThreads: React.Dispatch<React.SetStateAction<any[]>>;
}

const StudentMessagingHub = ({ threads, setThreads }: StudentMessagingHubProps) => {
    const [activeThreadId, setActiveThreadId] = useState<string | null>(threads[0]?.id || null);
    const [newMessage, setNewMessage] = useState('');
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSending, setIsSending] = useState(false);
    const activeThread = threads.find(t => t.id === activeThreadId);

    const [errorMessage, setErrorMessage] = useState('');

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if ((!newMessage.trim() && !attachedFile) || !activeThreadId) return;

        setIsSending(true);
        const hasProfanity = await checkTextForProfanityAsync(newMessage);

        if (hasProfanity) {
            setErrorMessage('Please use professional language. Unprofessional or inappropriate terms are strictly prohibited.');
            setIsSending(false);
            return;
        }

        setThreads(prev => prev.map(thread => {
            if (thread.id === activeThreadId) {
                return {
                    ...thread,
                    messages: [
                        ...thread.messages,
                        {
                            id: Date.now().toString(),
                            senderId: 'student',
                            text: newMessage,
                            timestamp: new Date().toISOString(),
                            attachedFileName: attachedFile?.name || null
                        }
                    ]
                };
            }
            return thread;
        }));
        setNewMessage('');
        setAttachedFile(null);
        setIsSending(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachedFile(e.target.files[0]);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (threads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm mt-4">
                <MessageSquare className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Messages Yet</h3>
                <p>When a recruiter contacts you about an application, it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-16rem)] min-h-[500px] border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden mt-4 relative">

            {/* Left Pane: Thread List */}
            <div className={`w-full md:w-1/3 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <h2 className="font-bold font-heading text-lg text-slate-900 dark:text-white">Conversations</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {threads.map(thread => {
                        const lastMessage = thread.messages[thread.messages.length - 1];
                        const isActive = thread.id === activeThreadId;

                        return (
                            <button
                                key={thread.id}
                                onClick={() => {
                                    setActiveThreadId(thread.id);
                                    setShowMobileChat(true);
                                }}
                                className={`w-full text-left p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex gap-3 ${isActive ? 'bg-brand-50 dark:bg-brand-900/10 border-l-4 border-l-brand-500' : 'border-l-4 border-l-transparent'
                                    }`}
                            >
                                <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300">
                                    {thread.companyName?.charAt(0) || 'R'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{thread.companyName || 'Recruiter'}</h4>
                                        <span className="text-[10px] text-slate-500 whitespace-nowrap pl-1 shrink-0">
                                            {lastMessage ? formatDate(lastMessage.timestamp) : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1 truncate">{thread.projectName || 'Project'}</p>
                                    <p className={`text-sm truncate ${isActive ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {lastMessage?.senderId === 'student' ? 'You: ' : ''}{lastMessage?.text || 'No messages yet'}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right Pane: Active Chat */}
            {activeThread ? (
                <div className={`flex-1 flex flex-col absolute inset-0 md:relative z-10 bg-white dark:bg-slate-900 md:bg-transparent ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                    {/* Chat Header */}
                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                            <button
                                onClick={() => setShowMobileChat(false)}
                                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                {activeThread.companyName?.charAt(0) || 'R'}
                            </div>
                            <div className="min-w-0 flex-1 flex flex-col justify-center">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate">{activeThread.companyName || 'Recruiter'}</h3>
                                <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1 mt-0.5 w-full">
                                    <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                                    <span className="shrink-0 hidden sm:inline">Project:</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{activeThread.projectName || 'Active Application'}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-[#0a0f1d]/50 space-y-6">
                        {activeThread.messages.map((msg: any) => {
                            const isStudent = msg.senderId === 'student';
                            return (
                                <div key={msg.id} className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${isStudent
                                        ? 'bg-brand-600 text-white rounded-tr-none'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-tl-none outline outline-1 outline-slate-300 dark:outline-slate-600'
                                        }`}>
                                        {msg.attachedFileName && (
                                            <div className={`flex items-center gap-2 p-2 rounded-lg mb-2 text-sm max-w-full ${isStudent ? 'bg-white/20' : 'bg-white dark:bg-slate-800'}`}>
                                                <FileText className="w-4 h-4 shrink-0" />
                                                <span className="truncate font-medium">{msg.attachedFileName}</span>
                                            </div>
                                        )}
                                        {msg.text && <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>}
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {formatDate(msg.timestamp)} • {isStudent ? 'You' : 'Recruiter'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                        {errorMessage && (
                            <div className="mb-3 bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-xl flex items-start gap-2 text-sm animate-in fade-in slide-in-from-bottom-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p>{errorMessage}</p>
                            </div>
                        )}
                        {activeThread.messages.some((msg: any) => msg.senderId === 'recruiter') ? (
                            <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                                {attachedFile && (
                                    <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm max-w-sm self-start mb-1 animation-in fade-in">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        <span className="truncate flex-1 text-slate-700 dark:text-slate-200 font-medium">
                                            {attachedFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setAttachedFile(null)}
                                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-3 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                        title="Attach file"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>

                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={attachedFile ? "Add a message (optional)..." : "Type your reply..."}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-white transition-shadow"
                                    />

                                    <button
                                        type="submit"
                                        disabled={(!newMessage.trim() && !attachedFile) || isSending}
                                        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 text-white p-3 rounded-xl transition-colors shadow-sm flex items-center justify-center"
                                    >
                                        {isSending ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-4 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-medium border border-slate-200 dark:border-slate-800">
                                Waiting for the recruiter to send the first message before you can reply.
                            </div>
                        )}
                    </div>
                </div >
            ) : (
                <div className="flex-1 flex items-center justify-center bg-slate-50/50 dark:bg-[#0a0f1d]/50 hidden md:flex">
                    <div className="text-center text-slate-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Select a conversation to view messages</p>
                    </div>
                </div>
            )}
        </div >
    );
};

export default StudentMessagingHub;
