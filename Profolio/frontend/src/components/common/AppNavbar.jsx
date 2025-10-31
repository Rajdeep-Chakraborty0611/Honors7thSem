import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AppNavbar.module.css';

const AppNavbar = () => {
    const { isAuthenticated, logout, userProfile } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <nav className={styles.navbar}>
            <Link to={isAuthenticated ? "/dashboard" : "/"} className={styles.logo}>
                Portfolio Builder 🛠️
            </Link>

            <div className={styles.navLinks}>
                
                {isAuthenticated ? (
                    // --- Authenticated View ---
                    <>
                        {/* Link to the user's dashboard home */}
                        <Link to="/dashboard" className={styles.navLink}>
                            Dashboard
                        </Link>
                        
                        {/* Link to the user's public portfolio */}
                        {userProfile?.username && (
                            <a 
                                href={`/portfolio/${userProfile.username}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.navLink}
                            >
                                View Live
                            </a>
                        )}

                        <button onClick={handleLogout} className={styles.ctaButton}>
                            Logout
                        </button>
                    </>
                ) : (
                    // --- Public/Logged-Out View ---
                    <>
                        <Link to="/" className={styles.navLink}>
                            Home
                        </Link>
                        <Link to="/signup" className={styles.navLink}>
                            Sign Up
                        </Link>
                        <Link to="/login" className={styles.ctaButton}>
                            Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default AppNavbar;