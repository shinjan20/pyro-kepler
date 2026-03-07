import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, BookOpen, UploadCloud, CheckCircle2, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import confetti from 'canvas-confetti';
import { checkFormForProfanityAsync } from '../utils/profanityFilter';
import ProfanityWarningModal from '../components/ProfanityWarningModal';

const DOMAINS = [
    'Software Engineering',
    'Data Science & AI',
    'Product Management',
    'Design (UI/UX)',
    'Marketing',
    'Operations',
    'Business Analyst',
    'Other'
];

const StudentProfileForm = () => {
    const [college, setCollege] = useState('');
    const [domain, setDomain] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    // Refs for hidden file inputs
    const photoInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const { userName, updateUserPhoto, completeProfile } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!college || !domain) {
            setError('Please fill out all required fields.');
            return;
        }

        setIsLoading(true);

        const profanityField = await checkFormForProfanityAsync({ college, domain });
        if (profanityField) {
            setError('Please remove inappropriate language before continuing.');
            setIsLoading(false);
            return;
        }

        // Simulate API call to save profile
        setTimeout(() => {
            setIsLoading(false);
            if (photoFile) {
                const objectUrl = URL.createObjectURL(photoFile);
                updateUserPhoto(objectUrl);
            }
            if (resumeFile) {
                console.log("Saving resume file:", resumeFile.name);
                localStorage.setItem('studentResumeName', resumeFile.name);
                localStorage.setItem('studentResumeUrl', '#');
            }

            // Save text fields to localStorage
            localStorage.setItem('studentCollege', college);
            localStorage.setItem('studentDomain', domain);

            completeProfile(); // Auth Context Flag
            setShowSuccessModal(true);

            // Fire short burst of Confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 10000
            });

            // Animate progress bar and redirect
            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += 10;
                setProgress(currentProgress);
                if (currentProgress >= 100) {
                    clearInterval(interval);
                    setShowSuccessModal(false);
                    navigate('/dashboard/student');
                }
            }, 150);

        }, 1200);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#030712] transition-colors duration-500 overflow-hidden">
            {/* Animated Mesh Background Splashes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/20 dark:bg-brand-500/10 blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-br from-brand-500 to-purple-600 p-4 rounded-3xl shadow-2xl shadow-brand-500/20">
                            <Briefcase className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-slate-900 dark:text-white">
                        Welcome, {userName || 'Student'}! 👋
                    </h2>
                    <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                        Let's set up your profile so recruiters can find you for the best live projects.
                    </p>
                </div>

                <div className="glass-card sm:p-10 p-6 shadow-2xl shadow-brand-500/5 relative overflow-hidden">
                    {/* Decorative blob inside card */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl pointer-events-none"></div>

                    <ProfanityWarningModal error={error} onClose={() => setError('')} />
                    {error && (
                        <div className={`mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl items-start gap-3 text-sm animate-in fade-in zoom-in duration-300 ${(error.toLowerCase().includes('inappropriate') || error.toLowerCase().includes('professional')) ? 'hidden md:flex' : 'flex'}`}>
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form noValidate onSubmit={handleSubmit} className="space-y-6 relative z-10">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* College Field */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="college" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    College / University Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        id="college"
                                        type="text"
                                        required
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        placeholder="e.g. Indian Institute of Technology"
                                        className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Preferred Domain */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="domain" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Preferred Domain
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <BookOpen className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <select
                                        id="domain"
                                        required
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-sm appearance-none"
                                    >
                                        <option value="" disabled>Select your primary domain</option>
                                        {DOMAINS.map(d => (
                                            <option key={d} value={d} className="bg-white dark:bg-slate-900">{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Profile Photo Upload */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Profile Photo <span className="text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => photoInputRef.current?.click()}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                                    </div>
                                    <div className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white transition-all shadow-sm flex items-center justify-between hover:border-brand-500/50">
                                        <span className={photoFile ? "text-slate-900 dark:text-white" : "text-slate-400"}>
                                            {photoFile ? photoFile.name : "Upload a profile picture..."}
                                        </span>
                                        <UploadCloud className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={photoInputRef}
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setPhotoFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                    PNG, JPG up to 5MB.
                                </p>
                            </div>

                            {/* CV / Resume Upload */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Resume / CV <span className="text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => resumeInputRef.current?.click()}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FileText className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                                    </div>
                                    <div className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white transition-all shadow-sm flex items-center justify-between hover:border-brand-500/50">
                                        <span className={resumeFile ? "text-slate-900 dark:text-white" : "text-slate-400"}>
                                            {resumeFile ? resumeFile.name : "Upload your resume..."}
                                        </span>
                                        <UploadCloud className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        ref={resumeInputRef}
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setResumeFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                    PDF or Word Document up to 10MB.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <button
                                type="submit"
                                disabled={isLoading || !college || !domain}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-brand-500/20 text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span className="flex items-center gap-2 relative z-10">
                                        <CheckCircle2 className="w-5 h-5" /> Complete Profile Check-in
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" />
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full mx-auto relative z-10 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Profile Complete!</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            Your profile has been saved successfully. Redirecting to your dashboard...
                        </p>

                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-500 transition-all duration-150 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfileForm;
