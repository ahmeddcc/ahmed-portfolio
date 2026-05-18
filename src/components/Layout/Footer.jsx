import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import AnimatedSection from '../UI/AnimatedSection';

export default function Footer() {
  const { data } = useData();
  const { personal } = data;
  const visiblePages = data.pages.filter(p => p.visible).sort((a, b) => a.order - b.order);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-800 border-t border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <AnimatedSection variant="fadeUp">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 
                              flex items-center justify-center text-white font-bold">
                  AH
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ahmed Hamed</h3>
                  <p className="text-xs text-gray-400">IT Specialist & Developer</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Building real solutions with real impact. Over 20 years of IT experience 
                combined with modern AI-powered development.
              </p>
              <div className="flex gap-3">
                <a href={`https://${personal.linkedin}`} target="_blank" rel="noopener noreferrer"
                   className="p-2 rounded-lg bg-dark-700 text-gray-400 hover:text-primary-400 
                            hover:bg-primary-500/10 transition-all">
                  <Linkedin size={18} />
                </a>
                <a href={`mailto:${personal.email}`}
                   className="p-2 rounded-lg bg-dark-700 text-gray-400 hover:text-primary-400 
                            hover:bg-primary-500/10 transition-all">
                  <Mail size={18} />
                </a>
                <a href={`tel:${personal.phone}`}
                   className="p-2 rounded-lg bg-dark-700 text-gray-400 hover:text-primary-400 
                            hover:bg-primary-500/10 transition-all">
                  <Phone size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {visiblePages.map(page => (
                  <li key={page.id}>
                    <Link to={page.path} 
                          className="text-gray-400 hover:text-primary-400 text-sm transition-colors 
                                   flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin size={16} className="mt-0.5 text-primary-500 shrink-0" />
                  <span>{personal.location}</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone size={16} className="text-primary-500 shrink-0" />
                  <span>{personal.phone}</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail size={16} className="text-primary-500 shrink-0" />
                  <span>{personal.email}</span>
                </li>
              </ul>
            </div>

            {/* Back to Top */}
            <div className="flex flex-col items-start lg:items-end">
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700 
                         hover:bg-primary-600 text-gray-400 hover:text-white transition-all mb-4"
              >
                <span className="text-sm">Back to Top</span>
                <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
              </button>
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} Ahmed Hamed. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                Built with <Heart size={12} className="text-red-500" /> using React
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}