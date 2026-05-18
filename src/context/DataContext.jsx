import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import initialData from '../data/initialData';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useLocalStorage('portfolioData', initialData);
  const [isAdmin, setIsAdmin] = useLocalStorage('isAdmin', false);  // ← تغيير هنا!
  const [adminPassword, setAdminPassword] = useLocalStorage('adminPassword', initialData.settings.password);
  const [toasts, setToasts] = useState([]);

  // Toast System
  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type,
      title,
      message: message || title,
    };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  // تحديث أي جزء من البيانات
  const updateData = useCallback((section, newData) => {
    setData(prev => ({
      ...prev,
      [section]: newData
    }));
  }, [setData]);

  // إضافة صفحة جديدة
  const addPage = useCallback((page) => {
    setData(prev => ({
      ...prev,
      pages: [...prev.pages, { ...page, id: Date.now().toString(), order: prev.pages.length + 1 }]
    }));
  }, [setData]);

  // حذف صفحة
  const deletePage = useCallback((pageId) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.filter(p => p.id !== pageId)
    }));
  }, [setData]);

  // تحديث صفحة
  const updatePage = useCallback((pageId, updates) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === pageId ? { ...p, ...updates } : p)
    }));
  }, [setData]);

  // إضافة مشروع
  const addProject = useCallback((project) => {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: Date.now() }]
    }));
  }, [setData]);

  // حذف مشروع
  const deleteProject = useCallback((projectId) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
  }, [setData]);

  // تحديث مشروع
  const updateProject = useCallback((projectId, updates) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, ...updates } : p)
    }));
  }, [setData]);

  // إضافة خبرة
  const addExperience = useCallback((exp) => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { ...exp, id: Date.now() }]
    }));
  }, [setData]);

  // حذف خبرة
  const deleteExperience = useCallback((expId) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== expId)
    }));
  }, [setData]);

  // تحديث خبرة
  const updateExperience = useCallback((expId, updates) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === expId ? { ...e, ...updates } : e)
    }));
  }, [setData]);

  // إضافة تعليم
  const addEducation = useCallback((edu) => {
    setData(prev => ({
      ...prev,
      education: [...(prev.education || []), { ...edu, id: Date.now() }]
    }));
  }, [setData]);

  // حذف تعليم
  const deleteEducation = useCallback((eduId) => {
    setData(prev => ({
      ...prev,
      education: (prev.education || []).filter(e => e.id !== eduId)
    }));
  }, [setData]);

  // تحديث تعليم
  const updateEducation = useCallback((eduId, updates) => {
    setData(prev => ({
      ...prev,
      education: (prev.education || []).map(e => e.id === eduId ? { ...e, ...updates } : e)
    }));
  }, [setData]);

  // إضافة مهارة
  const addSkill = useCallback((category, skill) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...(prev.skills?.[category] || []), { ...skill, id: Date.now() }]
      }
    }));
  }, [setData]);

  // حذف مهارة
  const deleteSkill = useCallback((skillId, category) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: (prev.skills?.[category] || []).filter(s => s.id !== skillId)
      }
    }));
  }, [setData]);

  // تحديث مهارة
  const updateSkill = useCallback((skillId, category, updates) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: (prev.skills?.[category] || []).map(s => s.id === skillId ? { ...s, ...updates } : s)
      }
    }));
  }, [setData]);

  // تحديث الإعدادات
  const updateSettings = useCallback((newSettings) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
    if (newSettings.password) {
      setAdminPassword(newSettings.password);
    }
  }, [setData, setAdminPassword]);

  // تحديث المعلومات الشخصية
  const updatePersonal = useCallback((updates) => {
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, ...updates }
    }));
  }, [setData]);

  // تسجيل الدخول كأدمن
  const loginAdmin = useCallback((password) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, [adminPassword, setIsAdmin]);

  // تسجيل الخروج
  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
  }, [setIsAdmin]);

  const updateCertifications = useCallback((newCerts) => {
    setData(prev => ({
      ...prev,
      certifications: newCerts
    }));
  }, [setData]);

  const value = {
    data,
    isAdmin,
    adminPassword,
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
    updateSettings,
    updatePersonal,
    updateCertifications,
    loginAdmin,
    logoutAdmin
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
