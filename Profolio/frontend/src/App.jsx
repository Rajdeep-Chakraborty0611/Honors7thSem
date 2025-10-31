import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Import Pages for Routing ---
// Authentication & Dashboard Pages (to be created)
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import ProfileEditor from './pages/dashboard/ProfileEditor';
import ProjectsManager from './pages/dashboard/ProjectsManager';

// Public Pages (to be created)
import LandingPage from './pages/public/LandingPage';
import PortfolioView from './pages/public/PortfolioView';
import ProtectedRoute from './components/common/ProtectedRoute'; // 👈 Import ProtectedRoute

function App() {
  return (
    <div className="App">
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/portfolio/:username" element={<PortfolioView />} />

        {/* AUTHENTICATION ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES GROUP */}
        {/* This route acts as a wrapper. If the check fails, all child routes are blocked */}
        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<ProfileEditor />} />
            <Route path="/dashboard/projects" element={<ProjectsManager />} />
        </Route>
        
        {/* Catch-all for 404 */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;