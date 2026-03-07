import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Settings from './pages/Settings';
import StudentProfileForm from './pages/StudentProfileForm';
import StudentDashboard from './pages/StudentDashboard';
import CompletedProjects from './pages/CompletedProjects';
import AuthCallback from './pages/AuthCallback';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

const ProtectedStudentRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userRole, hasCompletedProfile } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (userRole === 'student' && !hasCompletedProfile) return <Navigate to="/student-profile-setup" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col font-sans overflow-x-hidden w-full">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/v1/callback" element={<AuthCallback />} />
              <Route path="/student-profile-setup" element={<StudentProfileForm />} />
              <Route path="/dashboard/student" element={<ProtectedStudentRoute><StudentDashboard /></ProtectedStudentRoute>} />
              <Route path="/completed-projects" element={<ProtectedStudentRoute><CompletedProjects /></ProtectedStudentRoute>} />
              <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
              <Route path="/settings" element={<Settings />} />

              {/* Catch-all route for unknown paths */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-right" toastOptions={{
          className: 'dark:bg-slate-900 dark:text-white',
          style: {
            borderRadius: '12px',
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid rgba(226, 232, 240, 0.4)',
          },
        }} />
      </Router>
    </AuthProvider>
  );
}

export default App;
