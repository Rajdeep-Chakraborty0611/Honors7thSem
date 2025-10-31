import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff' }}>
      <h1>Portfolio Builder 🛠️</h1>
      <p>Create and showcase your professional portfolio in minutes.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/signup" style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Get Started
        </Link>
        <Link to="/login" style={{ margin: '10px', padding: '10px 20px', border: '1px solid #007bff', color: '#007bff', textDecoration: 'none', borderRadius: '5px' }}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;