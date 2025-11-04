import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileByUsername, getProjects } from '../../services/firestoreService';
import styles from './PortfolioView.module.css'; 

// Import Slider component and arrows
import Slider from 'react-slick'; 

// Placeholder image URLs 
const DEFAULT_BANNER_URL = 'https://firebasestorage.googleapis.com/v0/b/project-builder-app-123.appspot.com/o/placeholders%2Fdefault-banner.jpg?alt=media'; 
const DEFAULT_PROFILE_PIC = 'https://firebasestorage.googleapis.com/v0/b/project-builder-app-123.appspot.com/o/placeholders%2Fdefault-user.jpg?alt=media'; 

// Custom Arrow Components for react-slick
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.slickNext}`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.slickPrev}`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

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

  // --- Helper Components ---
  // Define LoadingMessage locally as a component for clarity
  const LoadingMessage = ({ text }) => (
    <div className={styles.portfolioContainer} style={{ textAlign: 'center', padding: '100px' }}>
      <h1 style={{ color: 'var(--color-accent-blue)', fontSize: '2rem' }}>{text}</h1>
    </div>
  );

  const renderLink = (url, label) => {
    if (!url || url.includes('https://github.com/')) return null; 
    
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

  const renderSocialLinks = (profile) => (
    <div className={styles.socialLinks} style={{ margin: '10px 0' }}>
      {profile.github && renderLink(profile.github, 'GitHub')}
      {profile.linkedin && renderLink(profile.linkedin, 'LinkedIn')}
      {profile.twitter && renderLink(profile.twitter, 'Twitter')}
    </div>
  );
  
  if (loading) return <LoadingMessage text="Loading Portfolio Data..." />;
  if (error) return <LoadingMessage text={`Error: ${error}`} />;
  if (!profile) return <LoadingMessage text="Portfolio Not Found." />;
  
  const userBanner = profile.bannerUrl || DEFAULT_BANNER_URL;
  const userImage = profile.profilePicUrl || DEFAULT_PROFILE_PIC;

  // react-slick settings
  const carouselSettings = {
    className: styles.slickSlider, 
    centerMode: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 3, 
    slidesToScroll: 1, 
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    dots: true,
    responsive: [ 
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 1, 
          slidesToScroll: 1,
        }
      }
    ]
  };
  
  return (
    <div className={styles.portfolioContainer}>
      
      {/* 1. TOP BANNER SECTION (Using cleaned style concatenation) */}
      <section 
          className={styles.bannerSection}
          // Using standard string concatenation for safer compatibility
          style={{ backgroundImage: 'url(' + userBanner + ')' }} 
      >
          <h1 className={styles.bannerOverlayText}>
              {profile.tagline || profile.title || "Digital Portfolio"}
          </h1>
      </section>

      {/* 2. ABOUT ME SECTION (2-Column Grid) */}
      <section className={styles.aboutSection}>
          <h2 className={styles.sectionTitle}>About Me</h2>
          
          <div className={styles.aboutGrid}>
              {/* Left Column: Image */}
              <div className={styles.selfImageContainer}>
                  <img 
                      src={userImage} 
                      alt={`${profile.name}'s portrait`} 
                      className={styles.selfImage} 
                  />
              </div>

              {/* Right Column: Name, Title, Bio, Contact */}
              <div className={styles.textContent}>
                  <h1 className={styles.name}>{profile.name || 'Developer Name'}</h1>
                  <p className={styles.title}>{profile.title || 'Aspiring Developer'}</p>
                  
                  {renderSocialLinks(profile)}
                  
                  <p className={styles.bio} style={{ marginTop: '20px' }}>
                      {profile.bio || "This developer hasn't added a bio yet. Check out their projects below!"}
                  </p>
                  
                  {/* Secondary Contact Info */}
                  <div style={{ marginTop: '20px', color: 'var(--color-text-muted)' }}>
                    {profile.location && <p>📍 {profile.location}</p>}
                    {profile.email && <p>✉️ {profile.email}</p>}
                    {profile.phone && <p>📞 {profile.phone}</p>}
                  </div>
              </div>
          </div>
      </section>

      {/* 3. TECHNICAL SKILLS SECTION (react-slick Carousel) */}
      {profile.skills && profile.skills.length > 0 && (
          <section className={styles.carouselSection}>
              <h2 className={styles.sectionTitle}>Technical Skills</h2>
              <Slider {...carouselSettings}> 
                  {profile.skills.map((skill, index) => (
                      <div key={index}> 
                          <div className={styles.skillTag}>
                              <span>{skill}</span>
                          </div>
                      </div>
                  ))}
              </Slider>
          </section>
      )}

      {/* 4. PROJECTS SECTION (react-slick Carousel) */}
      {projects && projects.length > 0 && (
          <section className={styles.carouselSection}>
              <h2 className={styles.sectionTitle}>Featured Projects</h2>
              <Slider {...carouselSettings}> 
                  {projects.map(project => (
                      <div key={project.id}>
                          <div className={styles.projectCard}>
                            <div className={styles.projectCardInner}>
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
                          </div>
                      </div>
                  ))}
              </Slider>
          </section>
      )}
      
      {/* 5. Footer */}
      <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} {profile.name || 'Developer'}. All rights reserved.</p>
          <p>Powered by the Profolio App.</p>
      </footer>
    </div>
  );
};

export default PortfolioView;