import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, Briefcase, History, Zap, Mail, Menu, X
} from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';

const iconMap = {
  Home, User, Briefcase, History, Zap, Mail
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data } = useData();

  const visiblePages = data.pages.filter(p => p.visible).sort((a, b) => a.order - b.order);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-dark-900/90 backdrop-blur-xl border-b border-dark-700/50 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 
                            flex items-center justify-center text-white font-bold text-lg
                            group-hover:scale-110 transition-transform">
                AH
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg leading-tight group-hover:text-primary-400 transition-colors">
                  Ahmed Hamed
                </h1>
                <p className="text-xs text-gray-400">Portfolio</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {visiblePages.map((page) => {
                const Icon = iconMap[page.icon] || Briefcase;
                return (
                  <Link
                    key={page.id}
                    to={page.path}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive(page.path) 
                        ? 'text-primary-400 bg-primary-500/10' 
                        : 'text-gray-400 hover:text-white hover:bg-dark-800'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={16} />
                      {page.title}
                    </span>
                    {isActive(page.path) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-dark-800 text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-xl 
                     border-b border-dark-700/50 lg:hidden overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {visiblePages.map((page, index) => {
                const Icon = iconMap[page.icon] || Briefcase;
                return (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={page.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                        ${isActive(page.path) 
                          ? 'bg-primary-500/10 text-primary-400' 
                          : 'text-gray-400 hover:text-white hover:bg-dark-800'
                        }`}
                    >
                      <Icon size={18} />
                      {page.title}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
