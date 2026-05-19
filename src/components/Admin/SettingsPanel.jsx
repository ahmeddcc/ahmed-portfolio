import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, Image, Save, CheckCircle, X, Globe, Palette, Shield, User, 
  Mail, Phone, MapPin, Download, Upload, FileJson
} from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';

export default function SettingsPanel() {
  const { 
    data, 
    updateSettings, 
    updatePersonal, 
    exportData, 
    importData,
    addToast 
  } = useData();
  
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState(null);
  
  // 🛠️ Fixed: Check both settings.profileImage and personal.image for fallback
  const currentImage = data.personal?.image || data.settings?.profileImage || '';
  const [imagePreview, setImagePreview] = useState(currentImage);
  const [imageStatus, setImageStatus] = useState(null);
  
  const [personalData, setPersonalData] = useState(data.personal || {});
  const [personalStatus, setPersonalStatus] = useState(null);
  
  const [importStatus, setImportStatus] = useState(null);
  
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);

  const handlePasswordChange = () => {
    // 🛠️ Fixed: Compare against data.settings.password (unified source of truth)
    const currentPassword = data.settings?.password || 'admin';
    
    if (passwordData.current !== currentPassword) {
      setPasswordStatus({ type: 'error', message: 'Current password is incorrect' });
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    if (passwordData.new.length < 4) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 4 characters' });
      return;
    }
    
    // 🛠️ Fixed: Only updateSettings — DataContext handles the rest
    updateSettings({ password: passwordData.new });
    setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
    setPasswordData({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordStatus(null), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setImageStatus({ type: 'error', message: 'Image must be less than 2MB' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      setImagePreview(result);
      // 🛠️ Fixed: Update both settings and personal image fields
      updateSettings({ profileImage: result });
      updatePersonal({ image: result });
      setImageStatus({ type: 'success', message: 'Image uploaded successfully!' });
      setTimeout(() => setImageStatus(null), 3000);
    };
    reader.onerror = () => {
      setImageStatus({ type: 'error', message: 'Failed to read image file' });
    };
    reader.readAsDataURL(file);
  };

  const handlePersonalUpdate = () => {
    updatePersonal(personalData);
    setPersonalStatus({ type: 'success', message: 'Personal information updated!' });
    setTimeout(() => setPersonalStatus(null), 3000);
  };

  // 🛠️ Fixed: Import handler using DataContext importData
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importData(event.target.result);
      if (success) {
        setImportStatus({ type: 'success', message: 'Data imported successfully!' });
        // Refresh local preview state
        setImagePreview(data.personal?.image || data.settings?.profileImage || '');
        setPersonalData(data.personal || {});
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'Failed to read import file' });
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your portfolio settings, profile, and security</p>
      </div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Personal Information</h3>
              <p className="text-sm text-slate-500">Update your profile details</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={personalData.name || ''}
                  onChange={e => setPersonalData({...personalData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
              <input
                type="text"
                value={personalData.title || ''}
                onChange={e => setPersonalData({...personalData, title: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={personalData.email || ''}
                  onChange={e => setPersonalData({...personalData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={personalData.phone || ''}
                  onChange={e => setPersonalData({...personalData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={personalData.location || ''}
                  onChange={e => setPersonalData({...personalData, location: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {personalStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl ${
                personalStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {personalStatus.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
              {personalStatus.message}
            </motion.div>
          )}

          <button
            onClick={handlePersonalUpdate}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Save size={16} />
            Save Personal Info
          </button>
        </div>
      </motion.div>

      {/* Profile Image */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Image size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Profile Image</h3>
              <p className="text-sm text-slate-500">Upload a new profile picture</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg bg-slate-100 flex items-center justify-center">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full items-center justify-center bg-slate-100 ${imagePreview ? 'hidden' : 'flex'}`}
                >
                  <User size={48} className="text-slate-400" />
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <Image size={14} />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20 inline-flex items-center gap-2"
              >
                <Image size={16} />
                Choose New Image
              </button>
              <p className="text-xs text-slate-500 mt-2">
                Supported formats: JPG, PNG, GIF. Max size: 2MB.
              </p>

              {imageStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl ${
                    imageStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {imageStatus.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
                  {imageStatus.message}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Lock size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Security</h3>
              <p className="text-sm text-slate-500">Update your admin password</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
              <input
                type="password"
                value={passwordData.current}
                onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <input
                type="password"
                value={passwordData.new}
                onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={passwordData.confirm}
                onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {passwordStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl max-w-3xl ${
                passwordStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {passwordStatus.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
              {passwordStatus.message}
            </motion.div>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
          >
            <Lock size={16} />
            Update Password
          </button>
        </div>
      </motion.div>

      {/* 🛠️ Fixed: Data Backup & Restore */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FileJson size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Data Backup</h3>
              <p className="text-sm text-slate-500">Export or import your portfolio data</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={exportData}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20"
            >
              <Download size={18} />
              Export Data (JSON)
            </button>
            
            <button
              onClick={() => importInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
            >
              <Upload size={18} />
              Import Data (JSON)
            </button>
            
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
          
          <p className="text-xs text-slate-500 mt-3">
            Export creates a backup of all your portfolio data. Import restores data from a previously exported JSON file.
          </p>

          {importStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl ${
                importStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {importStatus.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
              {importStatus.message}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Site Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Globe size={20} className="text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Site Overview</h3>
              <p className="text-sm text-slate-500">Portfolio statistics and details</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-blue-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Site Title</span>
              </div>
              <p className="font-semibold text-slate-900">{data.settings?.siteTitle || 'Portfolio'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Palette size={16} className="text-purple-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Theme</span>
              </div>
              <p className="font-semibold text-slate-900 capitalize">{data.settings?.theme || 'default'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-green-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Security</span>
              </div>
              <p className="font-semibold text-slate-900">Password Protected</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-indigo-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Total Pages</span>
              </div>
              <p className="font-semibold text-slate-900">{data.pages?.length || 0}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Image size={16} className="text-amber-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Projects</span>
              </div>
              <p className="font-semibold text-slate-900">{data.projects?.length || 0}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-rose-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Experience</span>
              </div>
              <p className="font-semibold text-slate-900">{data.experience?.length || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
