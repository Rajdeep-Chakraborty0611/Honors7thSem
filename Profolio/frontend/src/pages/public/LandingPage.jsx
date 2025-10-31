import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../../components/common/AppNavbar'; // Dynamic Navbar
import styles from './LandingPage.module.css'; // Dedicated styles

const LandingPage = () => {
  return (
    <>
      {/* 1. Render the professional Navbar */}
      <AppNavbar /> 
      
      {/* 2. Main Hero Content Area */}
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Showcase Your Brilliance. <span className={styles.accentText}>Effortlessly.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Build a stunning, professional portfolio website in minutes. No coding required.
          </p>
          
          <div className={styles.ctaGroup}>
            <Link 
              to="/signup" 
              className={styles.ctaPrimary}
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className={styles.ctaSecondary}
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* 3. Feature Section */}
        <section className={styles.featureSection}>
          <h2 className={styles.featureTitle}>What You Can Build</h2>
          <div className={styles.featureGrid}>
            
            <div className={styles.featureCard}>
              <h3 className={styles.cardTitle}>Personalized Profile</h3>
              <p className={styles.cardDescription}>Highlight your skills, experience, and contact information with a custom bio and title.</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3 className={styles.cardTitle}>Showcase Projects</h3>
              <p className={styles.cardDescription}>Add detailed project descriptions, images, and crucial GitHub repository links.</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3 className={styles.cardTitle}>Share Instantly</h3>
              <p className={styles.cardDescription}>Get a unique, shareable URL for your portfolio to impress recruiters and clients.</p>
            </div>
            
          </div>
        </section>

        {/* 4. Footer */}
        <footer className={styles.footer}>
          &copy; {new Date().getFullYear()} Portfolio Builder. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default LandingPage;