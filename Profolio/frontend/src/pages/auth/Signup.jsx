import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Create an Account</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          We currently use Google to simplify account creation.
        </p>
        
        <p>
          Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>**Log In**</Link>
        </p>
        <p style={{ marginTop: '15px', fontSize: '0.9em', color: '#888' }}>
          (The Google login button is on the login page.)
        </p>
      </div>
    </div>
  );
};

// Simple inline styles for demonstration
const containerStyle = {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh', 
    backgroundColor: '#eef2f5' 
};

const cardStyle = { 
    padding: '40px', 
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center'
};

export default Signup;