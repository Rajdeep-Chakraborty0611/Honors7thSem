import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileByUsername, getProjects } from '../../services/firestoreService';
import styles from './PortfolioView.module.css'; 

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

  // --- Loading and Error States ---
  const LoadingMessage = ({ text }) => (
    <div className={styles.portfolioContainer} style={{ textAlign: 'center', padding: '100px' }}>
      <h1 style={{ color: 'var(--color-accent-blue)', fontSize: '2rem' }}>{text}</h1>
    </div>
  );

  if (loading) return <LoadingMessage text="Loading Portfolio Data..." />;
  if (error) return <LoadingMessage text={`Error: ${error}`} />;
  if (!profile) return <LoadingMessage text="Portfolio Not Found." />;

  // --- Helper Functions ---
  const renderLink = (url, label) => {
    if (!url || url.includes('https://github.com/')) return null; // Hide links with just base URL
    
    // Ensure links are safe and display correctly
    const fullUrl = (url.startsWith('http') || url.startsWith('mailto')) ? url : `https://${url}`;
    
    return (
      <a 
        href={fullUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.socialLink}
      >
        <span style={{ marginRight: '5px' }}>{label === 'GitHub' ? '🐙' : label === 'LinkedIn' ? '👔' : label === 'Email' ? '✉️' : '🔗'}</span>
        {label}
      </a>
    );
  };
  
  return (
    <div className={styles.portfolioContainer}>
      
      {/* 1. Header/Hero Section */}
      <header className={styles.header}>
        <h1 className={styles.name}>{profile.name || 'Developer Portfolio'}</h1>
        
        {/* New Field: Tagline */}
        {profile.tagline && <p className={styles.tagline}>{profile.tagline}</p>}

        {/* Existing Field: Title */}
        {profile.title && <p className={styles.title}>{profile.title}</p>}
        
        <div className={styles.socialLinks}>
          {profile.location && renderLink(`https://maps.google.com/?q=${profile.location}`, profile.location)}
          {profile.phone && renderLink(`tel:${profile.phone}`, 'Phone')}
          {profile.email && renderLink(`mailto:${profile.email}`, 'Email')}
        </div>
        <div className={styles.socialLinks}>
          {profile.github && renderLink(profile.github, 'GitHub')}
          {profile.linkedin && renderLink(profile.linkedin, 'LinkedIn')}
          {profile.twitter && renderLink(profile.twitter, 'Twitter')}
        </div>
      </header>
      
      {/* 2. Bio Section */}
      <section className={styles.bioSection}>
        <h2 className={styles.sectionTitle}>About Me</h2>
        <p className={styles.bio}>
          {profile.bio || "This developer hasn't added a bio yet. Check out their projects below!"}
        </p>
      </section>

      {/* 3. SKILLS Section */}
      {profile.skills && profile.skills.length > 0 && (
          <section className={styles.skillSection}>
              <h2 className={styles.sectionTitle}>Technical Skills</h2>
              <div className={styles.tagListContainer}>
                  {profile.skills.map((skill, index) => (
                      <span key={index} className={styles.skillTag}>
                          {skill}
                      </span>
                  ))}
              </div>
          </section>
      )}

      {/* 4. WORK EXPERIENCE Section */}
      {profile.experience && profile.experience.length > 0 && (
          <section className={styles.experienceSection}>
              <h2 className={styles.sectionTitle}>Work Experience</h2>
              {profile.experience.map((exp, index) => (
                  <div key={index} className={styles.experienceCard}>
                      <h3>{exp.title} at {exp.company}</h3>
                      <p className={styles.durationText}>{exp.duration}</p>
                      <p className={styles.descriptionText}>{exp.description}</p>
                  </div>
              ))}
          </section>
      )}

      {/* 5. EDUCATION Section */}
      {profile.education && profile.education.length > 0 && (
          <section className={styles.educationSection}>
              <h2 className={styles.sectionTitle}>Education</h2>
              {profile.education.map((edu, index) => (
                  <div key={index} className={styles.educationCard}>
                      <h3>{edu.degree} in {edu.field}</h3>
                      <h4>{edu.institution} ({edu.period})</h4>
                  </div>
              ))}
          </section>
      )}

      {/* 6. Projects Section */}
      <section>
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
                    View Code
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
            <p className={styles.bio} style={{maxWidth: '100%'}}>
              No projects have been added yet.
            </p>
          )}
        </div>
      </section>
      
      {/* 7. Footer */}
      <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} {profile.name || 'Developer'}. All rights reserved.</p>
          <p>Powered by the Portfolio Builder App.</p>
      </footer>
    </div>
  );
};

export default PortfolioView;