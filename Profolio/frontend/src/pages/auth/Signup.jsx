import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css'; // Re-using Login styles for the card/container
import AppNavbar from '../../components/common/AppNavbar'; // 👈 Imported Navbar

const Signup = () => {
  return (
    <>
      {/* 1. Render the AppNavbar */}
      <AppNavbar /> 
      
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          
          <h2 className={styles.title}>Join the Portfolio Builder</h2>
          <p className={styles.subtitle}>
            Create your professional portfolio with a single click.
          </p>
          
          <Link 
            to="/login" 
            className={styles.googleButton} 
            // Re-use the googleButton style for the CTA link
          >
            <span className={styles.googleIcon}></span>
            Sign Up with Google
          </Link>

          <p className={styles.signupLink} style={{ marginTop: '20px' }}>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;