import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db, storage } from '../lib/firebase';
import { Loader2, Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  images: string[];
  createdAt: number;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('External Rendering');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Automatically add user to admins list (Dev environment helper)
        await setDoc(doc(db, 'admins', u.uid), { email: u.email }, { merge: true }).catch(() => {});
        fetchProjects();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProjects = async () => {
    try {
      const qs = await getDocs(collection(db, 'projects'));
      const projs: Project[] = [];
      qs.forEach(doc => {
        projs.push({ id: doc.id, ...doc.data() } as Project);
      });
      // Sort by creation desc
      projs.sort((a, b) => b.createdAt - a.createdAt);
      setProjects(projs);
    } catch (e) {
      console.error(e);
      alert('Failed to load projects. You might not have admin access.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Ensure we use the provider in a way that works best for browser environments
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/popup-blocked') {
        alert('The sign-in popup was blocked by your browser. Please allow popups or open the site in a new window.');
      } else {
        alert('Sign-in failed: ' + (e.message || 'Unknown error'));
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setProjects([]);
  };

  const handleUploadProject = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const files = Array.from(e.target.files) as File[];

    try {
      for (const file of files) {
        const fileRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
        const uploadTask = await uploadBytesResumable(fileRef, file);
        const url = await getDownloadURL(uploadTask.ref);

        const projectData = {
          title: "New Update", // Default title
          category: "External Rendering", // Default category
          thumbnail: url,
          images: [url],
          createdAt: Date.now(),
          ownerId: auth.currentUser!.uid
        };

        await addDoc(collection(db, 'projects'), projectData);
      }
      
      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert('Error uploading one or more photos.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      await fetchProjects();
    } catch (e) {
      console.error(e);
      alert('Error deleting photo');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-sm w-full">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 font-sans">Admin Login</h1>
          <button onClick={handleLogin} className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gallery Manager</h1>
            <p className="text-slate-500 text-sm mt-1">Upload and delete photos from your portfolio</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-full border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Simplified One Area Upload */}
        <div className="relative group">
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleUploadProject}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          />
          <div className={`flex flex-col items-center justify-center p-12 border-3 border-dashed rounded-2xl transition-all duration-300 ${
            uploading 
              ? 'bg-slate-50 border-slate-200' 
              : 'bg-white hover:bg-slate-50 border-slate-200 group-hover:border-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/5'
          }`}>
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900 mt-4">Processing Images...</span>
                <span className="text-sm text-slate-500 mt-1">Please wait while we save your work</span>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Add Photos to Gallery</h2>
                <p className="text-slate-500 mt-2 text-center max-w-xs">
                  Drag and drop your images here, or click to browse files from your device.
                </p>
                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold">
                  <Plus className="w-3 h-3" /> Select Images
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 inline-flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-slate-400"/> 
              Live Portfolio <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-2">{projects.length} Photos</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {projects.map(project => (
              <div key={project.id} className="group relative aspect-square bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <img 
                  src={project.thumbnail} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-300 flex items-center justify-center">
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-3 bg-red-500 text-white rounded-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 shadow-lg"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold">Your gallery is empty</h3>
                <p className="text-slate-500 text-sm mt-1">Upload your first photo using the area above.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
