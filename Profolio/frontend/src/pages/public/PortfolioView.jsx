import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Mock Data structure (simulates fetching data from backend)
const mockPortfolioData = {
  username: 'johndoe',
  profile: { name: 'John Doe', title: 'Full Stack Developer', bio: 'Building scalable web applications.', linkedin: '#', github: '#johndoe' },
  projects: [
    { id: 1, title: 'Portfolio Builder App', description: 'Platform for developers.', github: '#repo1', demo: '#' },
    { id: 2, title: 'Data Analysis Dashboard', description: 'Visualizing financial data.', github: '#repo2', demo: null },
  ],
};

const PortfolioView = () => {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      // 💡 Backend Logic Placeholder:
      // 1. Fetch data from backend API using the username (GET /api/portfolios/:username)
      
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        if (username === mockPortfolioData.username) {
          setPortfolio(mockPortfolioData);
          setError(null);
        } else {
          setError(`Portfolio for user '${username}' not found.`);
        }
      } catch (e) {
        setError('An error occurred while loading the portfolio.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]);


  if (loading) return <h1 style={{ textAlign: 'center', padding: '100px' }}>Loading Portfolio...</h1>;
  if (error) return <h1 style={{ textAlign: 'center', padding: '100px', color: 'red' }}>Error: {error}</h1>;
  if (!portfolio) return <h1 style={{ textAlign: 'center', padding: '100px' }}>Portfolio Not Found</h1>;

  return (
    <div style={portfolioContainerStyle}>
      
      {/* 1. Header/Profile Section */}
      <header style={headerStyle}>
        <h2>{portfolio.profile.name}</h2>
        <h3 style={{ color: '#007bff' }}>{portfolio.profile.title}</h3>
        <p style={{ maxWidth: '600px', margin: '15px auto' }}>{portfolio.profile.bio}</p>
        <div style={socialLinksStyle}>
            <a href={portfolio.profile.github} target="_blank" rel="noopener noreferrer">GitHub</a> | 
            <a href={portfolio.profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </header>

      {/* 2. Projects Section */}
      <section style={projectsSectionStyle}>
        <h3>Featured Projects</h3>
        <div style={projectGridStyle}>
          {portfolio.projects.map(p => (
            <div key={p.id} style={projectCardStyle}>
              <h4>{p.title}</h4>
              <p>{p.description}</p>
              <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ marginTop: '10px', display: 'block' }}>View Code</a>
            </div>
          ))}
        </div>
      </section>

      <footer style={footerStyle}>
        <p>&copy; {new Date().getFullYear()} {portfolio.profile.name}. Built with the Portfolio Builder.</p>
      </footer>
    </div>
  );
};

// Simple inline styles for the PortfolioView
const portfolioContainerStyle = { padding: '40px', fontFamily: 'Arial, sans-serif' };
const headerStyle = { textAlign: 'center', padding: '40px', backgroundColor: '#f0f8ff', borderRadius: '8px' };
const socialLinksStyle = { marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px' };
const projectsSectionStyle = { marginTop: '50px', padding: '20px' };
const projectGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginTop: '20px' };
const projectCardStyle = { border: '1px solid #ccc', padding: '20px', borderRadius: '6px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' };
const footerStyle = { textAlign: 'center', marginTop: '50px', color: '#888', borderTop: '1px solid #eee', paddingTop: '20px' };

export default PortfolioView;