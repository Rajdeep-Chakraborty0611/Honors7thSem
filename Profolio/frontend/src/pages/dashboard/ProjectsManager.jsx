import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProjects, addProject, updateProject, deleteProject } from '../../services/firestoreService';
import styles from './ProjectsManager.module.css'; // 👈 Import CSS Module

const initialProjectState = { 
  title: '', 
  description: '', 
  github: '', 
  demo: '' 
};

const ProjectsManager = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(initialProjectState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch Projects on Load ---
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
  }, [currentUser]); 

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
        await updateProject(editingId, currentProject);
        setProjects(projects.map(p => 
          p.id === editingId ? { ...currentProject, id: editingId } : p
        ));
      } else {
        const newProjectWithId = await addProject(currentUser.uid, currentProject);
        setProjects([...projects, newProjectWithId]);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Check console for details.");
    } finally {
      setEditingId(null);
      setCurrentProject(initialProjectState); 
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
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

  if (loading) return <h1 className="text-center text-gray-400 p-20">Loading Projects...</h1>;

  return (
    <div className={styles.managerContainer}>
      <h1 className={styles.title}>Manage Your Projects</h1>
      <p className={styles.subtitle}>
        Add, edit, and link your best work here. These projects form the core of your portfolio.
      </p>

      {/* Project Form (Create/Edit) */}
      <div className={styles.formSection}>
        <h3 className={styles.formTitle}>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleCreateOrUpdate} className={styles.projectForm}>
          
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={currentProject.title}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
          <input
            type="url"
            name="github"
            placeholder="GitHub Repo Link (REQUIRED)"
            value={currentProject.github}
            onChange={handleChange}
            required
            className={styles.formInput}
          />

          <textarea
            name="description"
            placeholder="Detailed Project Description"
            value={currentProject.description}
            onChange={handleChange}
            className={styles.formTextarea}
          />

          <input
            type="url"
            name="demo"
            placeholder="Live Demo Link (Optional)"
            value={currentProject.demo}
            onChange={handleChange}
            className={styles.formInput}
          />
          
          <div className={styles.buttonGroup}>
            <button 
                type="submit" 
                className={styles.addButton}
            >
                {editingId ? 'Update Project' : 'Add Project'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                className={styles.cancelButton}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Project List */}
      <h3 className={styles.listTitle}>Your Current Projects ({projects.length})</h3>
      <div className={styles.projectGrid}>
        {projects.length === 0 && !loading ? (
            <p className={styles.subtitle}>No projects added yet. Use the form above to get started!</p>
        ) : (
            projects.map(project => (
            <div key={project.id} className={styles.projectCard}>
                <h4 className={styles.cardName}>{project.title}</h4>
                <p className={styles.cardDescription}>{project.description}</p>
                <div className={styles.actionLinks}>
                <a href={project.github} target="_blank" rel="noopener noreferrer" 
                    className={`${styles.actionLink} ${styles.githubButton}`}
                >
                    GitHub
                </a>
                {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" 
                        className={`${styles.actionLink} ${styles.demoButton}`}
                    >
                        Live Demo
                    </a>
                )}
                <button onClick={() => handleEdit(project)} 
                    className={`${styles.actionButton} ${styles.editButton}`}
                >
                    Edit
                </button>
                <button onClick={() => handleDelete(project.id)} 
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                    Delete
                </button>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;