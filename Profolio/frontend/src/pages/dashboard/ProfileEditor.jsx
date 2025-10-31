import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
// Note: We need a UserContext later to store persistent user data, 
// but for now, we'll use local state.

const ProfileEditor = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: currentUser?.username || '',
    title: 'Software Developer', // Placeholder
    bio: '',
    github: '',
    linkedin: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // 💡 Backend Logic Placeholder:
    // 1. Send profileData to your backend API (e.g., PUT /api/users/:id/profile)
    // 2. Await the response (user data saved in database)
    
    console.log("Submitting Profile Data:", profileData);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    setIsSubmitting(false);
    setMessage('✅ Profile saved successfully! (Mock API Call)');
    // In a real app, update the global UserContext here.
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>⚙️ Edit Your Profile Information</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>This information will form the main sections of your public portfolio.</p>

      <form onSubmit={handleSubmit} style={formStyle}>
        
        {/* Input Fields */}
        {Object.keys(profileData).map(key => (
          <div key={key} style={inputGroupStyle}>
            <label style={labelStyle}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
            <input 
              type="text" 
              name={key} 
              value={profileData[key]} 
              onChange={handleChange} 
              placeholder={`Enter your ${key}...`}
              style={inputStyle}
            />
          </div>
        ))}

        <button type="submit" disabled={isSubmitting} style={buttonStyle}>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
        {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}
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