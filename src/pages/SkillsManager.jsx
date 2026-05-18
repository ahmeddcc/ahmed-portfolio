import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, Pencil, Trash2, X, Check, Brain, Code, Bot, FileJson, Layout, Monitor, Database, Cpu, Network, Satellite, UserCheck, MessageCircle, BookOpen, Lightbulb } from 'lucide-react';
import { useData } from '../../context/DataContext';

const iconMap = {
  Brain, Code, Bot, FileJson, Layout, Monitor, Database, Cpu, Network, Satellite, UserCheck, MessageCircle, BookOpen, Lightbulb, Zap
};

const categoryLabels = {
  development: 'Development',
  technical: 'Technical',
  soft: 'Soft Skills'
};

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

const initialSkill = {
  name: '',
  level: 80,
  icon: 'Zap',
  color: '#3b82f6',
  category: 'development'
};

export default function SkillsManager() {
  const { data, addSkill, deleteSkill, updateSkill } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newSkill, setNewSkill] = useState(initialSkill);
  const [activeCategory, setActiveCategory] = useState('all');

  const skills = data.skills || { development: [], technical: [], soft: [] };

  const getAllSkills = () => {
    return [
      ...(skills.development || []).map(s => ({ ...s, category: 'development' })),
      ...(skills.technical || []).map(s => ({ ...s, category: 'technical' })),
      ...(skills.soft || []).map(s => ({ ...s, category: 'soft' }))
    ];
  };

  const filteredSkills = activeCategory === 'all' ? getAllSkills() : (skills[activeCategory] || []).map(s => ({ ...s, category: activeCategory }));

  const handleAdd = () => {
    if (!newSkill.name.trim()) return;
    addSkill(newSkill.category, newSkill);
    setNewSkill(initialSkill);
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!newSkill.name.trim()) return;
    updateSkill(editingId, newSkill.category, newSkill);
    setEditingId(null);
    setNewSkill(initialSkill);
    setIsAdding(false);
  };

  const startEdit = (skill, category) => {
    setEditingId(skill.id);
    setNewSkill({ ...skill, category });
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewSkill(initialSkill);
  };

  const IconComponent = iconMap[newSkill.icon] || Zap;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Skills Manager</h3>
            <p className="text-sm text-slate-500">Manage technical and soft skills</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Add Skill'}
        </button>
      </div>

      {/* Category Filter */}
      <div className="px-6 py-3 border-b border-slate-100 flex gap-2">
        {['all', 'development', 'technical', 'soft'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Skills' : categoryLabels[cat]}
          </button>
        ))}
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Skill Name *</label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., React, PHP, Communication"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="development">Development</option>
                    <option value="technical">Technical</option>
                    <option value="soft">Soft Skills</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Level: {newSkill.level}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                  <select
                    value={newSkill.icon}
                    onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {Object.keys(iconMap).map(iconName => (
                      <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setNewSkill({ ...newSkill, color: c.value })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          newSkill.color === c.value ? 'border-slate-900 scale-110' : 'border-transparent'
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
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  {editingId ? 'Update Skill' : 'Add Skill'}
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
        {filteredSkills.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No skills in this category yet</p>
          </div>
        ) : (
          filteredSkills.map((skill, index) => {
            const SkillIcon = iconMap[skill.icon] || Zap;
            return (
              <motion.div
                key={`${skill.category}-${skill.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: skill.color + '15', color: skill.color }}
                    >
                      <SkillIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-slate-900">{skill.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                          {categoryLabels[skill.category]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-xs">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500 w-8">{skill.level}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(skill, skill.category)}
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSkill(skill.id, skill.category)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
