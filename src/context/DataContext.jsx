import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import initialData from '../data/initialData';

const DataContext = createContext();

// Helper: generate random session token
const generateToken = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export function DataProvider({ children }) {
  const [data, setData] = useLocalStorage('portfolioData', initialData);
  
  // 🔒 Security Fix: Store session object instead of plain boolean
  const [adminSession, setAdminSession] = useLocalStorage('adminSession', null);
  const isAdmin = !!adminSession && (Date.now() - adminSession?.timestamp < 24 * 60 * 60 * 1000);
  
  const [toasts, setToasts] = useState([]);
  
  // 🔄 Undo/Redo History
  const [history, setHistory] = useState([initialData]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoing = useRef(false);

  // Push state to history (for undo support)
  const pushHistory = useCallback((newData) => {
    if (isUndoing.current) return;
    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(newData);
      // Keep max 50 states
      if (next.length > 50) next.shift();
      return next;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // 🍞 Toast System — Fixed: No setTimeout here, Toast.jsx handles auto-remove
  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type,
      title,
      message: message || title,
      duration,
    };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  // 📊 Core updateData with history tracking
  const updateData = useCallback((section, newData) => {
    setData(prev => {
      const next = { ...prev, [section]: newData };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  // ⬅️ Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoing.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
      setTimeout(() => { isUndoing.current = false; }, 0);
    }
  }, [history, historyIndex, setData]);

  // ➡️ Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoing.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
      setTimeout(() => { isUndoing.current = false; }, 0);
    }
  }, [history, historyIndex, setData]);

  // 📄 Pages CRUD
  const addPage = useCallback((page) => {
    setData(prev => {
      const next = {
        ...prev,
        pages: [...prev.pages, { ...page, id: Date.now().toString(), order: prev.pages.length + 1 }]
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const deletePage = useCallback((pageId) => {
    setData(prev => {
      const next = {
        ...prev,
        pages: prev.pages.filter(p => p.id !== pageId)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const updatePage = useCallback((pageId, updates) => {
    setData(prev => {
      const next = {
        ...prev,
        pages: prev.pages.map(p => p.id === pageId ? { ...p, ...updates } : p)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  // 🚀 Projects CRUD
  const addProject = useCallback((project) => {
    setData(prev => {
      const next = {
        ...prev,
        projects: [...prev.projects, { ...project, id: Date.now() }]
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const deleteProject = useCallback((projectId) => {
    setData(prev => {
      const next = {
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const updateProject = useCallback((projectId, updates) => {
    setData(prev => {
      const next = {
        ...prev,
        projects: prev.projects.map(p => p.id === projectId ? { ...p, ...updates } : p)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  // 💼 Experience CRUD
  const addExperience = useCallback((exp) => {
    setData(prev => {
      const next = {
        ...prev,
        experience: [...prev.experience, { ...exp, id: Date.now() }]
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const deleteExperience = useCallback((expId) => {
    setData(prev => {
      const next = {
        ...prev,
        experience: prev.experience.filter(e => e.id !== expId)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const updateExperience = useCallback((expId, updates) => {
    setData(prev => {
      const next = {
        ...prev,
        experience: prev.experience.map(e => e.id === expId ? { ...e, ...updates } : e)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  // 🎓 Education CRUD
  const addEducation = useCallback((edu) => {
    setData(prev => {
      const next = {
        ...prev,
        education: [...(prev.education || []), { ...edu, id: Date.now() }]
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const deleteEducation = useCallback((eduId) => {
    setData(prev => {
      const next = {
        ...prev,
        education: (prev.education || []).filter(e => e.id !== eduId)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const updateEducation = useCallback((eduId, updates) => {
    setData(prev => {
      const next = {
        ...prev,
        education: (prev.education || []).map(e => e.id === eduId ? { ...e, ...updates } : e)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  // 🛠️ Skills CRUD
  const addSkill = useCallback((category, skill) => {
    setData(prev => {
      const next = {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...(prev.skills?.[category] || []), { ...skill, id: Date.now() }]
        }
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const deleteSkill = useCallback((skillId, category) => {
    setData(prev => {
      const next = {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: (prev.skills?.[category] || []).filter(s => s.id !== skillId)
        }
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const updateSkill = useCallback((skillId, category, updates) => {
    setData(prev => {
      const next = {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: (prev.skills?.[category] || []).map(s => s.id === skillId ? { ...s, ...updates } : s)
        }
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  // 🏆 Certifications CRUD — Fixed: Dedicated functions instead of generic updateData
  const addCertification = useCallback((cert) => {
    setData(prev => {
      const next = {
        ...prev,
        certifications: [...(prev.certifications || []), { ...cert, id: Date.now() }]
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const deleteCertification = useCallback((certId) => {
    setData(prev => {
      const next = {
        ...prev,
        certifications: (prev.certifications || []).filter(c => c.id !== certId)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const updateCertification = useCallback((certId, updates) => {
    setData(prev => {
      const next = {
        ...prev,
        certifications: (prev.certifications || []).map(c => c.id === certId ? { ...c, ...updates } : c)
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  // ⚙️ Settings & Personal
  const updateSettings = useCallback((newSettings) => {
    setData(prev => {
      const next = {
        ...prev,
        settings: { ...prev.settings, ...newSettings }
      };
      pushHistory(next);
      return next;
    });
    // ❌ Removed: setAdminPassword(newSettings.password) — no longer needed!
  }, [pushHistory, setData]);

  const updatePersonal = useCallback((updates) => {
    setData(prev => {
      const next = {
        ...prev,
        personal: { ...prev.personal, ...updates }
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  // 🔐 Admin Login — Fixed: Uses data.settings.password instead of separate adminPassword
  const loginAdmin = useCallback((password) => {
    const currentPassword = data.settings?.password || initialData.settings.password;
    if (password === currentPassword) {
      const session = {
        authenticated: true,
        timestamp: Date.now(),
        token: generateToken(),
      };
      setAdminSession(session);
      return true;
    }
    return false;
  }, [data.settings, setAdminSession]);

  const logoutAdmin = useCallback(() => {
    setAdminSession(null);
  }, [setAdminSession]);

  // 💾 Export / Import
  const exportData = useCallback(() => {
    const exportPayload = {
      ...data,
      _exportedAt: new Date().toISOString(),
      _version: '1.0'
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('success', 'تم التصدير', 'تم تصدير البيانات بنجاح');
  }, [data, addToast]);

  const importData = useCallback((jsonString) => {
    try {
      const imported = JSON.parse(jsonString);
      // Validate basic structure
      if (!imported.personal || !imported.settings) {
        throw new Error('Invalid backup file structure');
      }
      // Remove metadata fields
      const cleanData = { ...imported };
      delete cleanData._exportedAt;
      delete cleanData._version;
      
      setData(cleanData);
      pushHistory(cleanData);
      addToast('success', 'تم الاستيراد', 'تم استيراد البيانات بنجاح');
      return true;
    } catch (err) {
      addToast('error', 'فشل الاستيراد', err.message || 'ملف غير صالح');
      return false;
    }
  }, [setData, pushHistory, addToast]);

  // Backward compatibility: keep updateCertifications for any direct usage
  const updateCertifications = useCallback((newCerts) => {
    setData(prev => {
      const next = { ...prev, certifications: newCerts };
      pushHistory(next);
      return next;
    });
  }, [pushHistory, setData]);

  const value = {
    data,
    isAdmin,
    toasts,
    addToast,
    removeToast,
    updateData,
    addPage,
    deletePage,
    updatePage,
    addProject,
    deleteProject,
    updateProject,
    addExperience,
    deleteExperience,
    updateExperience,
    addEducation,
    deleteEducation,
    updateEducation,
    addSkill,
    deleteSkill,
    updateSkill,
    addCertification,
    deleteCertification,
    updateCertification,
    updateCertifications, // backward compat
    updateSettings,
    updatePersonal,
    loginAdmin,
    logoutAdmin,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    exportData,
    importData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
