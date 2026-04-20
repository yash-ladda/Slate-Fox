import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components & Pages
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import UpdateJob from './pages/UpdateJobs';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import MyPostedJobs from './pages/MyPostedJobs';
import JobApplications from './pages/JobApplications';
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';

import { isAuthenticated, getUser, logout } from './utils/auth';

// ✅ Protected Route
const ProtectedRoute = ({ children }) => {
    const authenticated = isAuthenticated();
    return authenticated ? children : <Navigate to="/login" />;
};

// ✅ Main App Content (IMPORTANT: useLocation must be inside Router)
const AppContent = () => {
    const location = useLocation();
    const isLandingPage = location.pathname === "/";

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = getUser();
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen w-full bg-[#EDF1D6]">
            {/* ✅ Hide Navbar ONLY on landing page */}
            {!isLandingPage && (
                <Navbar user={user} onLogout={handleLogout} />
            )}

            <main className="w-full">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage user={user} onLogout={handleLogout}/>} />
                    <Route path="/login" element={<Login setGlobalUser={setUser} />} />
                    <Route path="/signup" element={<Signup setGlobalUser={setUser} />} />
                    <Route path="/auth/signup" element={<Signup setGlobalUser={setUser} />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                    <Route path="/jobs/:jobId" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />

                    {/* Recruiter Routes */}
                    <Route path="/create-job" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
                    <Route path="/jobs/:jobId/edit" element={<ProtectedRoute><UpdateJob /></ProtectedRoute>} />
                    <Route path="/my-jobs" element={<ProtectedRoute><MyPostedJobs /></ProtectedRoute>} />
                    <Route path="/applications/jobs/:jobId" element={<ProtectedRoute><JobApplications /></ProtectedRoute>} />

                    {/* Worker Routes */}
                    <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />

                    {/* Shared Protected Routes */}
                    <Route path="/auth/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/auth/profile/:userId/edit" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
};

// ✅ Root App
const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;