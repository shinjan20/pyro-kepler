import { Code, Cpu, LineChart, Briefcase } from 'lucide-react';
import type { StudentProfile } from '../components/recruiter/StudentProfileCard';

export const MOCK_PROJECTS = [
    {
        id: 1,
        title: 'Machine Learning Model for Customer Churn',
        company: 'FinTech Innovators',
        duration: '2 Months',
        type: 'Remote',
        category: 'Software Engineering',
        tags: ['Python', 'Scikit-Learn', 'Data Analysis'],
        remuneration: '15000',
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        totalPositions: 4,
        hiredPositions: 2
    },
    {
        id: 2,
        title: 'Supply Chain Optimization Strategy',
        company: 'Global Logistics Inc.',
        duration: '3 Months',
        type: 'Remote',
        category: 'Operations Management',
        tags: ['Logistics', 'Six Sigma', 'Excel'],
        remuneration: '20000',
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        totalPositions: 3,
        hiredPositions: 1
    },
    {
        id: 3,
        title: 'CAD Design for Electric Vehicle Chassis',
        company: 'EcoMotors',
        duration: '2 Months',
        type: 'Remote',
        category: 'Mechanical Engineering',
        tags: ['SolidWorks', 'FEA', 'Automotive'],
        remuneration: '18000',
        postedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
        totalPositions: 2,
        hiredPositions: 0
    },
    {
        id: 4,
        title: 'Market Entry Strategy for APAC Region',
        company: 'GrowthPartners Consulting',
        duration: '1 Month',
        type: 'Remote',
        category: 'Marketing',
        tags: ['Market Research', 'Go-To-Market', 'Strategy'],
        remuneration: '0',
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        totalPositions: 5,
        hiredPositions: 4
    },
    {
        id: 5,
        title: 'Full Stack Dashboard for IoT Devices',
        company: 'SmartHome Systems',
        duration: '4 Months',
        type: 'Remote',
        category: 'Software Engineering',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        remuneration: '25000',
        postedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
        totalPositions: 2,
        hiredPositions: 2
    },
    {
        id: 6,
        title: 'Thermal Analysis of Battery Packs',
        company: 'AeroTech Dynamics',
        duration: '2 Months',
        type: 'Remote',
        category: 'Mechanical Engineering',
        tags: ['Ansys', 'Thermodynamics', 'Matlab'],
        remuneration: '0',
        postedAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(), // 65 days ago
        totalPositions: 3,
        hiredPositions: 0
    }
];

export const CATEGORIES = ['All', 'Software Engineering', 'Mechanical Engineering', 'Operations Management', 'Marketing'];

export const DOMAINS = ['Software Engineering', 'Mechanical Engineering', 'Marketing', 'Product Management', 'Design', 'Data Science'];

export const MOCK_PROFILES: StudentProfile[] = [
    {
        id: '1',
        name: 'Alex Johnson',
        college: 'National Institute of Technology',
        domain: 'Software Engineering',
        completedProjects: 2,
        photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
        pastProjects: [
            { title: 'Full Stack Dashboard', company: 'SmartHome Systems', domain: 'Software Engineering', duration: '14 weeks' },
            { title: 'API Gateway Optimization', company: 'TechFlow', domain: 'Backend Development', duration: '6 weeks' }
        ]
    },
    {
        id: '2',
        name: 'Sarah Chen',
        college: 'Indian Institute of Technology',
        domain: 'Product Management',
        completedProjects: 1,
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        pastProjects: [
            { title: 'Market Entry Strategy', company: 'GrowthPartners', domain: 'Strategy', duration: '8 weeks' }
        ]
    },
    {
        id: '3',
        name: 'David Kumar',
        college: 'VJTI Mumbai',
        domain: 'Marketing',
        completedProjects: 2,
        pastProjects: [
            { title: 'Social Media Campaign', company: 'EcoSystems', domain: 'Digital Marketing', duration: '4 weeks' },
            { title: 'Brand Identity Redesign', company: 'Acme Corp', domain: 'Branding', duration: '10 weeks' }
        ]
    },
    {
        id: '4',
        name: 'Priya Sharma',
        college: 'BITS Pilani',
        domain: 'Data Science',
        completedProjects: 1,
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        pastProjects: [
            { title: 'ML Churn Model', company: 'FinTech Innovators', domain: 'Machine Learning', duration: '8 weeks' }
        ]
    },
    {
        id: '5',
        name: 'Rohan Mehta',
        college: 'Delhi Technological University',
        domain: 'Mechanical Engineering',
        completedProjects: 3,
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        pastProjects: [
            { title: 'EV Battery Thermal Analysis', company: 'AeroTech Dynamics', domain: 'Mechanical Engineering', duration: '12 weeks' },
            { title: 'CAD Chassis Design', company: 'EcoMotors', domain: 'CAD Design', duration: '8 weeks' },
            { title: 'HVAC Airflow Optimization', company: 'CoolTech Systems', domain: 'Thermodynamics', duration: '6 weeks' }
        ]
    },
    {
        id: '6',
        name: 'Aisha Patel',
        college: 'NID Ahmedabad',
        domain: 'Design',
        completedProjects: 1,
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        pastProjects: [
            { title: 'Fintech Mobile App UI/UX', company: 'PayPulse', domain: 'UI/UX Design', duration: '10 weeks' }
        ]
    },
    {
        id: '7',
        name: 'Vikram Singh',
        college: 'IIM Bangalore',
        domain: 'Operations Management',
        completedProjects: 2,
        pastProjects: [
            { title: 'Supply Chain Optimization', company: 'Global Logistics', domain: 'Operations', duration: '12 weeks' },
            { title: 'Inventory Turnaround Strategy', company: 'RetailX', domain: 'Strategy', duration: '8 weeks' }
        ]
    },
    {
        id: '8',
        name: 'Emily Davis',
        college: 'Stanford University',
        domain: 'Data Science',
        completedProjects: 1,
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        pastProjects: [
            { title: 'NLP Sentiment Analysis', company: 'SocialTrend', domain: 'Machine Learning', duration: '14 weeks' }
        ]
    },
    {
        id: '9',
        name: 'Rahul Gupta',
        college: 'IIT Roorkee',
        domain: 'Software Engineering',
        completedProjects: 4,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        pastProjects: [
            { title: 'Microservices Migration', company: 'CloudScale', domain: 'Backend Development', duration: '16 weeks' },
            { title: 'React Native Payment SDK', company: 'FinCore', domain: 'Mobile Development', duration: '8 weeks' },
            { title: 'Redis Caching Layer', company: 'Streamify', domain: 'Software Engineering', duration: '4 weeks' },
            { title: 'Internal Operations Dashboard', company: 'Acme Corp', domain: 'Frontend Development', duration: '6 weeks' }
        ]
    },
    {
        id: '10',
        name: 'Neha Kapoor',
        college: 'MICA',
        domain: 'Marketing',
        completedProjects: 1,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        pastProjects: [
            { title: 'GenZ Influencer Campaign', company: 'GlamourBrands', domain: 'Digital Marketing', duration: '8 weeks' }
        ]
    }
];

