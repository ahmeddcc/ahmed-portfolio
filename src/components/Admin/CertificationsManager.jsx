import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, Award, Calendar, Building, Hash } from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import ConfirmDialog from './ConfirmDialog';

export default function CertificationsManager() {
  const { data, updateData, addToast } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, certId: null, certName: '' });

  const [newCert, setNewCert] = useState({
    name: '', date: '', center: '', certId: '', icon: 'Award'
  });
  const [editCert, setEditCert] = useState({});

  const certifications = data.certifications || [];

  const handleAdd = () => {
    if (!newCert.name.trim() || !newCert.center.trim()) {
      addToast('error', 'Certification name and center are required');
      return;
    }
    const newId = Date.now();
    const updatedCerts = [...certifications, { ...newCert, id: newId }];
    updateData('certifications', updatedCerts);
    addToast('success', 'Certification added successfully', `"${newCert.name}" has been added.`);
    setNewCert({ name: '', date: '', center: '', certId: '', icon: 'Award' });
    setIsAdding(false);
  };

  const handleUpdate = (id) => {
    const updatedCerts = certifications.map(c => c.id === id ? { ...c, ...editCert } : c);
    updateData('certifications', updatedCerts);
    addToast('success', 'Certification updated successfully', `Changes have been saved.`);
    setEditingId(null);
    setEditCert({});
  };

  const openDeleteConfirm = (cert) => {
    setConfirmDelete({ isOpen: true, certId: cert.id, certName: cert.name });
  };

  const closeDeleteConfirm = () => {
    setConfirmDelete({ isOpen: false, certId: null, certName: '' });
  };

  const handleDelete = () => {
    const updatedCerts = certifications.filter(c => c.id !== confirmDelete.certId);
    updateData('certifications', updatedCerts);
    addToast('success', 'Certification deleted', `"${confirmDelete.certName}" has been removed.`);
    closeDeleteConfirm();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Certifications Manager</h2>
            <p className="text-slate-500 text-sm mt-1">Manage your professional certifications and credentials</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-rose-500/20"
          >
            <Plus size={18} />
            {isAdding ? 'Cancel' : 'Add Certification'}
          </button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl border-2 border-rose-100 shadow-lg overflow-hidden"
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2 text-slate-900">
                    <Award size={18} className="text-rose-500" />
                    New Certification
                  </h3>
                  <button onClick={() => setIsAdding(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Certification Name *</label>
                    <input type="text" value={newCert.name}
                      onChange={e => setNewCert({...newCert, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., ICDL" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Issuing Center *</label>
                    <input type="text" value={newCert.center}
                      onChange={e => setNewCert({...newCert, center: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., IT Training Center" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                    <input type="text" value={newCert.date}
                      onChange={e => setNewCert({...newCert, date: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., September 2009" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Certificate ID</label>
                    <input type="text" value={newCert.certId}
                      onChange={e => setNewCert({...newCert, certId: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., egy000272989" />
                  </div>
                </div>

                <button onClick={handleAdd} disabled={!newCert.name || !newCert.center}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                  <Save size={16} /> Save Certification
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certifications List */}
        <div className="space-y-4">
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {editingId === cert.id ? (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">Edit Certification</h3>
                    <button onClick={() => { setEditingId(null); setEditCert({}); }}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                      <input type="text" value={editCert.name ?? cert.name}
                        onChange={e => setEditCert({...editCert, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Center</label>
                      <input type="text" value={editCert.center ?? cert.center}
                        onChange={e => setEditCert({...editCert, center: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                      <input type="text" value={editCert.date ?? cert.date}
                        onChange={e => setEditCert({...editCert, date: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Certificate ID</label>
                      <input type="text" value={editCert.certId ?? cert.certId}
                        onChange={e => setEditCert({...editCert, certId: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(cert.id)}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-green-500/20 flex items-center gap-2">
                      <Save size={16} /> Save Changes
                    </button>
                    <button onClick={() => { setEditingId(null); setEditCert({}); }}
                      className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center shrink-0 border-2 border-rose-100">
                      <Award size={28} className="text-rose-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-lg text-slate-900">{cert.name}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5"><Building size={14} /> {cert.center}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {cert.date}</span>
                            <span className="flex items-center gap-1.5"><Hash size={14} /> ID: {cert.certId}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => { setEditingId(cert.id); setEditCert({}); }}
                            className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => openDeleteConfirm(cert)}
                            className="p-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {certifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-slate-200"
          >
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <Award size={40} className="text-rose-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Certifications Yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">Add your professional certifications, licenses, and credentials to showcase your expertise.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-rose-500/20"
            >
              Add Your First Certification
            </button>
          </motion.div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Certification"
        message="Are you sure you want to delete this certification? This action cannot be undone."
        itemName={confirmDelete.certName}
      />
    </>
  );
}
