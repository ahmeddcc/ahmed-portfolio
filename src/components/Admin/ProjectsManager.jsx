import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit3, Save, X, Briefcase, ChevronRight, ChevronLeft,
  Link, Image, ExternalLink, Layers, Calendar, Code2, Globe
} from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import ConfirmDialog from './ConfirmDialog';

// 🎨 Animation variants — Different style entirely
const slidePanelVariants = {
  hidden: { x: '100%', opacity: 0.5 },
  show: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    x: '100%', 
    opacity: 0.5,
    transition: { type: "spring", stiffness: 400, damping: 35 }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({ 
    opacity: 1, 
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function ProjectsManager() {
  const { data, addProject, deleteProject, updateProject, addToast } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
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
    setSelectedProject(null);
  };

  const projectTypes = ['Personal Project', 'Client Project', 'Commercial Product', 'Self-Published'];
  const statuses = ['In Development', 'Live', 'On Hold', 'Published', 'Archived'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

  return (
    <>
      <div className="space-y-6 relative">
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

        {/* Add Project Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border-2 border-blue-100 shadow-lg p-6 space-y-5"
            >
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
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                      <img src={newProject.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
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
                    <button key={c} onClick={() => setNewProject({...newProject, color: c})}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${newProject.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }} />
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
                  <button onClick={() => addFeature()}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.features.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {f}
                      <button onClick={() => removeFeature(null, i)} className="hover:text-red-500"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <button onClick={handleAdd} disabled={!newProject.title}
                className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Save size={16} /> Save Project
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Grid — Card Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.projects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg cursor-pointer group"
              onClick={() => setSelectedProject(project)}
            >
              {/* Card Image/Header */}
              <div className="h-32 relative overflow-hidden" style={{ backgroundColor: project.color + '15' }}>
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Code2 size={40} style={{ color: project.color }} className="opacity-30" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm ${
                    project.status === 'Live' ? 'bg-green-500/20 text-green-700' :
                    project.status === 'Published' ? 'bg-purple-500/20 text-purple-700' :
                    project.status === 'On Hold' ? 'bg-amber-500/20 text-amber-700' :
                    'bg-blue-500/20 text-blue-700'
                  }`}>{project.status}</span>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{project.title}</h4>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{project.subtitle}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={12} />
                    {project.period}
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                    Details <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {data.projects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Briefcase size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">No projects yet. Click "Add Project" to create one.</p>
          </div>
        )}
      </div>

      {/* 🎨 Slide-in Detail Panel */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            
            {/* Slide Panel */}
            <motion.div
              variants={slidePanelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Panel Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
                <div className="flex items-center gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setEditingId(selectedProject.id); setEditProject({}); }}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 size={16} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); openDeleteConfirm(selectedProject); }}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-6 space-y-6">
                {/* Image */}
                <motion.div 
                  variants={scaleInVariants}
                  initial="hidden"
                  animate="show"
                  className="rounded-2xl overflow-hidden border border-slate-200"
                >
                  {selectedProject.image ? (
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title} 
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-56 flex items-center justify-center"
                      style={{ backgroundColor: selectedProject.color + '15' }}
                    >
                      <Code2 size={64} style={{ color: selectedProject.color }} className="opacity-30" />
                    </div>
                  )}
                </motion.div>

                {/* Title Section */}
                <motion.div custom={0} variants={fadeUpVariants} initial="hidden" animate="show">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedProject.color }}
                    />
                    <span className="text-sm font-medium text-slate-500">{selectedProject.type}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedProject.title}</h2>
                  <p className="text-slate-500">{selectedProject.subtitle}</p>
                </motion.div>

                {/* Meta Info */}
                <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Calendar size={14} />
                      <span className="text-xs font-medium uppercase">Period</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{selectedProject.period}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Layers size={14} />
                      <span className="text-xs font-medium uppercase">Status</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{selectedProject.status}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Code2 size={14} />
                      <span className="text-xs font-medium uppercase">Tech</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{selectedProject.tech}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Palette size={14} />
                      <span className="text-xs font-medium uppercase">Type</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{selectedProject.type}</p>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="show">
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.description}</p>
                </motion.div>

                {/* Live URL */}
                {selectedProject.liveUrl && (
                  <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="show">
                    <a 
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/25"
                    >
                      <Globe size={16} />
                      Visit Live Project
                      <ExternalLink size={14} />
                    </a>
                  </motion.div>
                )}

                {/* Features */}
                <motion.div custom={4} variants={fadeUpVariants} initial="hidden" animate="show">
                  <h3 className="font-semibold text-slate-900 mb-3">Key Features</h3>
                  <div className="space-y-2">
                    {selectedProject.features.map((f, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (i * 0.08) }}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <div 
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: selectedProject.color }}
                        />
                        <span className="text-sm text-slate-700">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Edit Project</h3>
                  <button onClick={() => setEditingId(null)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" value={editProject.title ?? selectedProject.title}
                    onChange={e => setEditProject({...editProject, title: e.target.value})}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Title" />
                  <input type="text" value={editProject.subtitle ?? selectedProject.subtitle}
                    onChange={e => setEditProject({...editProject, subtitle: e.target.value})}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Subtitle" />
                  <select value={editProject.type ?? selectedProject.type}
                    onChange={e => setEditProject({...editProject, type: e.target.value})}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={editProject.status ?? selectedProject.status}
                    onChange={e => setEditProject({...editProject, status: e.target.value})}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="text" value={editProject.tech ?? selectedProject.tech}
                    onChange={e => setEditProject({...editProject, tech: e.target.value})}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tech Stack" />
                  <input type="text" value={editProject.period ?? selectedProject.period}
                    onChange={e => setEditProject({...editProject, period: e.target.value})}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Period" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Live URL</label>
                  <div className="relative">
                    <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="url" 
                      value={editProject.liveUrl ?? selectedProject.liveUrl ?? ''}
                      onChange={e => setEditProject({...editProject, liveUrl: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="https://example.com" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Image</label>
                  <div className="flex items-center gap-4">
                    {(editProject.image ?? selectedProject.image) && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                        <img src={editProject.image ?? selectedProject.image} alt="Preview" className="w-full h-full object-cover" />
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
                        {(editProject.image ?? selectedProject.image) ? 'Change Image' : 'Upload Image'}
                      </button>
                    </div>
                  </div>
                </div>

                <textarea value={editProject.description ?? selectedProject.description} rows={3}
                  onChange={e => setEditProject({...editProject, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(c => (
                      <button key={c} onClick={() => setEditProject({...editProject, color: c})}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${(editProject.color ?? selectedProject.color) === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={editFeature}
                      onChange={e => setEditFeature(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addFeature(true)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Add feature..." />
                    <button onClick={() => addFeature(true)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(editProject.features || selectedProject.features).map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {f}
                        <button onClick={() => removeFeature(selectedProject.id, i, true)} className="hover:text-red-500"><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleUpdate(selectedProject.id)}
                    className="flex-1 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Save size={16} /> Save Changes
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
