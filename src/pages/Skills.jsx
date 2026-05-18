import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Brain, Bot, FileJson, Layout, Monitor, Database, Cpu, Network, Satellite, 
         UserCheck, MessageCircle, BookOpen, Lightbulb, Zap, Server, Shield } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import AnimatedSection from '../components/UI/AnimatedSection.jsx';

const iconMap = {
  Code, Brain, Bot, FileJson, Layout, Monitor, Database, Cpu, Network, Satellite,
  UserCheck, MessageCircle, BookOpen, Lightbulb, Zap, Server, Shield
};

export default function Skills() {
  const { data } = useData();
  const { skills } = data;
  const [activeTab, setActiveTab] = useState('development');

  const tabs = [
    { id: 'development', label: 'Development', icon: Code },
    { id: 'technical', label: 'Technical', icon: Server },
    { id: 'soft', label: 'Work Style', icon: UserCheck }
  ];

  const currentSkills = skills[activeTab] || [];

  return (
    <div className="pt-24 lg:pt-32">
      <div className="page-container section-padding">
        {/* Header */}
        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 
                           text-sm font-medium mb-4 border border-primary-500/20">
              Expertise
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Skills & <span className="gradient-text">Abilities</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A unique blend of traditional IT expertise and modern AI-powered development
            </p>
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection variant="fadeUp" className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium 
                            transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                      : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 border border-dark-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Skills Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSkills.map((skill, index) => {
              const Icon = iconMap[skill.icon] || Zap;
              return (
                <AnimatedSection key={index} variant="scale" delay={index * 0.08}>
                  <div className="glass-card p-6 group hover:border-primary-500/30 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center
                                    group-hover:bg-primary-500/20 transition-colors">
                        <Icon size={24} className="text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg group-hover:text-primary-400 transition-colors">
                          {skill.name}
                        </h3>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Proficiency</span>
                        <span className="text-primary-400 font-medium">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                          viewport={{ once: true }}
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
                        />
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <AnimatedSection variant="fadeUp" className="mt-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                <Brain size={32} className="text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-400 text-sm">
                Using Claude Sonnet and Google Gemini to build complete, production-ready systems
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Security First</h3>
              <p className="text-gray-400 text-sm">
                Two-step login, brute-force protection, and full audit trails in every system
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Client Focused</h3>
              <p className="text-gray-400 text-sm">
                From first conversation to finished product — real clients, real projects, real impact
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}