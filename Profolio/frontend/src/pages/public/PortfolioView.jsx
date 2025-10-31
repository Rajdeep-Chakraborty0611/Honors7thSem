import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileByUsername, getProjects } from '../../services/firestoreService'; // 👈 Import new lookup functions

const PortfolioView = () => {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);
      setPortfolio(null); // Clear previous data

      try {
        // 1. Find the user profile by the username in the URL
        const profile = await getProfileByUsername(username);

        if (!profile) {
          setError(`User profile for @${username} was not found.`);
          setLoading(false);
          return;
        }

        // 2. Use the profile's UID to fetch all associated projects
        const userProjects = await getProjects(profile.uid);
        
        // 3. Combine and set the final portfolio object
        setPortfolio({
          profile,
          projects: userProjects,
        });

      } catch (e) {
        console.error("Failed to fetch portfolio data:", e);
        setError('An error occurred while loading the portfolio.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]); // Re-run whenever the username in the URL changes


  if (loading) return <h1 style={{ textAlign: 'center', padding: '100px' }}>Loading Portfolio...</h1>;
  if (error) return <h1 style={{ textAlign: 'center', padding: '100px', color: '#dc3545' }}>Error: {error}</h1>;
  if (!portfolio) return <h1 style={{ textAlign: 'center', padding: '100px' }}>Portfolio Not Found</h1>;

  const { profile, projects } = portfolio;
  
  return (
    <div style={portfolioContainerStyle}>
      
      {/* 1. Header/Profile Section */}
      <header style={headerStyle}>
        <h2>{profile.name}</h2>
        <h3 style={{ color: '#007bff' }}>{profile.title}</h3>
        <p style={{ maxWidth: '600px', margin: '15px auto' }}>{profile.bio}</p>
        <div style={socialLinksStyle}>
            {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {/* Add more social links here */}
        </div>
      </header>

      {/* 2. Projects Section */}
      {projects.length > 0 && (
        <section style={projectsSectionStyle}>
          <h3>Featured Projects</h3>
          <div style={projectGridStyle}>
            {projects.map(p => (
              <div key={p.id} style={projectCardStyle}>
                <h4>{p.title}</h4>
                <p>{p.description}</p>
                <div style={{ marginTop: '15px' }}>
                    <a href={p.github} target="_blank" rel="noopener noreferrer" style={projectLinkStyle}>View Code on GitHub</a>
                    {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" style={projectLinkStyle}> | Live Demo</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer style={footerStyle}>
        <p>&copy; {new Date().getFullYear()} {profile.name}. Built with the Portfolio Builder.</p>
      </footer>
    </div>
  );
};

// --- Styling Variables (for reference) ---
const portfolioContainerStyle = { padding: '40px', fontFamily: 'Arial, sans-serif' };
const headerStyle = { textAlign: 'center', padding: '40px', backgroundColor: '#f0f8ff', borderRadius: '8px' };
const socialLinksStyle = { marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px' };
const projectsSectionStyle = { marginTop: '50px', padding: '20px' };
const projectGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginTop: '20px' };
const projectCardStyle = { border: '1px solid #ccc', padding: '20px', borderRadius: '6px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' };
const footerStyle = { textAlign: 'center', marginTop: '50px', color: '#888', borderTop: '1px solid #eee', paddingTop: '20px' };
const projectLinkStyle = { color: '#007bff', textDecoration: 'none' };

export default PortfolioView;