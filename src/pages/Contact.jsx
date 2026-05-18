import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle, AlertCircle, Clock, Globe } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import AnimatedSection from '../components/UI/AnimatedSection.jsx';

export default function Contact() {
  const { data } = useData();
  const { personal } = data;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'success', 'error', null

  const handleSubmit = (e) => {
    e.preventDefault();
    // محاكاة إرسال النموذج
    setStatus('success');
    setTimeout(() => {
      setStatus(null);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { icon: Phone, label: 'Phone', value: personal.phone, href: `tel:${personal.phone}` },
    { icon: MapPin, label: 'Location', value: personal.location, href: '#' },
    { icon: Linkedin, label: 'LinkedIn', value: personal.linkedin, href: `https://${personal.linkedin}` }
  ];

  return (
    <div className="pt-24 lg:pt-32">
      <div className="page-container section-padding">
        {/* Header */}
        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 
                           text-sm font-medium mb-4 border border-primary-500/20">
              Get In Touch
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Let's Start a <span className="gradient-text">Conversation</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Whether you need a complete system, a website, or IT support — I'm ready to help
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Contact Info */}
          <AnimatedSection variant="slideLeft" className="lg:col-span-2">
            <div className="space-y-6">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {contactInfo.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/50 hover:bg-dark-700 
                               transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center
                                    group-hover:bg-primary-500/20 transition-colors">
                        <item.icon size={20} className="text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="font-medium group-hover:text-primary-400 transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-primary-500" />
                  Availability
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Weekdays</span>
                    <span className="text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Saturday</span>
                    <span className="text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Sunday</span>
                    <span className="text-yellow-400">Limited Availability</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-700/50">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Currently accepting new projects
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection variant="slideRight" className="lg:col-span-3">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
              <p className="text-gray-400 text-sm mb-8">
                Fill out the form below and I'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="input-field"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="input-field resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'success'}
                  className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 
                           transition-all duration-200 ${
                    status === 'success'
                      ? 'bg-green-600 text-white'
                      : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg hover:shadow-primary-500/25'
                  }`}
                >
                  {status === 'success' ? (
                    <>
                      <CheckCircle size={20} />
                      Message Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                    <AlertCircle size={16} />
                    Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}