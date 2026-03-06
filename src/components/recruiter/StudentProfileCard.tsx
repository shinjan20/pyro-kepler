import { User, Briefcase, GraduationCap } from 'lucide-react';

export interface StudentProfile {
    id: string;
    name: string;
    photoUrl?: string;
    college: string;
    domain: string;
    completedProjects: number;
    pastProjects?: Array<{
        title: string;
        company: string;
        domain: string;
        duration: string;
    }>;
}

interface StudentProfileCardProps {
    profile: StudentProfile;
    onClick: (profile: StudentProfile) => void;
}

const StudentProfileCard = ({ profile, onClick }: StudentProfileCardProps) => {
    return (
        <div
            onClick={() => onClick(profile)}
            className="glass-card p-4 sm:p-6 flex flex-col items-center cursor-pointer group"
        >
            <div className="relative mb-4">
                {profile.photoUrl ? (
                    <img
                        src={profile.photoUrl}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-sm"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-sm">
                        <User className="w-10 h-10 text-slate-400" />
                    </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-xs font-bold px-2 py-1 rounded-full border-2 border-white dark:border-slate-900 flex items-center gap-1 shadow-sm">
                    <Briefcase className="w-3 h-3" /> {profile.completedProjects}
                </div>
            </div>

            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {profile.name}
            </h3>

            <div className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-3 bg-brand-50 gap-2 dark:bg-brand-500/10 px-3 py-1 rounded-full">
                {profile.domain}
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 w-full justify-center">
                <GraduationCap className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{profile.college}</span>
            </div>
        </div>
    );
};

export default StudentProfileCard;
