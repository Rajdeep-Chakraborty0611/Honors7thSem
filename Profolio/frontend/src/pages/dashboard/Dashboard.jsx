import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to landing page
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>👋 Welcome to your Dashboard, {currentUser?.username || 'User'}!</h1>
      <p>This is your control panel for building your portfolio.</p>
      
      <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
        <button 
          onClick={() => navigate('/dashboard/profile')}
          style={buttonStyle}
        >
          Edit Profile Information
        </button>
        <button 
          onClick={() => navigate('/dashboard/projects')}
          style={buttonStyle}
        >
          Manage Projects
        </button>
      </div>

      <button 
        onClick={handleLogout} 
        style={{ ...buttonStyle, backgroundColor: '#dc3545', marginTop: '40px' }}
      >
        Logout
      </button>
    </div>
  );
};

// Simple inline styles for demonstration
const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
};

export default Dashboard;