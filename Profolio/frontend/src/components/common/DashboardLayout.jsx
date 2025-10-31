import React, { useState } from 'react'; // 👈 Import useState
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './DashboardLayout.module.css'; 
// Note: Icon placeholders are used. You can replace the '▪' and '🚪' with actual icons if needed.

const DashboardLayout = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // 1. New State for Collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Home" /* Icon: FaHome */ },
    { path: "/dashboard/profile", label: "Edit Profile" /* Icon: FaUserEdit */ },
    { path: "/dashboard/projects", label: "Manage Projects" /* Icon: FaProjectDiagram */ },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); 
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const toggleSidebar = () => {
      setIsCollapsed(prev => !prev);
  };

  /**
   * Determines the correct CSS class for navigation links based on the current path.
   */
  const getLinkClass = (path) => {
    if (path === '/dashboard') {
        return location.pathname === '/dashboard' ? styles.navLinkActive : styles.navLink;
    }
    return location.pathname.startsWith(path) 
           ? styles.navLinkActive 
           : styles.navLink;
  };

  // Determine the sidebar class based on state
  const sidebarClass = `${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`;

  return (
    <div className={styles.dashboardLayout}>
      
      {/* 1. Sidebar (Fixed Navigation Panel) */}
      <aside className={sidebarClass}>
        
        {/* Toggle Button */}
        <button onClick={toggleSidebar} className={styles.toggleButton}>
            {isCollapsed ? '>' : '<'}
        </button>

        {/* Navigation Content Wrapper: flex-grow: 1 pushes the logout button down */}
        <div className={styles.navWrapper}> 
          <h2 className={isCollapsed ? styles.titleCollapsed : styles.title}>
            {isCollapsed ? '=' : 'ProFolio'}
          </h2>
          <nav>
            <ul>
              {/* Mapping Navigation Items */}
              {navItems.map(item => (
                <li key={item.path} className={styles.navItem}>
                  <Link to={item.path} className={getLinkClass(item.path)}>
                    {/* Icon placeholder is always visible */}
                    <span style={{ marginRight: isCollapsed ? '0' : '10px' }} className={styles.iconVisible}>•</span> 
                    {/* Label is conditionally hidden */}
                    <span className={isCollapsed ? styles.labelHidden : ''}>{item.label}</span>
                  </Link>
                </li>
              ))}
              
              {/* Public Portfolio Link (Call to Action) */}
            {userProfile?.username && (
              <li className={styles.navItem} style={{ marginTop: '20px' }}>
                  <a 
                      href={`/portfolio/${userProfile.username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      // 👈 Apply conditional class here
                      className={`${styles.publicLink} ${isCollapsed ? styles.publicLinkCollapsed : ''}`} 
                  >
                      {/* Icon placeholder is always visible */}
                      <span style={{ marginRight: isCollapsed ? '0' : '10px' }} className={styles.iconVisible}>🔗</span> 
                      {/* Label is conditionally hidden */}
                      <span className={isCollapsed ? styles.labelHidden : ''}>View Live Portfolio</span>
                  </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
        
        {/* 2. Logout Button (Pinned to the bottom) */}
        <button 
          onClick={handleLogout} 
          className={`${styles.logoutButton} ${isCollapsed ? styles.logoutButtonCollapsed : ''}`}
        >
          <span style={{ marginRight: isCollapsed ? '0' : '10px' }}>🚪</span>
          <span className={isCollapsed ? styles.labelHidden : ''}>Logout</span>
        </button>
      </aside>

      {/* 3. Main Content Area */}
      <main className={styles.mainContent}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default DashboardLayout;