export const HERO_COMPANIES = [
    { name: 'Acme Corp', icon: Briefcase, colorHoverClass: 'hover:text-brand-500 dark:hover:text-brand-400' },
    { name: 'TechFlow', icon: Cpu, colorHoverClass: 'hover:text-blue-500 dark:hover:text-blue-400' },
    { name: 'DevMatrix', icon: Code, colorHoverClass: 'hover:text-purple-500 dark:hover:text-purple-400' },
    { name: 'GrowthSync', icon: LineChart, colorHoverClass: 'hover:text-orange-500 dark:hover:text-orange-400' },
    { name: 'EcoSystems', icon: Code, colorHoverClass: 'hover:text-green-500 dark:hover:text-green-400' },
];

export const HERO_STATS = [
    { label: 'Live Projects', count: '1,240+', sub: 'Available right now' },
    { label: 'Students Placed', count: '8,500+', sub: 'Last 12 months' },
    { label: 'Hiring Partners', count: '500+', sub: 'Active companies' },
    { label: 'Avg Stipend', count: '₹20k/m', sub: 'For ongoing projects' },
];

export const INITIAL_ARCHIVED_PROJECTS = [
    {
        id: 'archived-1',
        role: 'Backend Engineering Intern',
        domain: 'Software Engineering',
        objective: 'Develop scalable REST APIs for our new product module.',
        expectations: 'Experience with Node.js, Express, and PostgreSQL is required.',
        tenure: '3',
        positions: '2',
        hiredPositions: 2,
        remuneration: '15000',
        perks: 'Letter of Recommendation',
        postedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        candidates: [MOCK_PROFILES[0], MOCK_PROFILES[3]]
    },
    {
        id: 'archived-2',
        role: 'UI/UX Design Intern',
        domain: 'Design',
        objective: 'Design a responsive marketing landing page for an upcoming campaign.',
        expectations: 'Figma and strong visual design skills.',
        tenure: '1',
        positions: '1',
        hiredPositions: 1,
        remuneration: '10000',
        perks: 'Certificate of Completion',
        postedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        candidates: [MOCK_PROFILES[1]]
    }
];

export const MOCK_COLLABORATED_TALENT = [
    {
        id: 'collab-1',
        name: 'Sarah Chen',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        projectName: 'Backend Engineering Intern',
        domain: 'Software Engineering',
        rating: 4.8,
        review: 'Excellent backend skills. Delivered the MVP exactly on time.'
    },
    {
        id: 'collab-2',
        name: 'Marcus Johnson',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        projectName: 'UI/UX Design Intern',
        domain: 'Design',
        rating: 5.0,
        review: 'Incredibly talented designer. The landing page converted 30% better than our previous one.'
    },
    {
        id: 'collab-3',
        name: 'Priya Sharma',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        projectName: 'Backend Engineering Intern',
        domain: 'Software Engineering',
        rating: 4.5,
        review: 'Very good understanding of Node.js. Needed some guidance on database architecture but learned fast.'
    },
    {
        id: 'collab-4',
        name: 'Aisha Patel',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        projectName: 'Product Management Intern',
        domain: 'Product Management',
        rating: 0,
        review: ''
    }
];

export const MOCK_MESSAGES = [
    {
        id: 'msg-1',
        projectId: '1',
        candidateId: '1',
        status: 'active',
        messages: [
            { id: 'm1', senderId: 'recruiter', text: 'Hi Alex, we reviewed your application for the Frontend Developer Intern role.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { id: 'm2', senderId: '1', text: 'Thank you! I am very excited about this opportunity.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
            { id: 'm3', senderId: 'recruiter', text: 'Could you share some links to your recent React projects?', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() }
        ]
    },
    {
        id: 'msg-2',
        projectId: '1',
        candidateId: '3',
        status: 'active',
        messages: [
            { id: 'm1', senderId: 'recruiter', text: 'Hi David, your profile looks great.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
            { id: 'm2', senderId: '3', text: 'Thanks! Looking forward to contributing.', timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() }
        ]
    }
];
