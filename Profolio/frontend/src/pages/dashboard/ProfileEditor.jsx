import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from '../../services/firestoreService'; // 👈 Import update function

const ProfileEditor = () => {
  const { currentUser, userProfile, updateContextProfile } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Load data from context (Firestore) when component mounts
  useEffect(() => {
    if (userProfile) {
      setProfileData(userProfile);
    }
  }, [userProfile]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    if (!currentUser) {
        setMessage('Error: Not logged in.');
        setIsSubmitting(false);
        return;
    }

    try {
        // 2. Call the Firestore service to save the data
        await updateProfile(currentUser.uid, profileData);
        
        // 3. Update the global context state with the new data
        updateContextProfile(profileData);
        
        setMessage('✅ Profile saved successfully!');
    } catch (error) {
        console.error("Error saving profile:", error);
        setMessage(`❌ Error saving profile: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  // ... (Styling variables and return JSX structure are the same as before)
  
  if (!userProfile) return <h1 style={{ textAlign: 'center', padding: '100px' }}>Loading Profile...</h1>;

  // The form structure remains the same, only the logic is updated
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>⚙️ Edit Your Profile Information</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>This information will form the main sections of your public portfolio.</p>

      <form onSubmit={handleSubmit} /* ... (form styling) ... */>
        
        {/* Input Fields (Map over profileData keys for general fields) */}
        {Object.keys(profileData)
            .filter(key => !['uid', 'email', 'createdAt'].includes(key)) // Filter out internal fields
            .map(key => (
          <div key={key} /* ... (input group styling) ... */>
            <label /* ... (label styling) ... */>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
            {key === 'bio' ? (
                <textarea
                    name={key}
                    value={profileData[key]}
                    onChange={handleChange}
                    placeholder={`Enter your ${key}...`}
                    style={{ /* ... (input style) ... */ height: '100px' }}
                />
            ) : (
                <input 
                    type="text" 
                    name={key} 
                    value={profileData[key]} 
                    onChange={handleChange} 
                    placeholder={`Enter your ${key}...`}
                    style={{ /* ... (input style) ... */ }}
                />
            )}
          </div>
        ))}

        <button type="submit" disabled={isSubmitting} /* ... (button styling) ... */>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
        {message && <p style={{ marginTop: '15px', color: message.startsWith('❌') ? 'red' : 'green' }}>{message}</p>}
      </form>
    </div>
  );
};

const formStyle = { display: 'grid', gridTemplateColumns: '1fr', gap: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' };

export default ProfileEditor;