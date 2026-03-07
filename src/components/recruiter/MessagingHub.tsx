import { useState } from 'react';
import { Send, CheckCircle, XCircle, Search, Clock, MessageSquare, Briefcase, ChevronLeft } from 'lucide-react';
import { MOCK_PROFILES } from '../../constants';

interface MessagingHubProps {
    projects: any[]; // The active projects to match IDs
    threads: any[];
    setThreads: React.Dispatch<React.SetStateAction<any[]>>;
    onUpdateCandidateStatus: (projectId: string, candidateId: string, newStatus: 'selected' | 'rejected') => void;
}

const MessagingHub = ({ projects, threads, setThreads, onUpdateCandidateStatus }: MessagingHubProps) => {
    // Basic local state to handle message sending and status changes in memory
    const [activeThreadId, setActiveThreadId] = useState<string | null>(threads[0]?.id || null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'selected' | 'rejected'>('all');
    const [projectFilter, setProjectFilter] = useState<string>('all');

    // For mobile view toggling between list and chat
    const [showMobileChat, setShowMobileChat] = useState(false);

    const filteredThreads = threads.filter(thread => {
        const threadCandidate = MOCK_PROFILES.find(p => p.id === thread.candidateId);
        if (!threadCandidate) return false;

        const matchesSearch = threadCandidate.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || thread.status === statusFilter;
        const matchesProject = projectFilter === 'all' || thread.projectId === projectFilter;

        return matchesSearch && matchesStatus && matchesProject;
    });

    const activeThread = threads.find(t => t.id === activeThreadId);

    // Get candidate and project details for the active thread
    const candidate = activeThread ? MOCK_PROFILES.find(p => p.id === activeThread.candidateId) : null;
    const project = activeThread ? projects.find(p => p.id === activeThread.projectId) : null;

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeThreadId) return;

        setThreads(prev => prev.map(thread => {
            if (thread.id === activeThreadId) {
                return {
                    ...thread,
                    messages: [
                        ...thread.messages,
                        {
                            id: Date.now().toString(),
                            senderId: 'recruiter',
                            text: newMessage,
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
            }
            return thread;
        }));
        setNewMessage('');
    };

    const handleUpdateCandidateStatus = (newStatus: 'selected' | 'rejected') => {
        if (!activeThreadId || !activeThread) return;

        // Notify the dashboard to move candidate from applicants to working/archived
        onUpdateCandidateStatus(activeThread.projectId, activeThread.candidateId, newStatus);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (threads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm mt-4">
                <MessageSquare className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Conversations</h3>
                <p>Accept an applicant from a project dashboard to start a conversation.</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] min-h-[600px] border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden mt-4 relative">

            {/* Left Pane: Thread List */}
            <div className={`w-full md:w-1/3 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-shadow"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50 flex-1 min-w-0"
                        >
                            <option value="all">All Statuses</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50 flex-1 min-w-0"
                        >
                            <option value="all">All Projects</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.role}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredThreads.map(thread => {
                        const threadCandidate = MOCK_PROFILES.find(p => p.id === thread.candidateId);
                        const lastMessage = thread.messages[thread.messages.length - 1];
                        const isActive = thread.id === activeThreadId;

                        if (!threadCandidate) return null;

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
                                <div className="relative shrink-0">
                                    {threadCandidate.photoUrl ? (
                                        <img src={threadCandidate.photoUrl} alt={threadCandidate.name} className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                            {threadCandidate.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{threadCandidate.name}</h4>
                                            {thread.status === 'selected' && (
                                                <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shrink-0">Selected</span>
                                            )}
                                            {thread.status === 'rejected' && (
                                                <span className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shrink-0">Rejected</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-500 whitespace-nowrap pl-1 shrink-0">
                                            {lastMessage ? formatDate(lastMessage.timestamp) : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-brand-600 dark:text-brand-400 mb-1 truncate">{threadCandidate.domain}</p>
                                    <p className={`text-sm truncate ${isActive ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {lastMessage?.text || 'No messages yet'}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right Pane: Active Chat */}
            {candidate && activeThread ? (
                <div className={`flex-1 flex flex-col absolute inset-0 md:relative z-10 bg-white dark:bg-slate-900 md:bg-transparent ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                    {/* Chat Header */}
                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                            <button
                                onClick={() => setShowMobileChat(false)}
                                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            {candidate.photoUrl ? (
                                <img src={candidate.photoUrl} alt={candidate.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0" />
                            ) : (
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                    {candidate.name.charAt(0)}
                                </div>
                            )}
                            <div className="min-w-0 flex-1 flex flex-col justify-center">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate">{candidate.name}</h3>
                                {project && (
                                    <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1 mt-0.5 w-full">
                                        <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                                        <span className="shrink-0 hidden sm:inline">Applying for:</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{project.role}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Status / Actions */}
                        <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
                            {activeThread.status === 'selected' && (
                                <span className="flex items-center gap-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-lg text-sm font-bold">
                                    <CheckCircle className="w-4 h-4" /> Selected
                                </span>
                            )}
                            {activeThread.status === 'rejected' && (
                                <span className="flex items-center gap-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-lg text-sm font-bold">
                                    <XCircle className="w-4 h-4" /> Rejected
                                </span>
                            )}
                            {activeThread.status === 'active' && (
                                <>
                                    <button
                                        onClick={() => handleUpdateCandidateStatus('rejected')}
                                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Reject Candidate"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateCandidateStatus('selected')}
                                        className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                        title="Select Candidate"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Messages Area - this div is where the issue was, but here I adjust content */}
                    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50/50 dark:bg-[#0a0f1d]/50 space-y-6 flex flex-col">
                        {activeThread.messages.map((msg: any) => {
                            const isRecruiter = msg.senderId === 'recruiter';
                            return (
                                <div key={msg.id} className={`flex flex-col ${isRecruiter ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-3 md:p-4 shadow-sm ${isRecruiter
                                        ? 'bg-brand-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                                        }`}>
                                        <p className="text-[14px] md:text-[15px] leading-relaxed break-words">{msg.text}</p>
                                    </div>
                                    <span className="text-[10px] md:text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {formatDate(msg.timestamp)} • {isRecruiter ? 'You' : candidate.name.split(' ')[0]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                        {activeThread.status === 'active' ? (
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-white transition-shadow"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 text-white p-3 rounded-xl transition-colors shadow-sm flex items-center justify-center"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-medium border border-slate-200 dark:border-slate-800">
                                This conversation is closed because the candidate was {activeThread.status}.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-slate-50/50 dark:bg-[#0a0f1d]/50 hidden md:flex">
                    <div className="text-center text-slate-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Select a conversation to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagingHub;
