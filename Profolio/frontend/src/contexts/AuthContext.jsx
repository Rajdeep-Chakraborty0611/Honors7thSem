import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// 2. Custom Hook to use the Auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider Component
export const AuthProvider = ({ children }) => {
  // Check local storage for a token or user info on mount
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real app, this effect would check local storage for a token
  // and validate it with the backend to set the initial user state.
  useEffect(() => {
    // Mock check: Check if a user is "logged in" based on a mock ID
    const mockUserId = localStorage.getItem('user_id');
    if (mockUserId) {
      // In production, you would fetch user details based on the ID/Token
      setCurrentUser({ id: mockUserId, username: 'mockuser', email: 'test@example.com' });
    }
    setLoading(false);
  }, []);

  // --- Mock Authentication Functions ---

  const login = async (email, password) => {
    // 💡 Backend Logic Placeholder:
    // 1. Send credentials to backend API.
    // 2. Receive a JWT token and user data on success.
    // 3. Store the token/user_id in localStorage.
    
    // Mock Success:
    console.log(`Mock Login successful for ${email}`);
    const mockId = 'u-12345';
    localStorage.setItem('user_id', mockId);
    setCurrentUser({ id: mockId, username: 'newuser', email: email });
    return true; // Indicate success
  };

  const logout = () => {
    // 💡 Backend Logic Placeholder:
    // 1. Optionally hit a backend logout endpoint.
    // 2. Clear token/user_id from localStorage.
    localStorage.removeItem('user_id');
    setCurrentUser(null);
  };

  const googleLogin = async (credential) => {
    // 💡 Backend Logic Placeholder:
    // 1. Send the 'credential' (Google JWT ID Token) to your backend API.
    // 2. The backend verifies the token, creates/updates the user in the database.
    // 3. Backend sends back its own JWT token and user data.
    
    console.log("Google Credential Received:", credential);

    // MOCK Backend response (in a real app, this is where you'd fetch data)
    try {
      // Simulate API call delay
      // await new Promise(resolve => setTimeout(resolve, 1000)); 

      // MOCK Success:
      const mockId = 'google-u-45678';
      localStorage.setItem('user_id', mockId); // Store the local app's user ID
      setCurrentUser({ id: mockId, username: 'googleuser', email: 'google@example.com' });
      return true; // Indicate success
    } catch (error) {
      console.error("Authentication failed:", error);
      return false; // Indicate failure
    }
  };

  const value = {
    currentUser,
    loading,
    login: googleLogin, // We will use the Google login primarily
    logout,
    isAuthenticated: !!currentUser,
    googleLogin, // Export the function explicitly
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;