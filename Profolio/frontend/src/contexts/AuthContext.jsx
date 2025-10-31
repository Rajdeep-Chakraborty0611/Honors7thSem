import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from '../firebaseConfig';
import { ensureUserProfileExists, getUserProfile } from '../services/firestoreService'; // 👈 Import new functions // 👈 Import Firebase Auth

// 1. Create the Context
const AuthContext = createContext();

// 2. Custom Hook to use the Auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // 👈 New state for profile data
  const [loading, setLoading] = useState(true);

  // --- Effect to monitor Firebase Authentication State and load profile ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // If user logs in, fetch their persistent profile data from Firestore
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        // If user logs out
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // --- Authentication Functions using Firebase ---
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // CRITICAL STEP: Check/create user profile in Firestore
      const profile = await ensureUserProfileExists(user);
      setUserProfile(profile);

      return user; 
    } catch (error) {
      console.error("Firebase Google Login Failed:", error.code, error.message);
      return null;
    }
  };

  const logout = () => {
    setUserProfile(null); // Clear profile locally on logout
    return signOut(auth);
  };
  
  // --- New function to update profile and refresh context state ---
  const updateContextProfile = (newProfileData) => {
    setUserProfile(prev => ({ ...prev, ...newProfileData }));
  };


  const value = {
    currentUser,
    userProfile, // 👈 Export profile data
    loading,
    googleLogin,
    logout,
    updateContextProfile, // 👈 Export update function
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};