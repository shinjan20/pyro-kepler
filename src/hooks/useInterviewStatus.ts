import { useState, useEffect } from 'react';

export const useInterviewStatus = () => {
    const [interviewStatus, setInterviewStatusState] = useState<'ready' | 'open' | 'closed'>(() => {
        return (localStorage.getItem('pyroInterviewStatus') as 'ready' | 'open' | 'closed') || 'ready';
    });

    useEffect(() => {
        const handleStatusChange = () => {
            setInterviewStatusState((localStorage.getItem('pyroInterviewStatus') as 'ready' | 'open' | 'closed') || 'ready');
        };
        window.addEventListener('pyroInterviewStatusChange', handleStatusChange);
        return () => window.removeEventListener('pyroInterviewStatusChange', handleStatusChange);
    }, []);

    const updateStatus = (status: 'ready' | 'open' | 'closed') => {
        localStorage.setItem('pyroInterviewStatus', status);
        setInterviewStatusState(status);
        window.dispatchEvent(new Event('pyroInterviewStatusChange'));
    };

    return { interviewStatus, updateStatus };
};
