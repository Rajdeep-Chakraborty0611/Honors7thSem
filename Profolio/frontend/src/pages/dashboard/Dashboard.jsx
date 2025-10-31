import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Dashboard.module.css'; // 👈 Import CSS Module

const Dashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const userNameDisplay = userProfile?.name || userProfile?.username || 'User';

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.greeting}>👋 Hello, {userNameDisplay}</h1>
      <p className={styles.subtitle}>
        Welcome to your console. Quickly access the main portfolio management areas below.
      </p>
      
      <div className={styles.cardGrid}>
        
        {/* Card for Profile Editing */}
        <div 
          onClick={() => navigate('/dashboard/profile')} 
          className={styles.actionCard}
        >
          <h3 className={styles.cardTitle}>Edit Profile Information</h3>
          <p className={styles.cardDescription}>
            Update your bio, title, and social media links.
          </p>
        </div>

        {/* Card for Project Management */}
        <div 
          onClick={() => navigate('/dashboard/projects')} 
          className={styles.actionCard}
        >
          <h3 className={styles.cardTitle}>Manage Projects</h3>
          <p className={styles.cardDescription}>
            Add, edit, and link your projects, including GitHub repositories.
          </p>
        </div>
      </div>

      {userProfile?.username && (
        <div className={styles.linkSection}>
            <p className={styles.publicLinkText}>Your Live Portfolio Link:</p>
            <a 
                href={`/portfolio/${userProfile.username}`} 
                target="_blank" 
                className={styles.publicLinkUrl} 
                rel="noopener noreferrer"
            >
                {window.location.origin}/portfolio/{userProfile.username}
            </a>
            <p className={styles.cardDescription} style={{ marginTop: '10px' }}>
                Share this link with everyone to showcase your work!
            </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;