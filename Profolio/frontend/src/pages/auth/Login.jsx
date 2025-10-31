import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css'; // 👈 Import CSS Module

const Login = () => {
  const { googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

useEffect(() => {
    // This side effect runs only when isAuthenticated changes
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true }); // Use replace to prevent back navigation loop
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const user = await googleLogin();
      if (user) {
        navigate('/dashboard'); 
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to log in with Google. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to manage your portfolio</p>
        
        <button 
          onClick={handleGoogleSignIn}
          className={styles.googleButton}
        >
          {/* Using a placeholder for the Google Icon */}
          <span className={styles.googleIcon}></span>
          Sign in with Google
        </button>

        <p className={styles.signupLink}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;