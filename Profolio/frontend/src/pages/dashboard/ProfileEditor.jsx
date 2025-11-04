import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
// CRITICAL: Ensure uploadFile is imported
import { updateProfile, uploadFile } from '../../services/firestoreService'; 
import styles from './ProfileEditor.module.css';

const emptyExperience = { company: '', title: '', duration: '', description: '' };
const emptyEducation = { institution: '', degree: '', field: '', period: '' };

const ProfileEditor = () => {
  const { currentUser, userProfile, updateContextProfile } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState(emptyEducation);
  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState(emptyExperience);
  
  const [profileImageFile, setProfileImageFile] = useState(null); 
  const [bannerImageFile, setBannerImageFile] = useState(null); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Load data from context (Firestore)
  useEffect(() => {
    if (userProfile) {
      // Set simple fields
      const { skills, education, experience, ...basicFields } = userProfile;
      setProfileData({ 
        ...basicFields,
        username: basicFields.username || currentUser.email.split('@')[0],
      });
      // Set array states
      setSkills(skills || []);
      setEducation(education || []);
      setExperience(experience || []);
    }
  }, [userProfile, currentUser]);

  // --- Handlers for Basic Fields ---
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

    // --- Handlers for File Inputs ---
    const handleFileChange = (e, setter) => {
        if (e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

  // --- Handlers for Skills (Tags) ---
  const handleAddSkill = (e) => {
        if (e && e.preventDefault) e.preventDefault(); 
        const skill = newSkill.trim();
        if (skill && !skills.includes(skill)) {
            setSkills(prev => [...prev, skill]);
            setNewSkill('');
        }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };
  
  // --- Handlers for Dynamic Arrays (Education/Experience) ---
  const handleArrayChange = (setter, item, e) => {
      const { name, value } = e.target;
      setter(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddArrayItem = (listSetter, newItem, emptyItem, e) => {
      e.preventDefault();
      if (Object.values(newItem).some(x => x && x.toString().trim() !== "")) {
          listSetter(prev => [...prev, newItem]);
          if (listSetter === setEducation) setNewEducation(emptyEducation);
          if (listSetter === setExperience) setNewExperience(emptyExperience);
      } else {
            alert("Please fill out at least one field before adding this item.");
        }
  };

  const handleRemoveArrayItem = (listSetter, list, index) => {
      listSetter(list.filter((_, i) => i !== index));
  };

  // --- Submission (Main Form) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Saving profile data...');
    
    if (!currentUser) {
        setMessage('❌ Error: Not logged in.');
        setIsSubmitting(false);
        return;
    }

    let updatedProfileData = { ...profileData };

    // 1. UPLOAD IMAGES AND GET URLS
    try {
        if (profileImageFile) {
            setMessage('Uploading profile picture...');
            // CRITICAL: Call actual upload function and save the URL
            const url = await uploadFile(profileImageFile, currentUser.uid, 'profile'); 
            updatedProfileData.profilePicUrl = url;
            setProfileImageFile(null); // Clear file state
        }
        if (bannerImageFile) {
            setMessage('Uploading banner image...');
            // CRITICAL: Call actual upload function and save the URL
            const url = await uploadFile(bannerImageFile, currentUser.uid, 'banner');
            updatedProfileData.bannerUrl = url;
            setBannerImageFile(null); // Clear file state
        }
    } catch (uploadError) {
        console.error("Image Upload Error:", uploadError);
        setMessage(`❌ Image upload failed: ${uploadError.message}. Please check Firebase Storage rules.`);
        setIsSubmitting(false);
        return;
    }
    
    // 2. Merge all nested data and new URLs
    const finalProfileData = {
        ...updatedProfileData, // Contains the new profilePicUrl and bannerUrl
        skills,
        education,
        experience,
    };

    try {
        // 3. Save merged data to Firestore
        await updateProfile(currentUser.uid, finalProfileData);
        
        // 4. Update the global context (triggers public view refresh)
        updateContextProfile(finalProfileData);
        
        setMessage('✅ Profile and images saved successfully! Refresh public view to see changes.');
    } catch (dbError) {
        console.error("Error saving profile data:", dbError);
        setMessage(`❌ Database save failed: ${dbError.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (!userProfile) return <h1 className={styles.message}>Loading Profile...</h1>;

  return (
    <div className={styles.editorContainer}>
      <h1 className={styles.title}>Edit Your Profile</h1>
      <p className={styles.subtitle}>
        Provide the details that will be displayed on your public portfolio.
      </p>

      {/* MAIN FORM START */}
      <form onSubmit={handleSubmit}>
        
        {/* ========================================================= */}
        {/* SECTION 0: IMAGE UPLOADS */}
        {/* ========================================================= */}
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Image Uploads</h3>
            <div className={styles.profileForm}>
                
                {/* Profile Picture */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Profile Picture (Square):</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, setProfileImageFile)} 
                        className={styles.formInput} 
                    />
                    <small className={styles.subtitle} style={{marginTop: '5px'}}>
                        Current: {profileData.profilePicUrl ? 'Uploaded' : 'Default'}
                    </small>
                </div>
                
                {/* Banner Image */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Banner Image (Wide):</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, setBannerImageFile)} 
                        className={styles.formInput} 
                    />
                    <small className={styles.subtitle} style={{marginTop: '5px'}}>
                        Current: {profileData.bannerUrl ? 'Uploaded' : 'Default'}
                    </small>
                </div>
            </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: BASIC & CONTACT INFO (Simple Fields) */}
        {/* ========================================================= */}
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Basic & Contact Information</h3>
            <div className={styles.profileForm}>
                {/* Name, Title, Tagline, Location */}
                {['name', 'title', 'tagline', 'location'].map(key => (
                    <div key={key} className={styles.formGroup}>
                        <label htmlFor={key} className={styles.formLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input type="text" id={key} name={key} value={profileData[key] || ''} onChange={handleBasicChange} className={styles.formInput} />
                    </div>
                ))}
                
                {/* Username (Read Only) and Phone */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Username (Public URL):</label>
                    <input type="text" value={profileData.username || ''} className={styles.formInput} readOnly placeholder="Cannot be changed" />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.formLabel}>Phone Number:</label>
                    <input type="tel" id="phone" name="phone" value={profileData.phone || ''} onChange={handleBasicChange} className={styles.formInput} />
                </div>
                
                {/* Bio (Full Width) */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="bio" className={styles.formLabel}>Professional Bio:</label>
                    <textarea id="bio" name="bio" value={profileData.bio || ''} onChange={handleBasicChange} className={styles.formTextarea} />
                </div>

                {/* Social Links (GitHub, LinkedIn, Twitter) */}
                {['github', 'linkedin', 'twitter'].map(key => (
                    <div key={key} className={styles.formGroup}>
                        <label htmlFor={key} className={styles.formLabel}>{key.charAt(0).toUpperCase() + key.slice(1)} URL:</label>
                        <input type="url" id={key} name={key} value={profileData[key] || ''} onChange={handleBasicChange} className={styles.formInput} />
                    </div>
                ))}
            </div>
        </div>
        
        {/* ========================================================= */}
        {/* SECTION 2: SKILLS (Tag Input) */}
        {/* ========================================================= */}
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Skills (Languages, Frameworks)</h3>
            
            <div className={styles.tagList}>
                {skills.map((skill, index) => (
                    <span key={index} className={styles.tag}>
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className={styles.tagButton}>
                            &times;
                        </button>
                    </span>
                ))}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }} 
                    onKeyDown={(e) => { 
                        if (e.key === 'Enter') handleAddSkill(e); 
                    }}> 
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill (e.g., Python, Figma)"
                    className={styles.formInput}
                    style={{ flexGrow: 1 }}
                />
                <button 
                    type="button" 
                    onClick={handleAddSkill} 
                    className={styles.addArrayButton} 
                    style={{ width: '100px' }}
                >
                    Add
                </button>
            </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: WORK EXPERIENCE (Dynamic Array) */}
        {/* ========================================================= */}
        <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Work Experience</h3>
                
                {experience.map((exp, index) => (
                    <div key={index} className={styles.arrayItemCard}>
                        <h4>{exp.title} at {exp.company} ({exp.duration})</h4>
                        <p className={styles.cardDescription}>{exp.description}</p>
                        <div className={styles.arrayItemControls}>
                            <button type="button" onClick={() => handleRemoveArrayItem(setExperience, experience, index)} className={styles.removeArrayButton}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                <h4 style={{ color: 'var(--color-text-light)', marginTop: '20px' }}>Add New Position</h4>
                
                {/* START OF THE CORRECTED INPUT BLOCK */}
                <div className={styles.arrayFormGrid}>
                    
                    {/* Input 1: Company */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Company:</label>
                        <input type="text" name="company" placeholder="Company Name" value={newExperience.company} 
                            onChange={(e) => handleArrayChange(setNewExperience, newExperience, e)} 
                            className={styles.formInput} />
                    </div>

                    {/* Input 2: Title */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Title/Role:</label>
                        <input type="text" name="title" placeholder="Software Engineer" value={newExperience.title} 
                            onChange={(e) => handleArrayChange(setNewExperience, newExperience, e)} 
                            className={styles.formInput} />
                    </div>

                    {/* Input 3: Duration */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Duration (e.g., 2020 - Present):</label>
                        <input type="text" name="duration" placeholder="2020 - Present" value={newExperience.duration} 
                            onChange={(e) => handleArrayChange(setNewExperience, newExperience, e)} 
                            className={styles.formInput} />
                    </div>
                    
                    {/* Input 4: Description (Full Width) */}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.formLabel}>Description/Key Achievements:</label>
                        <textarea name="description" placeholder="Briefly describe your role and achievements" value={newExperience.description} 
                            onChange={(e) => handleArrayChange(setNewExperience, newExperience, e)} 
                            className={styles.formTextarea} style={{ minHeight: '80px' }} />
                    </div>
                    
                    <button type="button" onClick={(e) => handleAddArrayItem(setExperience, newExperience, emptyExperience, e)} className={styles.addArrayButton}>
                        Add Experience
                    </button>
                </div>
                {/* END OF THE CORRECTED INPUT BLOCK */}
            </div>

        {/* ========================================================= */}
        {/* SECTION 4: EDUCATION (Dynamic Array) */}
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Education</h3>
            
            {education.map((edu, index) => (
                <div key={index} className={styles.arrayItemCard}>
                    <h4>{edu.degree} in {edu.field} from {edu.institution} ({edu.period})</h4>
                    <div className={styles.arrayItemControls}>
                        <button type="button" onClick={() => handleRemoveArrayItem(setEducation, education, index)} className={styles.removeArrayButton}>
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            
            <h4 style={{ color: 'var(--color-text-light)', marginTop: '20px' }}>Add New Degree/Certification</h4>
            
            {/* START OF THE CORRECTED INPUT BLOCK */}
            <div className={styles.arrayFormGrid}>
                
                {/* Input 1: Institution */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Institution:</label>
                    <input type="text" name="institution" placeholder="University Name" value={newEducation.institution} 
                        onChange={(e) => handleArrayChange(setNewEducation, newEducation, e)} 
                        className={styles.formInput} />
                </div>
                
                {/* Input 2: Degree */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Degree/Certificate:</label>
                    <input type="text" name="degree" placeholder="B.Tech, M.S., etc." value={newEducation.degree} 
                        onChange={(e) => handleArrayChange(setNewEducation, newEducation, e)} 
                        className={styles.formInput} />
                </div>
                
                {/* Input 3: Field */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Field of Study:</label>
                    <input type="text" name="field" placeholder="Computer Science" value={newEducation.field} 
                        onChange={(e) => handleArrayChange(setNewEducation, newEducation, e)} 
                        className={styles.formInput} />
                </div>
                
                {/* Input 4: Period */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Period (e.g., 2018 - 2022):</label>
                    <input type="text" name="period" placeholder="2018 - 2022" value={newEducation.period} 
                        onChange={(e) => handleArrayChange(setNewEducation, newEducation, e)} 
                        className={styles.formInput} />
                </div>

                <button type="button" onClick={(e) => handleAddArrayItem(setEducation, newEducation, emptyEducation, e)} className={styles.addArrayButton}>
                    Add Education
                </button>
            </div>
        </div>


        {/* ========================================================= */}
        {/* FINAL SAVE BUTTON */}
        {/* ========================================================= */}
        <div className={styles.saveButtonContainer}>
            <button 
                type="submit" 
                disabled={isSubmitting} 
                className={styles.saveButton}
            >
              {isSubmitting ? 'Saving All Changes...' : 'Save All Profile Information'}
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