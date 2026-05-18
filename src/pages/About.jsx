import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Linkedin, Award, BookOpen, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import AnimatedSection from '../components/UI/AnimatedSection.jsx';

export default function About() {
  const { data } = useData();
  const { personal, education, certifications, languages } = data;

  return (
    <div className="pt-24 lg:pt-32">
      <div className="page-container section-padding">
        {/* Header */}
        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 
                           text-sm font-medium mb-4 border border-primary-500/20">
              About Me
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              The Story Behind the <span className="gradient-text">Code</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Two decades of hands-on IT experience, now combined with AI-powered development
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
         {/* Profile Image & Info */}
<<AnimatedSection variant="slideLeft" className="lg:col-span-1">
  <div className="lg:sticky lg:top-24">
    <div className="relative mb-6 max-w-xs mx-auto lg:max-w-none">
      <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-purple-500/20 
                       rounded-2xl blur-xl" />
      <div className="relative aspect-[3/4] max-h-[50vh] lg:max-h-none rounded-2xl overflow-hidden border-2 border-dark-700 
                   shadow-2xl">
        <img
          src={personal.image}
          alt={personal.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://ui-avatars.com/api/?name=Ahmed+Hamed&size=400&background=3b82f6&color=fff';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />
      </div>
    </div>

    <div className="glass-card p-6 space-y-4">
      <h3 className="text-xl font-bold">{personal.name}</h3>
      <p className="text-primary-400 text-sm font-medium">{personal.title}</p>

      <div className="space-y-3 pt-4 border-t border-dark-700/50">
        ...
      </div>
    </div>
  </div>
</AnimatedSection>

          {/* Bio & Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Bio */}
            <AnimatedSection variant="fadeUp">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen size={24} className="text-primary-500" />
                  My Journey
                </h2>
                <div className="prose prose-invert max-w-none">
                  {personal.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-300 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Languages */}
            <AnimatedSection variant="fadeUp">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Calendar size={24} className="text-primary-500" />
                  Languages
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                        <span className="text-primary-400 font-bold text-lg">
                          {lang.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{lang.name}</h4>
                        <p className="text-sm text-gray-400">{lang.level}</p>
                      </div>
                      <div className="w-16 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lang.proficiency}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className="h-full bg-primary-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Education */}
            <AnimatedSection variant="fadeUp">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen size={24} className="text-primary-500" />
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex gap-4 p-4 bg-dark-800/50 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                        <Award size={20} className="text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{edu.degree}</h4>
                        <p className="text-gray-400">{edu.school}</p>
                        <p className="text-sm text-gray-500">{edu.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Certifications */}
            <AnimatedSection variant="fadeUp">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Award size={24} className="text-primary-500" />
                  Certifications
                </h2>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex gap-4 p-4 bg-dark-800/50 rounded-xl border border-primary-500/10">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                        <Award size={20} className="text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{cert.name}</h4>
                        <p className="text-sm text-gray-400">{cert.center}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{cert.date}</span>
                          <span className="px-2 py-0.5 bg-dark-700 rounded text-xs">ID: {cert.certId}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
