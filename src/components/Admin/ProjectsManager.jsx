import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit3, Save, X, Briefcase, ChevronDown, ChevronUp, 
  Link, Image, ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import ConfirmDialog from './ConfirmDialog';

// 🎨 Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const expandVariants = {
  hidden: { 
    opacity: 0, 
    height: 0,
    scaleY: 0.95,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  },
  show: { 
    opacity: 1, 
    height: "auto",
    scaleY: 1,
    transition: { 
      duration: 0.35, 
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    scaleY: 0.95,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }
  }
};

const innerContentVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const formVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  show: { 
    opacity: 1, 
    height: "auto",
    marginBottom: 24,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
  }
};

export default function ProjectsManager() {
  const { data, addProject, deleteProject, updateProject, addToast } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, projectId: null, projectTitle: '' });

  const [newProject, setNewProject] = useState({
    title: '', subtitle: '', type: 'Personal Project', tech: '', status: 'In Development',
    period: '', description: '', features: [], color: '#3b82f6', liveUrl: '', image: ''
  });
  const [editProject, setEditProject] = useState({});
  const [newFeature, setNewFeature] = useState('');
  const [editFeature, setEditFeature] = useState('');
  
  const newImageRef = useRef(null);
  const editImageRef = useRef(null);

  const handleAdd = () => {
    if (!newProject.title.trim()) {
      addToast('error', 'Project title is required');
      return;
    }
    addProject(newProject);
    addToast('success', 'Project added successfully', `"${newProject.title}" has been added.`);
    setNewProject({
      title: '', subtitle: '', type: 'Personal Project', tech: '', status: 'In Development',
      period: '', description: '', features: [], color: '#3b82f6', liveUrl: '', image: ''
    });
    setIsAdding(false);
  };

  const handleUpdate = (id) => {
    updateProject(id, editProject);
    addToast('success', 'Project updated successfully', `Changes have been saved.`);
    setEditingId(null);
    setEditProject({});
  };

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('error', 'Image too large', 'Max size is 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      if (isEdit) {
        setEditProject({ ...editProject, image: result });
      } else {
        setNewProject({ ...newProject, image: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const addFeature = (isEdit = false) => {
    const text = isEdit ? editFeature : newFeature;
    if (!text.trim()) return;
    if (isEdit) {
      setEditProject({
        ...editProject, 
        features: [...(editProject.features || data.projects.find(p => p.id === editingId)?.features || []), text.trim()]
      });
      setEditFeature('');
    } else {
      setNewProject({...newProject, features: [...newProject.features, text.trim()]});
      setNewFeature('');
    }
  };

  const removeFeature = (projectId, featureIndex, isEdit = false) => {
    if (isEdit) {
      const currentFeatures = editProject.features || data.projects.find(p => p.id === projectId)?.features || [];
      setEditProject({...editProject, features: currentFeatures.filter((_, i) => i !== featureIndex)});
    } else {
      setNewProject({...newProject, features: newProject.features.filter((_, i) => i !== featureIndex)});
    }
  };

  const openDeleteConfirm = (project) => {
    setConfirmDelete({ isOpen: true, projectId: project.id, projectTitle: project.title });
  };

  const closeDeleteConfirm = () => {
    setConfirmDelete({ isOpen: false, projectId: null, projectTitle: '' });
  };

  const handleDelete = () => {
    deleteProject(confirmDelete.projectId);
    addToast('success', 'Project deleted', `"${confirmDelete.projectTitle}" has been removed.`);
    closeDeleteConfirm();
  };

  const toggleExpand = (projectId) => {
    setExpandedId(expandedId === projectId ? null : projectId);
  };

  const projectTypes = ['Personal Project', 'Client Project', 'Commercial Product', 'Self-Published'];
  const statuses = ['In Development', 'Live', 'On Hold', 'Published', 'Archived'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Projects Manager</h2>
            <p className="text-slate-500 text-sm mt-1">Add, edit, or remove portfolio projects</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            {isAdding ? 'Cancel' : 'Add Project'}
          </motion.button>
        </div>

        {/* Add Project Form — Professional Animation */}
        <AnimatePresence mode="wait">
          {isAdding && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="overflow-hidden"
            >
              <div className="bg-white rounded-xl border-2 border-blue-100 shadow-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2 text-slate-900">
                    <Briefcase size={18} className="text-blue-600" />
                    New Project
                  </h3>
                  <button onClick={() => setIsAdding(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
                    <input type="text" value={newProject.title}
                      onChange={e => setNewProject({...newProject, title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Project name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtitle</label>
                    <input type="text" value={newProject.subtitle}
                      onChange={e => setNewProject({...newProject, subtitle: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Short description" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                    <select value={newProject.type}
                      onChange={e => setNewProject({...newProject, type: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                    <select value={newProject.status}
                      onChange={e => setNewProject({...newProject, status: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tech Stack</label>
                    <input type="text" value={newProject.tech}
                      onChange={e => setNewProject({...newProject, tech: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g., PHP / MySQL" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Period</label>
                    <input type="text" value={newProject.period}
                      onChange={e => setNewProject({...newProject, period: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g., 2025 - 2026" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Live URL</label>
                  <div className="relative">
                    <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="url" 
                      value={newProject.liveUrl}
                      onChange={e => setNewProject({...newProject, liveUrl: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      placeholder="https://example.com" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Image</label>
                  <div className="flex items-center gap-4">
                    {newProject.image && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200"
                      >
                        <img src={newProject.image} alt="Preview" className="w-full h-full object-cover" />
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <input
                        ref={newImageRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        className="hidden"
                      />
                      <button
                        onClick={() => newImageRef.current?.click()}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Image size={16} />
                        {newProject.image ? 'Change Image' : 'Upload Image'}
                      </button>
                      <p className="text-xs text-slate-500 mt-1">Max size: 2MB. JPG, PNG, GIF</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea value={newProject.description} rows={3}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all" placeholder="Project description..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(c => (
                      <motion.button 
                        key={c} 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNewProject({...newProject, color: c})}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${newProject.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} 
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newFeature}
                      onChange={e => setNewFeature(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addFeature()}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Add a feature..." />
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addFeature()}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProject.features.map((f, i) => (
                      <motion.span 
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {f}
                        <button onClick={() => removeFeature(null, i)} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                      </motion.span>
                    ))}
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAdd} 
                  disabled={!newProject.title}
                  className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Save Project
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects List — Staggered Animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {data.projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              layout
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {editingId === project.id ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">Edit Project</h3>
                    <button onClick={() => { setEditingId(null); setEditProject({}); }}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="text" value={editProject.title ?? project.title}
                      onChange={e => setEditProject({...editProject, title: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Title" />
                    <input type="text" value={editProject.subtitle ?? project.subtitle}
                      onChange={e => setEditProject({...editProject, subtitle: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Subtitle" />
                    <select value={editProject.type ?? project.type}
                      onChange={e => setEditProject({...editProject, type: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={editProject.status ?? project.status}
                      onChange={e => setEditProject({...editProject, status: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="text" value={editProject.tech ?? project.tech}
                      onChange={e => setEditProject({...editProject, tech: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Tech Stack" />
                    <input type="text" value={editProject.period ?? project.period}
                      onChange={e => setEditProject({...editProject, period: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Period" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Live URL</label>
                    <div className="relative">
                      <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="url" 
                        value={editProject.liveUrl ?? project.liveUrl ?? ''}
                        onChange={e => setEditProject({...editProject, liveUrl: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        placeholder="https://example.com" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Image</label>
                    <div className="flex items-center gap-4">
                      {(editProject.image ?? project.image) && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                          <img 
                            src={editProject.image ?? project.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          ref={editImageRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="hidden"
                        />
                        <button
                          onClick={() => editImageRef.current?.click()}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Image size={16} />
                          {(editProject.image ?? project.image) ? 'Change Image' : 'Upload Image'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <textarea value={editProject.description ?? project.description} rows={3}
                    onChange={e => setEditProject({...editProject, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all" />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map(c => (
                        <motion.button 
                          key={c} 
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditProject({...editProject, color: c})}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${(editProject.color ?? project.color) === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: c }} 
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2 mb-2">
                      <input type="text" value={editFeature}
                        onChange={e => setEditFeature(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && addFeature(true)}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Add feature..." />
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addFeature(true)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Add
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(editProject.features || project.features).map((f, i) => (
                        <motion.span 
                          key={i}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {f}
                          <button onClick={() => removeFeature(project.id, i, true)} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUpdate(project.id)}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Save size={16} /> Save Changes
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setEditingId(null); setEditProject({}); }}
                      className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {project.image ? (
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200"
                      >
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </motion.div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                        style={{ backgroundColor: project.color }}>
                        {project.title.charAt(0)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg text-slate-900">{project.title}</h4>
                            {project.liveUrl && (
                              <motion.a 
                                whileHover={{ scale: 1.05 }}
                                href={project.liveUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-colors"
                              >
                                <ExternalLink size={10} />
                                Live
                              </motion.a>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{project.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setEditingId(project.id); setEditProject({}); }}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Edit3 size={16} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openDeleteConfirm(project)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleExpand(project.id)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            <motion.div
                              animate={{ rotate: expandedId === project.id ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown size={16} />
                            </motion.div>
                          </motion.button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">{project.type}</span>
                        <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">{project.tech}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                          project.status === 'Live' ? 'bg-green-100 text-green-700' :
                          project.status === 'Published' ? 'bg-purple-100 text-purple-700' :
                          project.status === 'On Hold' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{project.status}</span>
                        <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">{project.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* 🎨 Professional Expand Animation */}
                  <AnimatePresence>
                    {expandedId === project.id && (
                      <motion.div
                        variants={expandVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="overflow-hidden origin-top"
                      >
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          {project.image && (
                            <motion.div 
                              variants={innerContentVariants}
                              className="mb-4 rounded-xl overflow-hidden border border-slate-200"
                            >
                              <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-48 object-cover"
                              />
                            </motion.div>
                          )}
                          
                          <motion.p 
                            variants={innerContentVariants}
                            className="text-sm text-slate-600 mb-3"
                          >
                            {project.description}
                          </motion.p>
                          
                          {project.liveUrl && (
                            <motion.a 
                              variants={innerContentVariants}
                              whileHover={{ scale: 1.02, x: 4 }}
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mb-3 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                            >
                              <ExternalLink size={14} />
                              Visit Live Project
                            </motion.a>
                          )}
                          
                          <motion.div 
                            variants={innerContentVariants}
                            className="flex flex-wrap gap-2"
                          >
                            {project.features.map((f, i) => (
                              <motion.span 
                                key={i}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium"
                              >
                                {f}
                              </motion.span>
                            ))}
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {data.projects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-xl border border-slate-200"
          >
            <Briefcase size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">No projects yet. Click "Add Project" to create one.</p>
          </motion.div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        itemName={confirmDelete.projectTitle}
      />
    </>
  );
}
