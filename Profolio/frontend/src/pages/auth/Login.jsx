import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if authenticated (Firebase handles the state check)
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleGoogleSignIn = async () => {
    const user = await googleLogin();
    if (user) {
      // Redirect handled by AuthProvider's state update, but we force navigation here
      navigate('/dashboard'); 
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Sign In to your Portfolio Builder</h2>
        <p style={{ marginBottom: '20px', textAlign: 'center' }}>Use your Google Account to create/sign in.</p>
        
        {/* Custom Google Sign In Button */}
        <button 
          onClick={handleGoogleSignIn}
          style={googleButtonStyle}
        >
          {/*  */}
          Sign in with Google
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
          By signing in, your profile is created automatically.
        </p>
      </div>
    </div>
  );
};

// Styles (from previous step, added Google Button style)
const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#eef2f5' };
const cardStyle = { padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' };
const googleButtonStyle = { 
    padding: '10px 20px', 
    backgroundColor: '#4285F4', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

export default Login;