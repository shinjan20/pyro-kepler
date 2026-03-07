import { useState } from 'react';
import { Clock, MessageSquare, Briefcase, ChevronLeft, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface StudentMessagingHubProps {
    threads: any[];
    setThreads: React.Dispatch<React.SetStateAction<any[]>>;
}

const StudentMessagingHub = ({ threads }: StudentMessagingHubProps) => {

    const [activeThreadId, setActiveThreadId] = useState<string | null>(threads[0]?.id || null);
    const [showMobileChat, setShowMobileChat] = useState(false);

    const activeThread = threads.find(t => t.id === activeThreadId);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const generatePDF = (
        recruiterName: string,
        companyName: string,
        _projectName: string,
        messageText: string,
        letterType: 'completion' | 'joining'
    ) => {

        const doc = new jsPDF();

        const dateStr = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        doc.setFontSize(24);
        doc.setTextColor(59, 130, 246);
        doc.text('projectMatch', 20, 30);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Official Project ${letterType === 'completion' ? 'Completion' : 'Joining'} Letter`, 20, 38);

        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`Date: ${dateStr}`, 20, 60);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Letter of ${letterType === 'completion' ? 'Completion' : 'Joining'}`, 105, 80, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);

        const wrappedBody = doc.splitTextToSize(messageText, 170);

        let yPos = 100;
        doc.text(wrappedBody, 20, yPos);

        yPos += wrappedBody.length * 7 + 10;

        doc.setFont('helvetica', 'normal');
        doc.text('Best Regards,', 20, yPos);

        yPos += 10;

        // Recruiter Name (BOLD)
        doc.setFont('helvetica', 'bold');
        doc.text(recruiterName, 20, yPos);

        yPos += 8;

        doc.setFont('helvetica', 'normal');
        doc.text(companyName, 20, yPos);

        const safeType = letterType === 'completion' ? 'completion' : 'joining';
        doc.save(`${safeType}_letter.pdf`);
    };

    if (threads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500 border rounded-3xl bg-white shadow-sm mt-4">
                <MessageSquare className="w-16 h-16 mb-4 text-slate-300" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Messages Yet</h3>
                <p>When a recruiter contacts you about an application, it will appear here.</p>
            </div>
        );
    }

    return (

        <div className="flex h-[calc(100vh-16rem)] min-h-[500px] border rounded-3xl bg-white shadow-xl overflow-hidden mt-4 relative">

            {/* LEFT THREAD PANEL */}

            <div className={`w-full md:w-1/3 flex flex-col border-r bg-slate-50 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>

                <div className="p-4 border-b bg-white">
                    <h2 className="font-bold text-lg text-slate-900">Conversations</h2>
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
                                className={`w-full text-left p-4 border-b hover:bg-slate-100 flex gap-3 ${isActive ? 'bg-brand-50 border-l-4 border-l-brand-500' : ''}`}
                            >

                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold">
                                    {thread.companyName?.charAt(0) || 'R'}
                                </div>

                                <div className="flex-1 min-w-0">

                                    <div className="flex justify-between">

                                        <h4 className="font-bold truncate">
                                            {thread.companyName || 'Recruiter'}
                                        </h4>

                                        <span className="text-xs text-slate-500">
                                            {lastMessage ? formatDate(lastMessage.timestamp) : ''}
                                        </span>

                                    </div>

                                    <p className="text-xs text-brand-600 truncate">
                                        {thread.projectName || 'Project'}
                                    </p>

                                    <p className={`text-sm truncate ${isActive ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                        {lastMessage?.senderId === 'student' ? 'You: ' : ''}
                                        {lastMessage?.text || 'No messages yet'}
                                    </p>

                                </div>

                            </button>

                        );

                    })}

                </div>

            </div>

            {/* CHAT PANEL */}

            {activeThread && (

                <div className={`flex-1 flex flex-col ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>

                    <div className="p-4 border-b flex items-center gap-3">

                        <button onClick={() => setShowMobileChat(false)} className="md:hidden">
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold">
                            {activeThread.companyName?.charAt(0) || 'R'}
                        </div>

                        <div>
                            <h3 className="font-bold">{activeThread.companyName || 'Recruiter'}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {activeThread.projectName}
                            </p>
                        </div>

                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-6">

                        {activeThread.messages.map((msg: any) => {

                            const isStudent = msg.senderId === 'student';

                            return (

                                <div key={msg.id} className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}>

                                    <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${isStudent ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}>

                                        {msg.attachedFileName && (

                                            <div className="flex items-center gap-2 mb-2">

                                                <FileText className="w-5 h-5" />
                                                <span>{msg.attachedFileName}</span>

                                                {msg.attachedFileName.toLowerCase().includes('letter') && (

                                                    <button
                                                        onClick={() => {

                                                            const letterType =
                                                                msg.attachedFileName.toLowerCase().includes('joining')
                                                                    ? 'joining'
                                                                    : 'completion';

                                                            generatePDF(
                                                                activeThread.recruiterName || 'Recruiter',
                                                                activeThread.companyName || 'Company',
                                                                activeThread.projectName,
                                                                msg.text,
                                                                letterType
                                                            );

                                                        }}
                                                    >

                                                        <Download className="w-4 h-4" />

                                                    </button>

                                                )}

                                            </div>

                                        )}

                                        <p>{msg.text}</p>

                                    </div>

                                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(msg.timestamp)} • {isStudent ? 'You' : 'Recruiter'}
                                    </span>

                                </div>

                            );

                        })}

                    </div>

                </div>

            )}

        </div>

    );

};

export default StudentMessagingHub;