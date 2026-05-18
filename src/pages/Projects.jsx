import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronRight, X, Plus, Filter } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import AnimatedSection from '../components/UI/AnimatedSection.jsx';

export default function Projects() {
  const { data } = useData();
  const { projects } = data;
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(projects.map(p => p.type))];
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.type === filter);

  return (
    <div className="pt-24 lg:pt-32">
      <div className="page-container section-padding">
        {/* Header */}
        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 
                           text-sm font-medium mb-4 border border-primary-500/20">
              Portfolio
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Projects & <span className="gradient-text">Products</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Real systems built for real clients. From ERP platforms to published books.
            </p>
          </div>
        </AnimatedSection>

        {/* Filter */}
        <AnimatedSection variant="fadeUp" className="mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 border border-dark-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div 
                  onClick={() => setSelectedProject(project)}
                  className="glass-card overflow-hidden cursor-pointer group hover-lift h-full"
                >
                  {/* Project Header */}
                  <div className="h-52 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-800" />
                    <div 
                      className="absolute inset-0 opacity-30 transition-opacity group-hover:opacity-50"
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/10">{project.title.charAt(0)}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-semibold 
                                  bg-dark-900/80 backdrop-blur-sm border border-dark-700">
                      {project.status}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-medium"
                         style={{ backgroundColor: project.color + '30', color: project.color }}>
                      {project.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-500 font-mono">{project.tech}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{project.period}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                    <div className="flex items-center text-primary-400 text-sm font-medium 
                                  group-hover:gap-2 transition-all">
                      View Details <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/90 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="h-48 relative rounded-t-xl overflow-hidden">
                  <div className="absolute inset-0" style={{ backgroundColor: selectedProject.color + '20' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-dark-900/50 text-white 
                             hover:bg-dark-900 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute bottom-6 left-6">
                    <span className="text-xs font-medium px-3 py-1 rounded-md mb-2 inline-block"
                          style={{ backgroundColor: selectedProject.color + '30', color: selectedProject.color }}>
                      {selectedProject.type}
                    </span>
                    <h2 className="text-3xl font-bold">{selectedProject.title}</h2>
                    <p className="text-gray-400">{selectedProject.subtitle}</p>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700">
                      <span className="text-gray-500">Tech:</span>{' '}
                      <span className="text-white">{selectedProject.tech}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700">
                      <span className="text-gray-500">Status:</span>{' '}
                      <span className="text-white">{selectedProject.status}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700">
                      <span className="text-gray-500">Period:</span>{' '}
                      <span className="text-white">{selectedProject.period}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {selectedProject.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedProject.link && selectedProject.link !== '#' && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 
                               text-white font-medium rounded-xl transition-all"
                    >
                      Visit Project <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}