import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './DashboardLayout.module.css'; 
// Note: Icon placeholders are used. If you install react-icons, you can replace the <span> tags.

const DashboardLayout = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Used to highlight the active link

  const navItems = [
    { path: "/dashboard", label: "Home" /* Icon: FaHome */ },
    { path: "/dashboard/profile", label: "Edit Profile" /* Icon: FaUserEdit */ },
    { path: "/dashboard/projects", label: "Manage Projects" /* Icon: FaProjectDiagram */ },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Logout failed. Please try again.");
    }
  };

  /**
   * Determines the correct CSS class for navigation links based on the current path.
   */
  const getLinkClass = (path) => {
    // Check if the current pathname starts with the link path for active highlighting
    return location.pathname.startsWith(path) 
           ? styles.navLinkActive 
           : styles.navLink;
  };

  return (
    <div className={styles.dashboardLayout}>
      
      {/* 1. Sidebar (Fixed Navigation Panel) */}
      <aside className={styles.sidebar}>
        
        {/* Navigation Content Wrapper: flex-grow: 1 pushes the logout button down */}
        <div className={styles.navWrapper}> 
          <h2 className={styles.title}>Builder Console</h2>
          <nav>
            <ul>
              {/* Mapping Navigation Items */}
              {navItems.map(item => (
                <li key={item.path} className={styles.navItem}>
                  <Link to={item.path} className={getLinkClass(item.path)}>
                    <span style={{ marginRight: '10px' }}>▪</span> 
                    {item.label}
                  </Link>
                </li>
              ))}
              
              {/* Public Portfolio Link (Call to Action) */}
              {userProfile?.username && (
                <li className={styles.navItem} style={{ marginTop: '20px' }}>
                    <a 
                        href={`/portfolio/${userProfile.username}`} 
                        target="_blank" 
                        className={styles.publicLink} 
                        rel="noopener noreferrer"
                    >
                        <span style={{ marginRight: '10px' }}>🔗</span> 
                        View Live Portfolio
                    </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
        
        {/* 2. Logout Button (Pinned to the bottom) */}
        <button 
          onClick={handleLogout} 
          className={styles.logoutButton}
        >
          <span style={{ marginRight: '10px' }}>🚪</span>
          Logout
        </button>
      </aside>

      {/* 3. Main Content Area */}
      <main className={styles.mainContent}>
        <Outlet /> {/* Renders the current child route (Dashboard, ProfileEditor, etc.) */}
      </main>
    </div>
  );
};

export default DashboardLayout;