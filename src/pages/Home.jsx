import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Clock, Users, Code, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import AnimatedSection from '../components/UI/AnimatedSection.jsx';

export default function Home() {
  const { data } = useData();
  const { personal, projects, experience } = data;

  const stats = [
    { icon: Clock, value: "20+", label: "Years Experience" },
    { icon: Briefcase, value: projects.length.toString(), label: "Projects Built" },
    { icon: Users, value: "100+", label: "Happy Clients" },
    { icon: Code, value: "5", label: "Systems Live" }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-dark-900">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] 
                        bg-gradient-to-r from-primary-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 
                            border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                Available for Projects
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Hi, I'm{' '}
                <span className="gradient-text">Ahmed Hamed</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
                {personal.title}
              </p>

              <p className="text-gray-500 leading-relaxed mb-10 max-w-lg">
                {personal.bio.split('.')[0] + '.'}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 
                           text-white font-semibold rounded-xl transition-all duration-200 
                           hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5"
                >
                  View My Work
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-dark-800 hover:bg-dark-700 
                           text-white font-semibold rounded-xl border border-dark-600 
                           transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get In Touch
                </Link>
              </div>
            </motion.div>

            {/* Profile Image */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="relative flex justify-center lg:justify-end"
>
  <div className="relative">
    {/* Decorative rings */}
    <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 
                     rounded-full blur-xl animate-pulse" />
    <div className="absolute -inset-8 border border-primary-500/10 rounded-full" />
    <div className="absolute -inset-12 border border-primary-500/5 rounded-full" />

    {/* Image container - MODIFIED */}
    <div className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 
                rounded-full overflow-hidden border-4 border-dark-800 
                shadow-2xl shadow-primary-500/20 mx-auto">
      <img
        src={personal.image}
        alt={personal.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = 'https://ui-avatars.com/api/?name=Ahmed+Hamed&size=400&background=3b82f6&color=fff';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent" />
    </div>

    {/* Floating badges - adjusted positions for mobile */}
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 px-3 py-1.5 sm:px-4 sm:py-2 
               bg-dark-800 rounded-xl border border-dark-700 
               shadow-xl flex items-center gap-2"
    >
      <Code size={14} className="text-primary-400 sm:w-4 sm:h-4" />
      <span className="text-xs sm:text-sm font-medium">PHP & MySQL</span>
    </motion.div>

    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 px-3 py-1.5 sm:px-4 sm:py-2 
               bg-dark-800 rounded-xl border border-dark-700 
               shadow-xl flex items-center gap-2"
    >
      <Briefcase size={14} className="text-green-400 sm:w-4 sm:h-4" />
      <span className="text-xs sm:text-sm font-medium">20+ Years</span>
    </motion.div>
  </div>
</motion.div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 px-4 py-2 bg-dark-800 rounded-xl border border-dark-700 
                           shadow-xl flex items-center gap-2"
                >
                  <Code size={16} className="text-primary-400" />
                  <span className="text-sm font-medium">PHP & MySQL</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 px-4 py-2 bg-dark-800 rounded-xl border border-dark-700 
                           shadow-xl flex items-center gap-2"
                >
                  <Briefcase size={16} className="text-green-400" />
                  <span className="text-sm font-medium">20+ Years</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-gray-500"
            >
              <span className="text-xs">Scroll Down</span>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-dark-800/50 border-y border-dark-700/30">
        <div className="page-container">
          <AnimatedSection variant="stagger">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <AnimatedSection key={index} variant="scale" delay={index * 0.1}>
                  <div className="glass-card p-6 lg:p-8 text-center hover-lift">
                    <stat.icon size={28} className="mx-auto mb-3 text-primary-400" />
                    <h3 className="text-3xl lg:text-4xl font-bold gradient-text mb-1">{stat.value}</h3>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="section-padding">
        <div className="page-container">
          <AnimatedSection variant="fadeUp">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
                <p className="text-gray-400">Recent work and ongoing projects</p>
              </div>
              <Link to="/projects" 
                    className="hidden sm:flex items-center gap-2 text-primary-400 hover:text-primary-300 
                             font-medium transition-colors">
                View All <ArrowRight size={18} />
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project, index) => (
              <AnimatedSection key={project.id} variant="slideUp" delay={index * 0.1}>
                <Link to="/projects" className="block group">
                  <div className="glass-card overflow-hidden hover-lift h-full">
                    <div className="h-48 bg-gradient-to-br from-dark-700 to-dark-800 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Briefcase size={48} className="text-gray-600" />
                      </div>
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium 
                                    bg-dark-900/80 backdrop-blur-sm border border-dark-700">
                        {project.status}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium px-2 py-1 rounded-md" 
                              style={{ backgroundColor: project.color + '20', color: project.color }}>
                          {project.type}
                        </span>
                        <span className="text-xs text-gray-500">{project.tech}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/projects" className="inline-flex items-center gap-2 text-primary-400 font-medium">
              View All Projects <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="page-container">
          <AnimatedSection variant="scale">
            <div className="glass-card p-8 lg:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10" />
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Let's Work Together</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                  Whether you need a complete business system, a professional website, or IT support — 
                  I bring 20+ years of experience and modern AI-powered development to every project.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 
                           text-white font-semibold rounded-xl transition-all duration-200 
                           hover:shadow-lg hover:shadow-primary-500/25"
                >
                  Start a Conversation <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
