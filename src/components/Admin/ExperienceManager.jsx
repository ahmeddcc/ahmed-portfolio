import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit3, Save, X, History, Wrench, Briefcase, Calendar, MapPin,
  Satellite, Database, GraduationCap, Monitor, Code, Server
} from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import ConfirmDialog from './ConfirmDialog';

// 🛠️ Fixed: Icon mapping for dynamic rendering
const iconMap = {
  Wrench,
  Satellite,
  Database,
  GraduationCap,
  Briefcase,
  Monitor,
  Code,
  Server
};

const iconOptions = [
  { value: 'Wrench', label: 'Wrench' },
  { value: 'Satellite', label: 'Satellite' },
  { value: 'Database', label: 'Database' },
  { value: 'GraduationCap', label: 'GraduationCap' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Code', label: 'Code' },
  { value: 'Server', label: 'Server' }
];

const colorOptions = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'
];

export default function ExperienceManager() {
  const { data, addExperience, deleteExperience, updateExperience, addToast } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, expId: null, expTitle: '' });

  const [newExp, setNewExp] = useState({
    title: '', company: '', location: '', period: '', duration: '',
    description: '', achievements: [], icon: 'Briefcase', color: '#3b82f6'
  });
  const [editExp, setEditExp] = useState({});
  const [newAchievement, setNewAchievement] = useState('');
  const [editAchievement, setEditAchievement] = useState('');

  const handleAdd = () => {
    if (!newExp.title.trim() || !newExp.company.trim()) {
      addToast('error', 'Job Title and Company are required');
      return;
    }
    addExperience(newExp);
    addToast('success', 'Experience added successfully', `"${newExp.title}" at ${newExp.company} has been added.`);
    setNewExp({
      title: '', company: '', location: '', period: '', duration: '',
      description: '', achievements: [], icon: 'Briefcase', color: '#3b82f6'
    });
    setIsAdding(false);
  };

  const handleUpdate = (id) => {
    updateExperience(id, editExp);
    addToast('success', 'Experience updated successfully', `Changes have been saved.`);
    setEditingId(null);
    setEditExp({});
  };

  const addAchievement = (isEdit = false) => {
    const text = isEdit ? editAchievement : newAchievement;
    if (!text.trim()) return;
    if (isEdit) {
      setEditExp({
        ...editExp,
        achievements: [...(editExp.achievements || data.experience.find(e => e.id === editingId)?.achievements || []), text.trim()]
      });
      setEditAchievement('');
    } else {
      setNewExp({...newExp, achievements: [...newExp.achievements, text.trim()]});
      setNewAchievement('');
    }
  };

  const removeAchievement = (expId, index, isEdit = false) => {
    if (isEdit) {
      const current = editExp.achievements || data.experience.find(e => e.id === expId)?.achievements || [];
      setEditExp({...editExp, achievements: current.filter((_, i) => i !== index)});
    } else {
      setNewExp({...newExp, achievements: newExp.achievements.filter((_, i) => i !== index)});
    }
  };

  const openDeleteConfirm = (exp) => {
    setConfirmDelete({ isOpen: true, expId: exp.id, expTitle: exp.title });
  };

  const closeDeleteConfirm = () => {
    setConfirmDelete({ isOpen: false, expId: null, expTitle: '' });
  };

  const handleDelete = () => {
    deleteExperience(confirmDelete.expId);
    addToast('success', 'Experience deleted', `"${confirmDelete.expTitle}" has been removed.`);
    closeDeleteConfirm();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Experience Manager</h2>
            <p className="text-slate-500 text-sm mt-1">Add, edit, or remove work experience entries</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            {isAdding ? 'Cancel' : 'Add Experience'}
          </button>
        </div>

        {/* Add Form */}
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
                    <History size={18} className="text-blue-600" />
                    New Experience
                  </h3>
                  <button onClick={() => setIsAdding(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title *</label>
                    <input type="text" value={newExp.title}
                      onChange={e => setNewExp({...newExp, title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., IT Specialist" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company *</label>
                    <input type="text" value={newExp.company}
                      onChange={e => setNewExp({...newExp, company: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Company name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                    <input type="text" value={newExp.location}
                      onChange={e => setNewExp({...newExp, location: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City, Country" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Period</label>
                    <input type="text" value={newExp.period}
                      onChange={e => setNewExp({...newExp, period: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Jan 2020 - Present" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
                    <input type="text" value={newExp.duration}
                      onChange={e => setNewExp({...newExp, duration: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., 3 years" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon</label>
                    <select value={newExp.icon}
                      onChange={e => setNewExp({...newExp, icon: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map(c => (
                      <button key={c} onClick={() => setNewExp({...newExp, color: c})}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${newExp.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea value={newExp.description} rows={3}
                    onChange={e => setNewExp({...newExp, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Describe your role and responsibilities..." />
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Achievements</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newAchievement}
                      onChange={e => setNewAchievement(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addAchievement()}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Add achievement..." />
                    <button onClick={() => addAchievement()}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newExp.achievements.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {a}
                        <button onClick={() => removeAchievement(null, i)} className="hover:text-red-500"><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <button onClick={handleAdd} disabled={!newExp.title || !newExp.company}
                  className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> Save Experience
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experience List */}
        <div className="space-y-4">
          {data.experience.map((exp) => {
            // 🛠️ Fixed: Dynamic icon rendering
            const IconComponent = iconMap[exp.icon] || Wrench;
            
            return (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {editingId === exp.id ? (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">Edit Experience</h3>
                      <button onClick={() => { setEditingId(null); setEditExp({}); }}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="text" value={editExp.title ?? exp.title}
                        onChange={e => setEditExp({...editExp, title: e.target.value})}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Title" />
                      <input type="text" value={editExp.company ?? exp.company}
                        onChange={e => setEditExp({...editExp, company: e.target.value})}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Company" />
                      <input type="text" value={editExp.location ?? exp.location}
                        onChange={e => setEditExp({...editExp, location: e.target.value})}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Location" />
                      <input type="text" value={editExp.period ?? exp.period}
                        onChange={e => setEditExp({...editExp, period: e.target.value})}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Period" />
                      <input type="text" value={editExp.duration ?? exp.duration}
                        onChange={e => setEditExp({...editExp, duration: e.target.value})}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Duration" />
                      <select value={editExp.icon ?? exp.icon}
                        onChange={e => setEditExp({...editExp, icon: e.target.value})}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                      <div className="flex gap-2 flex-wrap">
                        {colorOptions.map(c => (
                          <button key={c} onClick={() => setEditExp({...editExp, color: c})}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${(editExp.color ?? exp.color) === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>

                    <textarea value={editExp.description ?? exp.description} rows={3}
                      onChange={e => setEditExp({...editExp, description: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />

                    {/* Edit Achievements */}
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={editAchievement}
                          onChange={e => setEditAchievement(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && addAchievement(true)}
                          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Add achievement..." />
                        <button onClick={() => addAchievement(true)}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(editExp.achievements || exp.achievements).map((a, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {a}
                            <button onClick={() => removeAchievement(exp.id, i, true)} className="hover:text-red-500"><X size={14} /></button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(exp.id)}
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                        <Save size={16} /> Save Changes
                      </button>
                      <button onClick={() => { setEditingId(null); setEditExp({}); }}
                        className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: exp.color + '15', color: exp.color, border: `2px solid ${exp.color}30` }}>
                        {/* 🛠️ Fixed: Dynamic icon instead of hardcoded Wrench */}
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-lg text-slate-900">{exp.title}</h4>
                            <p className="text-sm text-slate-500">{exp.company}</p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Calendar size={12} /> {exp.period}</span>
                              <span className="flex items-center gap-1"><History size={12} /> {exp.duration}</span>
                              <span className="flex items-center gap-1"><MapPin size={12} /> {exp.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => { setEditingId(exp.id); setEditExp({}); }}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => openDeleteConfirm(exp)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                            <button onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                              {expandedId === exp.id ? <X size={16} /> : <History size={16} />}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{exp.description}</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === exp.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Key Achievements</h5>
                            <ul className="space-y-1.5">
                              {exp.achievements.map((a, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {data.experience.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <History size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">No experience entries yet. Click "Add Experience" to create one.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Experience"
        message="Are you sure you want to delete this experience entry? This action cannot be undone."
        itemName={confirmDelete.expTitle}
      />
    </>
  );
}
