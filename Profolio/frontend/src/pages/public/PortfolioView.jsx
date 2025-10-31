import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileByUsername, getProjects } from '../../services/firestoreService';
import styles from './PortfolioView.module.css'; // 👈 Import CSS Module

const PortfolioView = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setProfile(null);
      setProjects([]);

      try {
        const userProfile = await getProfileByUsername(username);

        if (!userProfile) {
          setError(`User "${username}" not found.`);
          return;
        }

        setProfile(userProfile);
        
        // Fetch projects using the UID found in the profile
        const userProjects = await getProjects(userProfile.uid);
        setProjects(userProjects);

      } catch (err) {
        console.error("Error fetching portfolio data:", err);
        setError("Failed to load portfolio due to a network or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) return <div className={styles.message}>Loading Portfolio...</div>;
  if (error) return <div className={styles.message}>{error}</div>;
  if (!profile) return <div className={styles.message}>Portfolio not available.</div>;

  // Helper function to render links if they exist
  const renderLink = (url, label) => {
    if (!url) return null;
    // Ensure links are full URLs
    const fullUrl = (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) ? url : `https://${url}`;
    
    return (
      <a 
        href={fullUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.socialLink}
      >
        {label}
      </a>
    );
  };
  
  return (
    <div className={styles.portfolioContainer}>
      
      {/* --- Header/Hero Section --- */}
      <header className={styles.header}>
        <h1 className={styles.name}>{profile.name || 'Developer Portfolio'}</h1>
        {profile.title && <p className={styles.title}>{profile.title}</p>}
        
        <div className={styles.socialLinks}>
          {renderLink(profile.github, 'GitHub')}
          {renderLink(profile.linkedin, 'LinkedIn')}
          {renderLink(`mailto:${profile.email}`, 'Email')}
          {renderLink(profile.twitter, 'Twitter')}
        </div>
      </header>
      
      {/* --- Bio Section --- */}
      <div className={styles.bioSection}>
        <h2 className={styles.sectionTitle}>About Me</h2>
        <p className={styles.bio}>
          {profile.bio || "This developer hasn't added a bio yet. Check out their projects below!"}
        </p>
      </div>

      {/* --- Projects Section --- */}
      <h2 className={styles.sectionTitle}>Featured Projects</h2>
      <div className={styles.projectsGrid}>
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <h3 className={styles.projectName}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              
              <div className={styles.projectLinks}>
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.projectLink} ${styles.githubLink}`}
                >
                  View Code (GitHub)
                </a>
                {project.demo && (
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${styles.projectLink} ${styles.demoLink}`}
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.message} style={{ gridColumn: '1 / -1' }}>
            No projects have been added yet.
          </p>
        )}
      </div>
      
      <footer className={styles.message} style={{ marginTop: '100px', fontSize: '1rem' }}>
          Portfolio
      </footer>
    </div>
  );
};

export default PortfolioView;