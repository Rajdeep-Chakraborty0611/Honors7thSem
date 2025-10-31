import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from '../../services/firestoreService';
import styles from './ProfileEditor.module.css'; // 👈 Import CSS Module

const ProfileEditor = () => {
  const { currentUser, userProfile, updateContextProfile } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userProfile) {
      setProfileData({ 
        ...userProfile,
        username: userProfile.username || currentUser.email.split('@')[0],
      });
    }
  }, [userProfile, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    if (!currentUser) {
        setMessage('❌ Error: Not logged in.');
        setIsSubmitting(false);
        return;
    }

    try {
        await updateProfile(currentUser.uid, profileData);
        updateContextProfile(profileData);
        setMessage('✅ Profile saved successfully!');
    } catch (error) {
        console.error("Error saving profile:", error);
        setMessage(`❌ Error saving profile: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (!userProfile) return <h1 className="text-center text-gray-400 p-20">Loading Profile...</h1>;

  return (
    <div className={styles.editorContainer}>
      <h1 className={styles.title}>Edit Your Profile</h1>
      <p className={styles.subtitle}>
        Provide the details that will be displayed on your public portfolio.
      </p>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        
        {Object.keys(profileData)
            .filter(key => !['uid', 'email', 'createdAt'].includes(key))
            .map(key => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key} className={styles.formLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
            </label>
            {key === 'bio' ? (
                <textarea
                    id={key}
                    name={key} 
                    value={profileData[key] || ''} 
                    onChange={handleChange} 
                    className={styles.formTextarea}
                />
            ) : (
                <input 
                    type="text" 
                    id={key}
                    name={key} 
                    value={profileData[key] || ''} 
                    onChange={handleChange} 
                    className={styles.formInput}
                    // Prevent username editing unless you implement complex logic
                    readOnly={key === 'username'} 
                    placeholder={key === 'username' ? 'Username cannot be changed' : ''}
                />
            )}
          </div>
        ))}

        <div className={styles.saveButtonContainer}>
            <button 
                type="submit" 
                disabled={isSubmitting} 
                className={styles.saveButton}
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
            {message && (
                <p className={`${styles.message} ${message.startsWith('❌') ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;