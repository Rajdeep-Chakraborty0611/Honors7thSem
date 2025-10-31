import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// --- 1. User Profile Functions ---

/**
 * Ensures a user document exists in Firestore upon first login (Google Auth).
 * This is called immediately after a successful sign-in.
 * @param {object} user - The Firebase User object (from result.user)
 */
export const ensureUserProfileExists = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // If the user is new, create a default profile document
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      username: user.displayName.toLowerCase().replace(/\s/g, ''), // Default username from name
      name: user.displayName,
      title: 'Aspiring Developer',
      bio: `Hello! I'm ${user.displayName}, and this is my portfolio.`,
      github: '',
      linkedin: '',
      createdAt: new Date(),
    });
  }
  // Return the fetched or newly created profile data
  return (await getDoc(userRef)).data();
};

/**
 * Fetches the specific user's profile data.
 * @param {string} uid - The Firebase User ID (user.uid)
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
};

/**
 * Updates the user's profile data.
 * @param {string} uid - The Firebase User ID
 * @param {object} profileData - The data to update
 */
export const updateProfile = async (uid, profileData) => {
  if (!uid) throw new Error("User ID is required for updating profile.");
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, profileData);
};


// --- 2. Project Management Functions ---

const projectsCollection = collection(db, 'projects');

/**
 * Fetches all projects for the current user.
 * @param {string} uid - The Firebase User ID
 */
export const getProjects = async (uid) => {
  if (!uid) return [];
  const q = query(projectsCollection, where('userId', '==', uid));
  const querySnapshot = await getDocs(q);
  
  const projects = [];
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() });
  });
  return projects;
};

/**
 * Adds a new project.
 * @param {string} uid - The Firebase User ID
 * @param {object} projectData - The project details
 */
export const addProject = async (uid, projectData) => {
  const newProject = {
    ...projectData,
    userId: uid, // Link the project to the user
    createdAt: new Date(),
  };
  const docRef = await addDoc(projectsCollection, newProject);
  return { id: docRef.id, ...newProject };
};

/**
 * Updates an existing project.
 * @param {string} projectId - The Firestore document ID of the project
 * @param {object} projectData - The data to update
 */
export const updateProject = async (projectId, projectData) => {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, projectData);
};

/**
 * Deletes a project.
 * @param {string} projectId - The Firestore document ID of the project
 */
export const deleteProject = async (projectId) => {
  const projectRef = doc(db, 'projects', projectId);
  await deleteDoc(projectRef);
};