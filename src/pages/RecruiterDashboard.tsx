import { useState, useEffect } from 'react';
import { Briefcase, Users, PlusCircle, MapPin, Clock, FileText, Download, CheckCircle, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import PostProjectModal from '../components/recruiter/PostProjectModal';
import StudentProfileCard, { type StudentProfile } from '../components/recruiter/StudentProfileCard';
import StudentProfileModal from '../components/recruiter/StudentProfileModal';
import ProjectDashboard from '../components/recruiter/ProjectDashboard';
import MessagingHub from '../components/recruiter/MessagingHub';
import ConfirmModal from '../components/ConfirmModal';
import CollaboratedTalentCard from '../components/recruiter/CollaboratedTalentCard';
import { MOCK_PROFILES, INITIAL_ARCHIVED_PROJECTS, MOCK_PROJECTS, MOCK_COLLABORATED_TALENT, MOCK_MESSAGES, DOMAINS } from '../constants';
import CelebrationModal from '../components/CelebrationModal';
import toast from 'react-hot-toast';

const MOCK_COLLEGES = Array.from(new Set(MOCK_PROFILES.map(p => p.college)));

const RecruiterDashboard = () => {
    const [activeTab, setActiveTab] = useState<'projects' | 'talent' | 'collaborated' | 'messages'>('projects');
    const [activeProjects, setActiveProjects] = useState<any[]>(() => {
        const saved = localStorage.getItem('pyroActiveProjects');
        if (saved) return JSON.parse(saved);
        return [];
    });
    const [archivedProjects, setArchivedProjects] = useState<any[]>(() => {
        const saved = localStorage.getItem('pyroArchivedProjects');
        if (saved) return JSON.parse(saved);
        return INITIAL_ARCHIVED_PROJECTS;
    });
    const [threads, setThreads] = useState<any[]>(MOCK_MESSAGES);

    useEffect(() => {
        // If we already loaded projects from localStorage, do not override with mocks
        if (activeProjects.length > 0) return;

        // Map MOCK_PROJECTS to the format expected by the recruiter dashboard
        const mappedMockProjects = MOCK_PROJECTS.map(p => ({
            id: p.id.toString(),
            role: p.title,
            domain: p.category,
            objective: p.type + ' Setup',
            expectations: p.tags.join(', '),
            tenure: p.duration.split(' ')[0], // just the number
            positions: p.totalPositions,
            hiredPositions: p.hiredPositions,
            remuneration: p.remuneration,
            postedAt: p.postedAt,
            candidates: MOCK_PROFILES.slice(0, 2), // Legacy mapping
            appliedCandidates: MOCK_PROFILES.slice(0, 2),
            archivedCandidates: [MOCK_PROFILES[2]],
            workingCandidates: [MOCK_PROFILES[3]]
        }));

        // Apply auto-archive rule: if older than 2 months (60 days) and 0 hired positions, archive it.
        const active: any[] = [];
        const archivedToAppend: any[] = [];
        const now = Date.now();

        mappedMockProjects.forEach(project => {
            const isOlderThan2Months = (now - new Date(project.postedAt).getTime()) > 60 * 24 * 60 * 60 * 1000;
            if (isOlderThan2Months && project.hiredPositions === 0) {
                archivedToAppend.push({ ...project, status: 'archived' });
            } else {
                active.push(project);
            }
        });

        setActiveProjects(active);
        setArchivedProjects(prev => {
            const newArchived = [...archivedToAppend, ...prev];
            localStorage.setItem('pyroArchivedProjects', JSON.stringify(newArchived));
            return newArchived;
        });
        localStorage.setItem('pyroActiveProjects', JSON.stringify(active));
    }, []);

    // Effect to persist active projects when they change
    useEffect(() => {
        if (activeProjects.length > 0) {
            localStorage.setItem('pyroActiveProjects', JSON.stringify(activeProjects));
        }
    }, [activeProjects]);

    // Effect to persist archived projects when they change
    useEffect(() => {
        if (archivedProjects.length > 0) {
            localStorage.setItem('pyroArchivedProjects', JSON.stringify(archivedProjects));
        }
    }, [archivedProjects]);

    const location = useLocation();

    // Check if we just navigated from a successful new recruiter registration
    useEffect(() => {
        if (location.state?.isNewRecruiter) {
            setCelebrationData({
                title: 'Welcome Aboard!',
                message: 'Your recruiter account has been successfully created. You can now start posting projects and finding top talent!'
            });
            setShowCelebration(true);

            // Clear the state so it doesn't re-trigger on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const [isPostProjectModalOpen, setIsPostProjectModalOpen] = useState(false);
    const [editingProjectData, setEditingProjectData] = useState<any | null>(null);

    // Profile Modal State
    const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Project Details Modal State
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [isProjectDetailsModalOpen, setIsProjectDetailsModalOpen] = useState(false);
    const [projectInitialTab, setProjectInitialTab] = useState<'details' | 'applicants' | 'archived' | 'working'>('details');

    // Modal Archive Confirmation State
    const [confirmingArchiveId, setConfirmingArchiveId] = useState<string | null>(null);

    // Celebration Modal State
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationData, setCelebrationData] = useState<{
        title: string;
        message: string;
        primaryActionText?: string;
        onPrimaryAction?: () => void;
    }>({ title: '', message: '' });

    // Discover Talent Filters and Sort State
    const [filterDomain, setFilterDomain] = useState<string>('All');
    const [filterCollege, setFilterCollege] = useState<string>('All');
    const [sortOption, setSortOption] = useState<string>('Completed Projects (High to Low)');

    const filteredAndSortedProfiles = MOCK_PROFILES.filter(profile => {
        const domainMatch = filterDomain === 'All' || profile.domain === filterDomain;
        const collegeMatch = filterCollege === 'All' || profile.college === filterCollege;
        return domainMatch && collegeMatch;
    }).sort((a, b) => {
        if (sortOption === 'Completed Projects (High to Low)') return b.completedProjects - a.completedProjects;
        if (sortOption === 'Completed Projects (Low to High)') return a.completedProjects - b.completedProjects;
        if (sortOption === 'Name (A-Z)') return a.name.localeCompare(b.name);
        return 0; // default
    });

    const handlePostProject = (projectData: any) => {
        if (editingProjectData) {
            // Update existing project
            setActiveProjects(prev => prev.map(p => p.id === editingProjectData.id ? { ...p, ...projectData } : p));
        } else {
            // Create new project mapping with default arrays
            const newProject = {
                ...projectData,
                id: Date.now().toString(),
                postedAt: new Date().toISOString(),
                candidates: [],
                appliedCandidates: [],
                workingCandidates: [],
                archivedCandidates: []
            };
            setActiveProjects(prev => [newProject, ...prev]);
        }
        setEditingProjectData(null);
    };

    const handleEditProjectClick = (e: React.MouseEvent, project: any) => {
        e.stopPropagation();
        setEditingProjectData(project);
        setIsPostProjectModalOpen(true);
    };

    const handleProfileClick = (profile: StudentProfile) => {
        setSelectedProfile(profile);
        setIsProfileModalOpen(true);
    };

    const handleProjectClick = (project: any) => {
        setSelectedProject(project);
        setProjectInitialTab('details');
        setIsProjectDetailsModalOpen(true);
    };

    const handleArchiveConfirmTrigger = (projectId: string) => {
        setConfirmingArchiveId(projectId);
        setIsProjectDetailsModalOpen(false); // Close details modal when checking archive to let ConfirmModal sit top 
    };

    const handleArchiveProject = () => {
        if (!confirmingArchiveId) return;

        const projectToArchive = activeProjects.find(p => p.id === confirmingArchiveId);
        if (projectToArchive) {
            setActiveProjects(activeProjects.filter(p => p.id !== confirmingArchiveId));
            setArchivedProjects([{ ...projectToArchive, status: 'completed' }, ...archivedProjects]);
            setIsProjectDetailsModalOpen(false); // Close the details modal if open
            setConfirmingArchiveId(null); // Close the confirm modal

            // Check if there are candidate to send letters to
            const hasCandidates = projectToArchive.workingCandidates && projectToArchive.workingCandidates.length > 0;

            setCelebrationData({
                title: 'Project Completed!',
                message: `Congratulations on archiving "${projectToArchive.role}"! ${hasCandidates ? 'Would you like to send completion letters to the students who worked on this project?' : 'You have successfully moved this project to your archived list.'}`,
                ...(hasCandidates ? {
                    primaryActionText: 'Send Letters',
                    onPrimaryAction: () => {
                        // Create a message thread for each working candidate
                        projectToArchive.workingCandidates?.forEach((candidate: any) => {
                            handleSendLetter(projectToArchive.id, candidate.id, 'completion', `Congratulations on successfully completing the ${projectToArchive.role} project! Please find your completion letter attached.`);
                        });
                        setShowCelebration(false);
                        setActiveTab('messages');

                        // Show alert
                        setTimeout(() => {
                            toast.success('Completion letters have been generated and sent to all associated candidates.');
                        }, 500);
                    }
                } : {})
            });
            setShowCelebration(true);
        }
    };

    const handleAcceptCandidate = (projectId: string, candidateId: string) => {
        const project = activeProjects.find(p => p.id === projectId);
        if (project && project.workingCandidates && project.workingCandidates.length >= (project.positions || 1)) {
            toast.error('Cannot accept more candidates. All positions are filled for this project.');
            return;
        }

        let acceptedCandidate: any = null;

        setActiveProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const candidate = p.appliedCandidates?.find((c: any) => c.id === candidateId);
                if (candidate) acceptedCandidate = candidate;

                const updatedCandidates = p.appliedCandidates.map((c: any) =>
                    c.id === candidateId ? { ...c, applicationStatus: 'accepted' } : c
                );
                const updatedProject = { ...p, appliedCandidates: updatedCandidates };
                if (selectedProject?.id === projectId) setSelectedProject(updatedProject);
                return updatedProject;
            }
            return p;
        }));

        // Create a new thread if it doesn't exist
        setThreads(prev => {
            const exists = prev.find(t => t.projectId === projectId && t.candidateId === candidateId);
            if (!exists && acceptedCandidate) {
                const newThread = {
                    id: Date.now().toString(),
                    projectId,
                    candidateId,
                    status: 'active',
                    messages: [
                        {
                            id: Date.now().toString() + '1',
                            senderId: 'recruiter',
                            text: `Hi ${acceptedCandidate.name}, your application for this project has been accepted! Let's discuss the next steps.`,
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
                return [newThread, ...prev];
            }
            return prev;
        });

        if (acceptedCandidate) {
            setCelebrationData({
                title: 'Accepted for Interview!',
                message: `${acceptedCandidate.name} has been accepted for an interview. You can now message the candidate to schedule the recruitment process.`
            });
            setShowCelebration(true);
        }

        // Close modal and switch to messages tab
        setIsProjectDetailsModalOpen(false);
        setActiveTab('messages');
    };

    const handleDeclineCandidate = (projectId: string, candidateId: string) => {
        setActiveProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const candidate = p.appliedCandidates?.find((c: any) => c.id === candidateId);
                if (candidate) {
                    const updatedProject = {
                        ...p,
                        appliedCandidates: p.appliedCandidates.filter((c: any) => c.id !== candidateId),
                        archivedCandidates: [...(p.archivedCandidates || []), candidate]
                    };
                    if (selectedProject?.id === projectId) setSelectedProject(updatedProject);
                    return updatedProject;
                }
            }
            return p;
        }));
    };

    const handleMessageWorkingCandidate = (projectId: string, candidateId: string) => {
        // Ensure a thread exists for this candidate
        setThreads(prev => {
            const exists = prev.find(t => t.projectId === projectId && t.candidateId === candidateId);
            if (!exists) {
                const candidate = activeProjects.find(p => p.id === projectId)?.workingCandidates?.find((c: any) => c.id === candidateId);
                if (candidate) {
                    const newThread = {
                        id: Date.now().toString(),
                        projectId,
                        candidateId,
                        status: 'selected', // Status is selected because they are working
                        messages: []
                    };
                    return [newThread, ...prev];
                }
            }
            return prev;
        });

        setIsProjectDetailsModalOpen(false);
        setActiveTab('messages');
    };

    const handleSendLetter = (projectId: string, candidateId: string, _type: 'joining' | 'completion' | 'discovery', content: string) => {
        setThreads(prev => {
            const existingThread = prev.find(t => t.projectId === projectId && t.candidateId === candidateId);
            const newMessage = {
                id: Date.now().toString(),
                senderId: 'recruiter',
                text: content,
                timestamp: new Date().toISOString()
            };

            if (existingThread) {
                return prev.map(t =>
                    t.id === existingThread.id
                        ? { ...t, messages: [...t.messages, newMessage] }
                        : t
                );
            } else {
                const newThread = {
                    id: Date.now().toString(),
                    projectId,
                    candidateId,
                    status: 'active',
                    messages: [newMessage]
                };
                return [newThread, ...prev];
            }
        });

        if (_type === 'discovery') {
            toast.success('Your message has been sent to the candidate successfully!');
        }
    };

    const handleCompleteProject = (projectId: string, candidateId: string) => {
        setActiveProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const candidate = p.workingCandidates?.find((c: any) => c.id === candidateId);
                if (candidate) {
                    const updatedProject = {
                        ...p,
                        workingCandidates: p.workingCandidates.filter((c: any) => c.id !== candidateId),
                        archivedCandidates: [...(p.archivedCandidates || []), { ...candidate, applicationStatus: 'completed' }]
                    };
                    if (selectedProject?.id === projectId) setSelectedProject(updatedProject);
                    return updatedProject;
                }
            }
            return p;
        }));
    };

    const handleRevertCandidate = (projectId: string, candidateId: string) => {
        setActiveProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const candidate = p.archivedCandidates?.find((c: any) => c.id === candidateId);
                if (candidate) {
                    const updatedProject = {
                        ...p,
                        archivedCandidates: p.archivedCandidates.filter((c: any) => c.id !== candidateId),
                        appliedCandidates: [...(p.appliedCandidates || []), { ...candidate, applicationStatus: 'pending' }]
                    };
                    if (selectedProject?.id === projectId) setSelectedProject(updatedProject);
                    return updatedProject;
                }
            }
            return p;
        }));
    };

    const handleCandidateMessageStatusChange = (projectId: string, candidateId: string, status: 'selected' | 'rejected') => {
        // Update thread status
        setThreads(prev => prev.map(t => {
            if (t.projectId === projectId && t.candidateId === candidateId) {
                return { ...t, status };
            }
            return t;
        }));

        setActiveProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                // Find the candidate (they should be in appliedCandidates with applicationStatus: 'accepted', or perhaps working/archived already)
                // Actually they might be in `appliedCandidates` 
                const candidate = p.appliedCandidates?.find((c: any) => c.id === candidateId) ||
                    p.workingCandidates?.find((c: any) => c.id === candidateId) ||
                    p.archivedCandidates?.find((c: any) => c.id === candidateId) ||
                    MOCK_PROFILES.find((c: any) => c.id === candidateId); // fallback

                if (candidate) {
                    let newApplied = p.appliedCandidates?.filter((c: any) => c.id !== candidateId) || [];
                    let newWorking = p.workingCandidates?.filter((c: any) => c.id !== candidateId) || [];
                    let newArchived = p.archivedCandidates?.filter((c: any) => c.id !== candidateId) || [];

                    if (status === 'selected') {
                        newWorking.push({ ...candidate, applicationStatus: 'accepted' });
                    } else if (status === 'rejected') {
                        newArchived.push({ ...candidate, applicationStatus: 'rejected' });
                    }

                    const updatedProject = {
                        ...p,
                        appliedCandidates: newApplied,
                        workingCandidates: newWorking,
                        archivedCandidates: newArchived
                    };

                    if (status === 'selected') {
                        setCelebrationData({
                            title: 'Candidate Hired!',
                            message: `${candidate.name} is hired and moved to the Currently Working tab of the project.`,
                            primaryActionText: 'View Working Tab',
                            onPrimaryAction: () => {
                                setShowCelebration(false);
                                setSelectedProject(updatedProject);
                                setProjectInitialTab('working');
                                setIsProjectDetailsModalOpen(true);
                            }
                        });
                        setShowCelebration(true);
                    }

                    return updatedProject;
                }
            }
            return p;
        }));
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
                            Recruiter Dashboard
                        </h1>
                        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                            Manage your live projects and discover top student talent.
                        </p>
                    </div>
                    {activeTab === 'projects' && (
                        <button
                            onClick={() => {
                                setEditingProjectData(null);
                                setIsPostProjectModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/40 hover:-translate-y-0.5"
                        >
                            <PlusCircle className="w-5 h-5" /> Post New Project
                        </button>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-2 sm:space-x-8 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar mask-edges min-w-full">
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`pb-4 px-2 sm:px-4 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'projects'
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                            }`}
                    >
                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                        My Projects
                        {activeTab === 'projects' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-600 dark:bg-brand-500 rounded-t-full animate-in fade-in zoom-in duration-300" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('talent')}
                        className={`pb-4 px-2 sm:px-4 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'talent'
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                            }`}
                    >
                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                        Discover Talent
                        {activeTab === 'talent' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-600 dark:bg-brand-500 rounded-t-full animate-in fade-in zoom-in duration-300" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('collaborated')}
                        className={`pb-4 px-2 sm:px-4 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'collaborated'
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                            }`}
                    >
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Collaborated Talent
                        {activeTab === 'collaborated' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-600 dark:bg-brand-500 rounded-t-full animate-in fade-in zoom-in duration-300" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`pb-4 px-2 sm:px-4 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'messages'
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                        Messages
                        {activeTab === 'messages' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-600 dark:bg-brand-500 rounded-t-full animate-in fade-in zoom-in duration-300" />
                        )}
                    </button>
                </div>

                <div className="mt-8">
                    {activeTab === 'projects' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {/* Project List will go here */}
                            {activeProjects.length === 0 ? (
                                <div className="text-center py-20 glass-card">
                                    <Briefcase className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No active projects</h3>
                                    <p className="mt-2 text-slate-500 dark:text-slate-400">Get started by creating a new live project for students.</p>
                                    <button
                                        onClick={() => {
                                            setEditingProjectData(null);
                                            setIsPostProjectModalOpen(true);
                                        }}
                                        className="mt-6 inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium py-3 px-6 rounded-xl transition-all shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 hover:-translate-y-0.5"
                                    >
                                        <PlusCircle className="w-5 h-5" /> Post New Project
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {activeProjects.map(project => (
                                        <div
                                            key={project.id}
                                            onClick={() => handleProjectClick(project)}
                                            className="glass-card p-4 sm:p-6 flex flex-col cursor-pointer hover:border-brand-500/50 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 p-2 rounded-lg">
                                                    <Briefcase className="w-6 h-6" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">{project.role}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{project.objective}</p>

                                            <div className="mt-auto space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex flex-wrap gap-y-2 gap-x-4">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                                                        <MapPin className="w-4 h-4" /> {project.domain}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                                                        <Clock className="w-4 h-4 mr-1 text-slate-400" /> {project.tenure} Months
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-md mt-1 mb-2">
                                                        <Users className="w-4 h-4" /> {project.positions - (project.workingCandidates?.length || 0)} {Math.abs(project.positions - (project.workingCandidates?.length || 0)) === 1 ? 'Position' : 'Positions'} Left
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-2 w-full">
                                                    <button
                                                        onClick={(e) => handleEditProjectClick(e, project)}
                                                        className="flex-1 text-sm font-bold px-4 py-2.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20 transition-colors btn-interactive border border-brand-200 dark:border-brand-800"
                                                    >
                                                        Edit Project
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setConfirmingArchiveId(project.id);
                                                        }}
                                                        className="flex-1 text-sm font-bold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors btn-interactive"
                                                    >
                                                        Archive Project
                                                    </button>
                                                </div>

                                                {project.attachmentName && (
                                                    <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 mt-2">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <FileText className="w-4 h-4 text-brand-500 flex-shrink-0" />
                                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{project.attachmentName}</span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Archived Projects Section */}
                            {archivedProjects.length > 0 && (
                                <div className="mt-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Archived</h2>
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {archivedProjects.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {archivedProjects.map(project => (
                                            <div
                                                key={project.id}
                                                onClick={() => handleProjectClick(project)}
                                                className="glass-card p-4 sm:p-6 flex flex-col cursor-pointer border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all opacity-80 hover:opacity-100"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 p-2 rounded-lg">
                                                        <Briefcase className="w-6 h-6" />
                                                    </div>
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${(!project.workingCandidates?.length || project.workingCandidates.length === 0) ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                                        {(!project.workingCandidates?.length || project.workingCandidates.length === 0) ? 'Expired' : 'Completed'}
                                                    </span>
                                                </div>
                                                <h3 className="font-heading font-bold text-xl text-slate-700 dark:text-slate-300 mb-2">{project.role}</h3>
                                                <p className="text-slate-500 dark:text-slate-500 text-sm mb-4 line-clamp-2">{project.objective}</p>

                                                <div className="mt-auto space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                                                    <div className="flex flex-wrap gap-y-2 gap-x-4">
                                                        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-500">
                                                            <MapPin className="w-4 h-4" /> {project.domain}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-500">
                                                            <Clock className="w-4 h-4" /> {project.tenure}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                            <Users className="w-4 h-4 text-slate-400" /> {project.workingCandidates?.length || 0}/{project.positions || 1} Hired
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'talent' && (
                        <div className="overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 shrink-0 gap-4 overflow-x-auto pb-2">
                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto min-w-max">
                                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Domain</label>
                                        <select
                                            value={filterDomain}
                                            onChange={(e) => setFilterDomain(e.target.value)}
                                            className="w-full sm:w-48 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                        >
                                            <option value="All">All Domains</option>
                                            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">College</label>
                                        <select
                                            value={filterCollege}
                                            onChange={(e) => setFilterCollege(e.target.value)}
                                            className="w-full sm:w-64 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                        >
                                            <option value="All">All Colleges</option>
                                            {MOCK_COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 w-full sm:w-auto">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sort By</label>
                                    <select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="w-full sm:w-64 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                    >
                                        <option value="Completed Projects (High to Low)">Projects (High to Low)</option>
                                        <option value="Completed Projects (Low to High)">Projects (Low to High)</option>
                                        <option value="Name (A-Z)">Name (A-Z)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
                                {filteredAndSortedProfiles.map(profile => (
                                    <StudentProfileCard
                                        key={profile.id}
                                        profile={profile}
                                        onClick={handleProfileClick}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'collaborated' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {MOCK_COLLABORATED_TALENT.map(collab => (
                                    <CollaboratedTalentCard key={collab.id} collab={collab} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <MessagingHub
                                projects={activeProjects}
                                threads={threads}
                                setThreads={setThreads}
                                onUpdateCandidateStatus={handleCandidateMessageStatusChange}
                            />
                        </div>
                    )}
                </div>

            </div >

            <PostProjectModal
                isOpen={isPostProjectModalOpen}
                onClose={() => {
                    setIsPostProjectModalOpen(false);
                    setEditingProjectData(null);
                }}
                onSubmit={handlePostProject}
                editingProject={editingProjectData}
            />

            <StudentProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                profile={selectedProfile}
                hasActiveProjects={activeProjects.length > 0 || archivedProjects.length > 0}
                activeProjects={activeProjects}
                onPostProjectClick={() => setIsPostProjectModalOpen(true)}
                onMessageInitiated={(projectId, candidateId, message) => handleSendLetter(projectId, candidateId, 'discovery', message)}
            />

            <ProjectDashboard
                isOpen={isProjectDetailsModalOpen}
                onClose={() => setIsProjectDetailsModalOpen(false)}
                project={selectedProject}
                initialTab={projectInitialTab}
                onArchive={handleArchiveConfirmTrigger}
                onAcceptCandidate={handleAcceptCandidate}
                onDeclineCandidate={handleDeclineCandidate}
                onMessageWorkingCandidate={handleMessageWorkingCandidate}
                onSendLetter={handleSendLetter}
                onCompleteProject={handleCompleteProject}
                onRevertCandidate={handleRevertCandidate}
            />

            <ConfirmModal
                isOpen={!!confirmingArchiveId}
                title="Archive Project"
                message="Are you completely sure you want to archive this project? Once archived, it will no longer be visible to students for new applications, but you will still retain access to the candidate pool."
                confirmText="Archive Project"
                cancelText="Cancel"
                type="warning"
                onConfirm={handleArchiveProject}
                onCancel={() => setConfirmingArchiveId(null)}
            />

            <CelebrationModal
                isOpen={showCelebration}
                onClose={() => setShowCelebration(false)}
                title={celebrationData.title}
                message={celebrationData.message}
                primaryActionText={celebrationData.primaryActionText}
                onPrimaryAction={celebrationData.onPrimaryAction}
            />
        </div >
    );
};

export default RecruiterDashboard;
