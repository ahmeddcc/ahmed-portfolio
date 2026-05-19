import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Eye, EyeOff, GripVertical, Save, X, FileText, 
  ArrowUp, ArrowDown, Home, User, Briefcase, History, 
  GraduationCap, Zap, Award, Settings, LayoutDashboard
} from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import ConfirmDialog from './ConfirmDialog';

// 🛠️ Fixed: Icon mapping for pages
const iconMap = {
  FileText,
  Home,
  User,
  Briefcase,
  History,
  GraduationCap,
  Zap,
  Award,
  Settings,
  LayoutDashboard
};

const iconOptions = [
  { value: 'FileText', label: 'Document' },
  { value: 'Home', label: 'Home' },
  { value: 'User', label: 'User' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'History', label: 'History' },
  { value: 'GraduationCap', label: 'Education' },
  { value: 'Zap', label: 'Skills' },
  { value: 'Award', label: 'Certifications' },
  { value: 'Settings', label: 'Settings' },
  { value: 'LayoutDashboard', label: 'Dashboard' }
];

export default function PagesManager() {
  const { data, addPage, deletePage, updatePage, addToast, updateData } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', path: '', icon: 'FileText' });
  const [editingId, setEditingId] = useState(null);
  const [editPage, setEditPage] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, pageId: null, pageTitle: '' });

  const handleAdd = () => {
    if (!newPage.title.trim() || !newPage.path.trim()) {
      addToast('error', 'Page title and path are required');
      return;
    }
    addPage({
      ...newPage,
      visible: true,
      order: data.pages.length + 1
    });
    addToast('success', 'Page added successfully', `"${newPage.title}" has been added.`);
    setNewPage({ title: '', path: '', icon: 'FileText' });
    setIsAdding(false);
  };

  const handleUpdate = (id) => {
    updatePage(id, editPage);
    addToast('success', 'Page updated successfully', `Changes have been saved.`);
    setEditingId(null);
    setEditPage({});
  };

  const toggleVisibility = (page) => {
    updatePage(page.id, { visible: !page.visible });
    addToast(
      page.visible ? 'warning' : 'success',
      page.visible ? 'Page hidden' : 'Page visible',
      `"${page.title}" is now ${page.visible ? 'hidden' : 'visible'}.`
    );
  };

  // 🛠️ Fixed: Real reordering with up/down buttons
  const movePage = (pageId, direction) => {
    const sortedPages = [...data.pages].sort((a, b) => a.order - b.order);
    const index = sortedPages.findIndex(p => p.id === pageId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sortedPages.length) return;
    
    // Swap orders
    const tempOrder = sortedPages[index].order;
    sortedPages[index].order = sortedPages[newIndex].order;
    sortedPages[newIndex].order = tempOrder;
    
    // Update all pages at once via updateData to maintain consistency
    updateData('pages', sortedPages);
    addToast('success', 'Page reordered', `Page moved ${direction}.`);
  };

  const openDeleteConfirm = (page) => {
    setConfirmDelete({ isOpen: true, pageId: page.id, pageTitle: page.title });
  };

  const closeDeleteConfirm = () => {
    setConfirmDelete({ isOpen: false, pageId: null, pageTitle: '' });
  };

  const handleDelete = () => {
    deletePage(confirmDelete.pageId);
    addToast('success', 'Page deleted', `"${confirmDelete.pageTitle}" has been removed.`);
    closeDeleteConfirm();
  };

  const sortedPages = [...data.pages].sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Pages Manager</h2>
            <p className="text-slate-500 text-sm mt-1">Add, remove, reorder, or toggle page visibility</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            <Plus size={18} />
            {isAdding ? 'Cancel' : 'Add Page'}
          </button>
        </div>

        {/* Add New Page Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl border-2 border-blue-100 shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2 text-slate-900">
                    <FileText size={18} className="text-blue-600" />
                    New Page
                  </h3>
                  <button onClick={() => setIsAdding(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Page Title</label>
                    <input
                      type="text"
                      value={newPage.title}
                      onChange={e => setNewPage({...newPage, title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., Services"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">URL Path</label>
                    <input
                      type="text"
                      value={newPage.path}
                      onChange={e => setNewPage({...newPage, path: e.target.value.startsWith('/') ? e.target.value : '/' + e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="/services"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon</label>
                    <select
                      value={newPage.icon}
                      onChange={e => setNewPage({...newPage, icon: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAdd}
                      disabled={!newPage.title || !newPage.path}
                      className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Save Page
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pages List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Page</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Path</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedPages.map((page, index) => {
                  const PageIcon = iconMap[page.icon] || FileText;
                  const isFirst = index === 0;
                  const isLast = index === sortedPages.length - 1;
                  
                  return (
                    <motion.tr
                      key={page.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => movePage(page.id, 'up')}
                            disabled={isFirst}
                            className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:text-slate-300 disabled:hover:bg-transparent transition-colors"
                            title="Move up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <span className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                            {page.order}
                          </span>
                          <button
                            onClick={() => movePage(page.id, 'down')}
                            disabled={isLast}
                            className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:text-slate-300 disabled:hover:bg-transparent transition-colors"
                            title="Move down"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {editingId === page.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editPage.title || page.title}
                              onChange={e => setEditPage({...editPage, title: e.target.value})}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <select
                              value={editPage.icon || page.icon || 'FileText'}
                              onChange={e => setEditPage({...editPage, icon: e.target.value})}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              {iconOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                              <PageIcon size={16} />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{page.title}</p>
                              <p className="text-xs text-slate-500 sm:hidden">{page.path}</p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {editingId === page.id ? (
                          <input
                            type="text"
                            value={editPage.path || page.path}
                            onChange={e => setEditPage({...editPage, path: e.target.value})}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">{page.path}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {editingId === page.id ? (
                            <>
                              <button onClick={() => handleUpdate(page.id)}
                                className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                                <Save size={16} />
                              </button>
                              <button onClick={() => { setEditingId(null); setEditPage({}); }}
                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleVisibility(page)}
                                className={`p-2 rounded-lg transition-colors ${
                                  page.visible ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'
                                }`}
                                title={page.visible ? 'Hide page' : 'Show page'}
                              >
                                {page.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                              <button
                                onClick={() => { setEditingId(page.id); setEditPage({}); }}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit page"
                              >
                                <FileText size={16} />
                              </button>
                              <button
                                onClick={() => openDeleteConfirm(page)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete page"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {data.pages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <FileText size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">No pages yet. Click "Add Page" to create one.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Page"
        message="Are you sure you want to delete this page? This action cannot be undone."
        itemName={confirmDelete.pageTitle}
      />
    </>
  );
}
