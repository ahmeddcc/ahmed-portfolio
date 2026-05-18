import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronDown, ChevronUp, Wrench, Satellite, Database, GraduationCap, Briefcase, Monitor, Code, Server } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import AnimatedSection from '../components/UI/AnimatedSection.jsx';

const iconMap = {
  Wrench, Satellite, Database, GraduationCap, Briefcase, Monitor, Code, Server
};

export default function Experience() {
  const { data } = useData();
  const { experience } = data;
  const [expandedId, setExpandedId] = useState(null);

  if (!experience || experience.length === 0) {
    return (
      <div className="pt-24 lg:pt-32 min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No experience entries found.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4 border border-primary-500/20">
              Career Path
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Work <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">Experience</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Over two decades of hands-on IT work, from training centers to agricultural investment companies
            </p>
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-primary-500/30 to-transparent" />

            {experience.map((exp, index) => {
              const Icon = iconMap[exp.icon] || Wrench;
              const isEven = index % 2 === 0;
              const isExpanded = expandedId === exp.id;

              return (
                <AnimatedSection 
                  key={exp.id} 
                  variant={isEven ? "slideLeft" : "slideRight"}
                  delay={index * 0.1}
                >
                  <div className={`relative flex items-start gap-6 lg:gap-0 mb-12 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Timeline Dot */}
                    <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 z-10">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-dark-900 shadow-lg"
                        style={{ backgroundColor: exp.color + '20', borderColor: exp.color + '40' }}
                      >
                        <Icon size={20} style={{ color: exp.color }} />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className={`ml-20 lg:ml-0 lg:w-1/2 ${isEven ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                      <div 
                        className="bg-dark-800/60 backdrop-blur-lg border border-dark-700/50 rounded-xl p-6 cursor-pointer hover:border-primary-500/30 transition-all duration-300"
                        onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      >
                        <div className={`flex items-start gap-4 mb-3 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                          <div className="flex-1">
                            <div className={`flex items-center gap-2 mb-1 flex-wrap ${isEven ? 'lg:justify-end' : ''}`}>
                              <Calendar size={14} className="text-primary-500 shrink-0" />
                              <span className="text-sm text-primary-400 font-medium">{exp.period}</span>
                              <span className="text-gray-600">·</span>
                              <span className="text-sm text-gray-500">{exp.duration}</span>
                            </div>
                            <h3 className="text-xl font-bold hover:text-primary-400 transition-colors">
                              {exp.title}
                            </h3>
                            <div className={`flex items-center gap-2 text-gray-400 text-sm mt-1 flex-wrap ${isEven ? 'lg:justify-end' : ''}`}>
                              <MapPin size={14} />
                              <span>{exp.company}</span>
                              <span className="text-gray-600">·</span>
                              <span>{exp.location}</span>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                          {exp.description}
                        </p>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t border-dark-700/50">
                                <h4 className="text-sm font-semibold text-gray-300 mb-3">Key Achievements</h4>
                                <ul className="space-y-2">
                                  {exp.achievements.map((achievement, idx) => (
                                    <li key={idx} className={`flex items-start gap-3 text-sm text-gray-400 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                                      <span>{achievement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}