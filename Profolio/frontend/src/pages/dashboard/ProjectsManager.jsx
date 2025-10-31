import React, { useState } from 'react';

// Mock initial project data
const initialProjects = [
  { id: 1, title: 'Portfolio Builder App', description: 'A platform for developers to generate their portfolio.', github: 'https://github.com/user/portfolio-builder', demo: 'https://live.app' },
  { id: 2, title: 'E-commerce API', description: 'Backend service for an online store using Node.js.', github: 'https://github.com/user/ecommerce-api', demo: null },
];

const ProjectsManager = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [newProject, setNewProject] = useState({ title: '', description: '', github: '', demo: '' });
  const [editingId, setEditingId] = useState(null);

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.github) {
      alert('Title and GitHub link are required.');
      return;
    }

    if (editingId) {
      // 💡 Update Logic Placeholder: PUT /api/projects/:id
      setProjects(projects.map(p => p.id === editingId ? { ...newProject, id: editingId } : p));
      setEditingId(null);
    } else {
      // 💡 Create Logic Placeholder: POST /api/projects
      const newId = Date.now(); // Mock ID generation
      setProjects([...projects, { ...newProject, id: newId }]);
    }
    setNewProject({ title: '', description: '', github: '', demo: '' }); // Clear form
  };

  const handleDelete = (id) => {
    // 💡 Delete Logic Placeholder: DELETE /api/projects/:id
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setNewProject(project);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h1>📂 Manage Your Projects</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Add, edit, and link your best work here.</p>

      {/* Project Form (Create/Edit) */}
      <div style={formSectionStyle}>
        <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleCreateOrUpdate} style={projectFormStyle}>
          {['title', 'description', 'github', 'demo'].map(field => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} ${field === 'github' ? 'Repo Link (REQUIRED)' : 'Link/Details'}`}
              value={newProject[field]}
              onChange={(e) => setNewProject({ ...newProject, [field]: e.target.value })}
              style={inputStyle}
            />
          ))}
          <button type="submit" style={buttonStyle}>{editingId ? 'Update Project' : 'Add Project'}</button>
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

const formSectionStyle = { padding: '20px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#e6f7ff' };
const projectFormStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 150px', gap: '10px' };
const projectListStyle = { marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' };
const projectCardStyle = { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const projectActionsStyle = { marginTop: '15px', display: 'flex', gap: '10px' };
const actionButtonStyle = { padding: '8px 12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', fontSize: '14px' };
// Re-using buttonStyle/inputStyle from previous component is also an option

export default ProjectsManager;