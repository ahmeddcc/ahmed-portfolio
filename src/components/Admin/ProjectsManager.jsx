import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, Briefcase, ChevronDown, ChevronUp, Code, Palette } from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import ConfirmDialog from './ConfirmDialog';

export default function ProjectsManager() {
  const { data, addProject, deleteProject, updateProject, addToast } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, projectId: null, projectTitle: '' });

  const [newProject, setNewProject] = useState({
    title: '', subtitle: '', type: 'Personal Project', tech: '', status: 'In Development',
    period: '', description: '', features: [], color: '#3b82f6'
  });
  const [editProject, setEditProject] = useState({});
  const [newFeature, setNewFeature] = useState('');
  const [editFeature, setEditFeature] = useState('');

  const handleAdd = () => {
    if (!newProject.title.trim()) {
      addToast('error', 'Project title is required');
      return;
    }
    addProject(newProject);
    addToast('success', 'Project added successfully', `"${newProject.title}" has been added.`);
    setNewProject({
      title: '', subtitle: '', type: 'Personal Project', tech: '', status: 'In Development',
      period: '', description: '', features: [], color: '#3b82f6'
    });
    setIsAdding(false);
  };

  const handleUpdate = (id) => {
    updateProject(id, editProject);
    addToast('success', 'Project updated successfully', `Changes have been saved.`);
    setEditingId(null);
    setEditProject({});
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
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            {isAdding ? 'Cancel' : 'Add Project'}
          </button>
        </div>

        {/* Add Project Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl border-2 border-blue-100 shadow-lg overflow-hidden"
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2 text-slate-900">
                    <Briefcase size={18} className="text-blue-600" />
                    New Project
                  </h3>
                  <button onClick={() => setIsAdding(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
                    <input type="text" value={newProject.title}
                      onChange={e => setNewProject({...newProject, title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Project name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtitle</label>
                    <input type="text" value={newProject.subtitle}
                      onChange={e => setNewProject({...newProject, subtitle: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Short description" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                    <select value={newProject.type}
                      onChange={e => setNewProject({...newProject, type: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                    <select value={newProject.status}
                      onChange={e => setNewProject({...newProject, status: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tech Stack</label>
                    <input type="text" value={newProject.tech}
                      onChange={e => setNewProject({...newProject, tech: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., PHP / MySQL" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Period</label>
                    <input type="text" value={newProject.period}
                      onChange={e => setNewProject({...newProject, period: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., 2025 - 2026" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea value={newProject.description} rows={3}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Project description..." />
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

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newFeature}
                      onChange={e => setNewFeature(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addFeature()}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> Save Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects List */}
        <div className="space-y-4">
          {data.projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {editingId === project.id ? (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">Edit Project</h3>
                    <button onClick={() => { setEditingId(null); setEditProject({}); }}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="text" value={editProject.title ?? project.title}
                      onChange={e => setEditProject({...editProject, title: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Title" />
                    <input type="text" value={editProject.subtitle ?? project.subtitle}
                      onChange={e => setEditProject({...editProject, subtitle: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Subtitle" />
                    <select value={editProject.type ?? project.type}
                      onChange={e => setEditProject({...editProject, type: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={editProject.status ?? project.status}
                      onChange={e => setEditProject({...editProject, status: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="text" value={editProject.tech ?? project.tech}
                      onChange={e => setEditProject({...editProject, tech: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tech Stack" />
                    <input type="text" value={editProject.period ?? project.period}
                      onChange={e => setEditProject({...editProject, period: e.target.value})}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Period" />
                  </div>
                  <textarea value={editProject.description ?? project.description} rows={3}
                    onChange={e => setEditProject({...editProject, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map(c => (
                        <button key={c} onClick={() => setEditProject({...editProject, color: c})}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${(editProject.color ?? project.color) === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>

                  {/* Edit Features */}
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
                      {(editProject.features || project.features).map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {f}
                          <button onClick={() => removeFeature(project.id, i, true)} className="hover:text-red-500"><X size={14} /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(project.id)}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                      <Save size={16} /> Save Changes
                    </button>
                    <button onClick={() => { setEditingId(null); setEditProject({}); }}
                      className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ backgroundColor: project.color }}>
                      {project.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-lg text-slate-900">{project.title}</h4>
                          <p className="text-sm text-slate-500">{project.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => { setEditingId(project.id); setEditProject({}); }}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => openDeleteConfirm(project)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 size={16} />
                          </button>
                          <button onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                            {expandedId === project.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
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

                  <AnimatePresence>
                    {expandedId === project.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.features.map((f, i) => (
                              <span key={i} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium">{f}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
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
