import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Plus, Pencil, Trash2, X, Check, School } from 'lucide-react';
import { useData } from '../../context/DataContext';
import ConfirmDialog from './ConfirmDialog';

const colorOptions = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#14b8a6', label: 'Teal' },
];

const initialEducation = {
  degree: '',
  school: '',
  location: '',
  year: '',
  description: '',
  color: '#3b82f6'
};

export default function EducationManager() {
  const { data, addEducation, deleteEducation, updateEducation, addToast } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newEdu, setNewEdu] = useState(initialEducation);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, eduId: null, eduName: '' });

  const educationList = data.education || [];

  const handleAdd = () => {
    if (!newEdu.degree.trim() || !newEdu.school.trim()) {
      addToast('error', 'Degree and School are required');
      return;
    }
    addEducation(newEdu);
    addToast('success', 'Education added successfully', `"${newEdu.degree}" has been added.`);
    setNewEdu(initialEducation);
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!newEdu.degree.trim() || !newEdu.school.trim()) {
      addToast('error', 'Degree and School are required');
      return;
    }
    updateEducation(editingId, newEdu);
    addToast('success', 'Education updated successfully', `"${newEdu.degree}" has been updated.`);
    setEditingId(null);
    setNewEdu(initialEducation);
    setIsAdding(false);
  };

  const startEdit = (edu) => {
    setEditingId(edu.id);
    setNewEdu({ ...edu });
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewEdu(initialEducation);
  };

  const openDeleteConfirm = (edu) => {
    setConfirmDelete({ isOpen: true, eduId: edu.id, eduName: edu.degree });
  };

  const closeDeleteConfirm = () => {
    setConfirmDelete({ isOpen: false, eduId: null, eduName: '' });
  };

  const handleDelete = () => {
    deleteEducation(confirmDelete.eduId);
    addToast('success', 'Education deleted', `"${confirmDelete.eduName}" has been removed.`);
    closeDeleteConfirm();
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Education Manager</h3>
              <p className="text-sm text-slate-500">Add, edit, or remove education entries</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Cancel' : 'Add Education'}
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Degree *</label>
                    <input
                      type="text"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., Bachelor's in Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">School *</label>
                    <input
                      type="text"
                      value={newEdu.school}
                      onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="School or University name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newEdu.location}
                      onChange={(e) => setNewEdu({ ...newEdu, location: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={newEdu.year}
                      onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., 2020 - 2024 or Graduated"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={newEdu.description}
                      onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      rows="3"
                      placeholder="Additional details about your studies..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setNewEdu({ ...newEdu, color: c.value })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            newEdu.color === c.value ? 'border-slate-900 scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={editingId ? handleUpdate : handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    {editingId ? 'Update Education' : 'Add Education'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="divide-y divide-slate-100">
          {educationList.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No education entries yet</p>
              <p className="text-slate-400 text-xs mt-1">Click "Add Education" to create your first entry</p>
            </div>
          ) : (
            educationList.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="p-2 rounded-lg mt-1"
                      style={{ backgroundColor: edu.color + '15', color: edu.color }}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                      <p className="text-sm text-slate-600 mt-0.5">{edu.school}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                        {edu.location && <span>{edu.location}</span>}
                        {edu.year && <span>{edu.year}</span>}
                      </div>
                      {edu.description && (
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(edu)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(edu)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Education Entry"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
        itemName={confirmDelete.eduName}
      />
    </>
  );
}
