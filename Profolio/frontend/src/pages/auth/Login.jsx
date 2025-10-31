import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google'; // 👈 Import GoogleLogin component

const Login = () => {
  const { googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    const success = await googleLogin(credentialResponse.credential);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    alert('Google login failed. Please try again.');
  };

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#eef2f5' 
      }}>
      <div style={{ 
          padding: '40px', 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}>
        <h2>Welcome to the Portfolio Builder</h2>
        <p style={{ marginBottom: '20px', textAlign: 'center' }}>Sign in to continue</p>
        
        {/* The Google Sign In Button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
        />

        <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
          By signing in, you agree to our terms.
        </p>
      </div>
    </div>
  );
};

export default Login;