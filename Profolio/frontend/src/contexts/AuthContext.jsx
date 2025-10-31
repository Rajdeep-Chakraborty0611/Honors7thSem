import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from '../firebaseConfig'; // 👈 Import Firebase Auth

// 1. Create the Context
const AuthContext = createContext();

// 2. Custom Hook to use the Auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Effect to monitor Firebase Authentication State ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Firebase automatically updates 'user' when they log in or out
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  // --- Authentication Functions using Firebase ---

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // The user object is automatically set by onAuthStateChanged
      const user = result.user;
      console.log("Firebase Google Login successful:", user);
      
      // 💡 Next Step: Add logic here to check/create user data in Firestore
      
      return user; 
    } catch (error) {
      console.error("Firebase Google Login Failed:", error.code, error.message);
      // Handle specific errors (e.g., account exists with different credential)
      return null;
    }
  };

  const logout = () => {
    // Firebase function to sign out
    return signOut(auth);
    // The state is automatically updated by onAuthStateChanged
  };

  const value = {
    currentUser,
    loading,
    googleLogin,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};