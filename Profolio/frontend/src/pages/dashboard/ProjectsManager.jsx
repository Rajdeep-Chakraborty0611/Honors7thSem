import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProjects, addProject, updateProject, deleteProject } from '../../services/firestoreService'; // 👈 Import CRUD functions

const initialProjectState = { 
  title: '', 
  description: '', 
  github: '', // Required field
  demo: '' 
};

const ProjectsManager = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(initialProjectState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Projects on Load ---
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (currentUser?.uid) {
        try {
          setLoading(true);
          const userProjects = await getProjects(currentUser.uid);
          setProjects(userProjects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserProjects();
  }, [currentUser]); // Re-fetch when user object changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!currentProject.title || !currentProject.github) {
      alert('Project Title and GitHub link are required.');
      return;
    }

    try {
      if (editingId) {
        // --- UPDATE LOGIC ---
        await updateProject(editingId, currentProject);
        
        // Update local state
        setProjects(projects.map(p => 
          p.id === editingId ? { ...currentProject, id: editingId } : p
        ));
        console.log(`Project ${editingId} updated.`);

      } else {
        // --- CREATE LOGIC ---
        const newProjectWithId = await addProject(currentUser.uid, currentProject);
        
        // Update local state
        setProjects([...projects, newProjectWithId]);
        console.log(`New project created with ID: ${newProjectWithId.id}`);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Check console for details.");
    } finally {
      // Reset form state
      setEditingId(null);
      setCurrentProject(initialProjectState); 
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      // --- DELETE LOGIC ---
      await deleteProject(projectId);
      
      // Update local state
      setProjects(projects.filter(p => p.id !== projectId));
      console.log(`Project ${projectId} deleted.`);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Check console for details.");
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setCurrentProject(project);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setCurrentProject(initialProjectState);
  };

  if (loading) return <h1 style={{ textAlign: 'center', padding: '100px' }}>Loading Projects...</h1>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h1>📂 Manage Your Projects</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Add, edit, and link your best work here. Changes are saved to Firestore.</p>

      {/* Project Form (Create/Edit) */}
      <div style={formSectionStyle}>
        <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleCreateOrUpdate} style={projectFormStyle}>
          
          {/* Input: Title */}
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={currentProject.title}
            onChange={handleChange}
            style={inputStyle}
          />
          
          {/* Input: Description */}
          <input
            type="text"
            name="description"
            placeholder="Short Description"
            value={currentProject.description}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* Input: GitHub Link */}
          <input
            type="url"
            name="github"
            placeholder="GitHub Repo Link (REQUIRED)"
            value={currentProject.github}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          
          {/* Input: Demo Link */}
          <input
            type="url"
            name="demo"
            placeholder="Live Demo Link (Optional)"
            value={currentProject.demo}
            onChange={handleChange}
            style={inputStyle}
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={buttonStyle}>{editingId ? 'Update' : 'Add'}</button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} style={{...buttonStyle, backgroundColor: '#6c757d'}}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Project List */}
      <h3 style={{ marginTop: '40px' }}>Current Projects ({projects.length})</h3>
      <div style={projectListStyle}>
        {projects.map(project => (
          <div key={project.id} style={projectCardStyle}>
            <h4>{project.title}</h4>
            <p style={{ color: '#666', fontSize: '0.9em' }}>{project.description}</p>
            <div style={projectActionsStyle}>
              <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ ...actionButtonStyle, backgroundColor: '#000' }}>GitHub</a>
              {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" style={actionButtonStyle}>Live Demo</a>}
              <button onClick={() => handleEdit(project)} style={{ ...actionButtonStyle, backgroundColor: '#ffc107' }}>Edit</button>
              <button onClick={() => handleDelete(project.id)} style={{ ...actionButtonStyle, backgroundColor: '#dc3545' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ... (Styling variables from previous step)
const formSectionStyle = { padding: '20px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#e6f7ff' };
const projectFormStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 2fr', gap: '10px' };
const projectListStyle = { marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' };
const projectCardStyle = { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const projectActionsStyle = { marginTop: '15px', display: 'flex', gap: '10px' };
const actionButtonStyle = { padding: '8px 12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', fontSize: '14px' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' };

export default ProjectsManager;