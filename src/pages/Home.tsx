import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedProjects from '../components/FeaturedProjects';
import HowItWorks from '../components/HowItWorks';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { isAuthenticated, userRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (userRole === 'recruiter') {
                navigate('/dashboard/recruiter');
            } else {
                navigate('/projects');
            }
        }
    }, [isAuthenticated, userRole, navigate]);

    // If authenticated, we redirect, but still render the rest or return null to prevent flash
    if (isAuthenticated) return null;

    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <FeaturedProjects />
            <HowItWorks />
        </div>
    );
};

export default Home;
