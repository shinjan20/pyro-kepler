import { Briefcase, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-brand-600 p-2 rounded-xl">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-heading font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                                ProjectMatch
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Bridging the gap between academic learning and real-world industry experience for students worldwide.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-brand-500 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-brand-500 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-brand-500 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-slate-900 dark:text-white mb-4">Students</h4>
                        <ul className="space-y-3">
                            <li><Link to="/projects" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Find Projects</Link></li>
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">How it Works</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Success Stories</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Career Advice</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-slate-900 dark:text-white mb-4">Companies</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Post a Project</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Hire Talent</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Partner with Us</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} ProjectMatch. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        Made with <span className="text-red-500">♥</span> for students.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
