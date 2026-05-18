import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Briefcase, History, Settings, LogOut,
  ChevronRight, Menu, X, Award, Shield, User, Bell, Moon, Sun,
  GraduationCap, Zap
} from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import PagesManager from './PagesManager.jsx';
import ProjectsManager from './ProjectsManager.jsx';
import ExperienceManager from './ExperienceManager.jsx';
import EducationManager from './EducationManager.jsx';
import SkillsManager from './SkillsManager.jsx';
import CertificationsManager from './CertificationsManager.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import Toast from './Toast.jsx';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
  { id: 'pages', label: 'Pages', icon: FileText, color: 'from-indigo-500 to-purple-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
  { id: 'projects', label: 'Projects', icon: Briefcase, color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
  { id: 'experience', label: 'Experience', icon: History, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-50', textColor: 'text-cyan-600' },
  { id: 'skills', label: 'Skills', icon: Zap, color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
  { id: 'certifications', label: 'Certifications', icon: Award, color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', textColor: 'text-rose-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'from-slate-500 to-slate-700', bgColor: 'bg-slate-50', textColor: 'text-slate-600' }
];

export default function AdminDashboard() {
  const { isAdmin, logoutAdmin, data, toasts, removeToast } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const totalSkills = (data.skills?.development?.length || 0) + 
                      (data.skills?.technical?.length || 0) + 
                      (data.skills?.soft?.length || 0);

  const stats = [
    { label: 'Total Pages', value: data.pages.length, icon: FileText, color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-600' },
    { label: 'Projects', value: data.projects.length, icon: Briefcase, color: 'bg-amber-500', lightColor: 'bg-amber-50 text-amber-600' },
    { label: 'Experience', value: data.experience.length, icon: History, color: 'bg-emerald-500', lightColor: 'bg-emerald-50 text-emerald-600' },
    { label: 'Education', value: data.education?.length || 0, icon: GraduationCap, color: 'bg-cyan-500', lightColor: 'bg-cyan-50 text-cyan-600' },
    { label: 'Skills', value: totalSkills, icon: Zap, color: 'bg-purple-500', lightColor: 'bg-purple-50 text-purple-600' },
    { label: 'Certifications', value: data.certifications?.length || 0, icon: Award, color: 'bg-rose-500', lightColor: 'bg-rose-50 text-rose-600' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'pages': return <PagesManager />;
      case 'projects': return <ProjectsManager />;
      case 'experience': return <ExperienceManager />;
      case 'education': return <EducationManager />;
      case 'skills': return <SkillsManager />;
      case 'certifications': return <CertificationsManager />;
      case 'settings': return <SettingsPanel />;
      default: return <Overview stats={stats} />;
    }
  };

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-none transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              AH
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Admin Panel</h1>
              <p className="text-xs text-slate-400">Portfolio Manager</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="absolute top-6 right-4 lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-blue-200">
              {data.personal.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 truncate">{data.personal.name}</p>
              <p className="text-xs text-slate-500 truncate">{data.personal.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Menu</p>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-white/20' : tab.bgColor + ' ' + tab.textColor
                }`}>
                  <Icon size={16} />
                </div>
                {tab.label}
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={() => { logoutAdmin(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <Menu size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  {activeTabData && (
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeTabData.color} flex items-center justify-center text-white`}>
                      <activeTabData.icon size={16} />
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab}</h2>
                </div>
                <p className="text-sm text-slate-500 hidden sm:block mt-0.5">Manage your portfolio content</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Online
              </div>
              <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 relative">
                <Bell size={18} className="text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {data.personal.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function Overview({ stats }) {
  const { data } = useData();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Shield size={24} className="text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Admin Dashboard</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome back, {data.personal.name.split(' ')[0]}!</h2>
          <p className="text-slate-400 max-w-xl">Manage your portfolio content, update projects, and customize your site settings all in one place.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.lightColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">+0</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Briefcase size={20} className="text-amber-500" />
              Recent Projects
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {data.projects.slice(0, 3).map(project => (
              <div key={project.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                     style={{ backgroundColor: project.color }}>
                  {project.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{project.title}</p>
                  <p className="text-xs text-slate-500">{project.type}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                  project.status === 'Live' ? 'bg-green-100 text-green-700' :
                  project.status === 'Published' ? 'bg-purple-100 text-purple-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{project.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <GraduationCap size={20} className="text-cyan-500" />
              Education
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {(data.education || []).slice(0, 3).map(edu => (
              <div key={edu.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                     style={{ backgroundColor: edu.color + '20', color: edu.color }}>
                  <GraduationCap size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.school}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium shrink-0">
                  {edu.year}
                </span>
              </div>
            ))}
            {(!data.education || data.education.length === 0) && (
              <div className="p-8 text-center text-slate-400">
                <GraduationCap size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No education entries yet</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Award size={20} className="text-rose-500" />
              Certifications
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {(data.certifications || []).slice(0, 3).map(cert => (
              <div key={cert.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                  <Award size={20} className="text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{cert.name}</p>
                  <p className="text-xs text-slate-500">{cert.date}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium shrink-0">
                  {cert.certId}
                </span>
              </div>
            ))}
            {(!data.certifications || data.certifications.length === 0) && (
              <div className="p-8 text-center text-slate-400">
                <Award size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No certifications yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
