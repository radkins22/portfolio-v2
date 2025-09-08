'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Sparkles, Zap, Target, Rocket, Code, Database, Cloud, Cpu, Globe, Terminal } from 'lucide-react';

const stats = [
  { label: 'Full-Time Job', value: 'Currently', icon: Zap },
  { label: 'Portfolio Projects', value: 'Growing', icon: Target },
  { label: 'Learning Focus', value: 'Full-Stack', icon: Sparkles },
  { label: 'Technologies', value: '15+', icon: Rocket },
];

const techStack = [
  { name: 'React', icon: Code, color: 'from-blue-400 to-cyan-400', description: 'Building dynamic UIs', level: 95 },
  { name: 'Node.js', icon: Cpu, color: 'from-green-400 to-green-600', description: 'Backend runtime', level: 90 },
  { name: 'MongoDB', icon: Database, color: 'from-green-500 to-green-700', description: 'NoSQL database', level: 85 },
  { name: 'Next.js', icon: Globe, color: 'from-gray-400 to-gray-600', description: 'Full-stack framework', level: 85 },
  { name: 'Three.js', icon: Zap, color: 'from-cyan-400 to-purple-500', description: '3D graphics & WebGL', level: 80 },
  { name: 'TypeScript', icon: Terminal, color: 'from-blue-500 to-blue-700', description: 'Type-safe JavaScript', level: 80 },
  { name: 'PostgreSQL', icon: Database, color: 'from-indigo-400 to-indigo-600', description: 'Relational DB', level: 80 },
  { name: 'Python', icon: Code, color: 'from-yellow-400 to-yellow-600', description: 'Data & automation', level: 75 },
  { name: 'GCP', icon: Cloud, color: 'from-blue-400 to-red-500', description: 'Google Cloud Platform', level: 75 },
  { name: 'GraphQL', icon: Database, color: 'from-pink-400 to-pink-600', description: 'API query language', level: 70 },
  { name: 'AWS', icon: Cloud, color: 'from-orange-400 to-orange-600', description: 'Cloud infrastructure', level: 70 },
  { name: 'Docker', icon: Cpu, color: 'from-blue-400 to-blue-600', description: 'Containerization', level: 65 },
];

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{x: number, y: number, id: number}>>([]);

  // Generate particles when hovering over tech
  useEffect(() => {
    if (hoveredTech) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
        id: Math.random()
      }));
      setParticles(newParticles);
    }
  }, [hoveredTech]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left side - Text content */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-white">About </span>
                <span className="gradient-text">Me</span>
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" />
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="text-gray-400 text-lg leading-relaxed"
            >
              From adversity to full-stack innovation, I've turned setbacks into source code. With a strong STEM foundation and relentless drive, I build real-world solutions— from scalable backends to responsive frontends.
            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="text-gray-400 text-lg leading-relaxed"
            >
              I write clean, efficient code with purpose, using every challenge as fuel to grow, solve, and ship. I'm not here just to build apps—I'm here to break barriers, inspire through action, and prove that where you start doesn't define how far you can go.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4">
              <a 
                href="/documents/Rachael's Tech-Resume.pdf" 
                download="Rachael's Tech-Resume.pdf"
                className="group inline-flex items-center gap-2 text-green-400 font-semibold hover:text-green-300 transition-all duration-300 px-6 py-3 border-2 border-green-400 hover:border-green-300 rounded-lg hover:bg-green-400/10 cursor-pointer"
              >
                Download Resume
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* Right side - Brain Background Video */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-green-500/50 transition-all duration-500"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ minHeight: '400px' }}
            >
              <source src="/assets/brainBG.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>

        {/* Enhanced Interactive Tech Stack */}
        <motion.div
          className="mt-16 relative"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h3 
            variants={itemVariants}
            className="text-2xl font-bold text-center text-white mb-8"
          >
            Technologies I Work With
          </motion.h3>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 relative"
          >
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              const isHovered = hoveredTech === tech.name;
              const isSelected = selectedTech === tech.name;
              
              return (
                <motion.div
                  key={tech.name}
                  className="relative group cursor-pointer"
                  onHoverStart={() => setHoveredTech(tech.name)}
                  onHoverEnd={() => setHoveredTech(null)}
                  onClick={() => setSelectedTech(isSelected ? null : tech.name)}
                >
                  {/* Floating Particles */}
                  {isHovered && (
                    <div className="absolute inset-0 pointer-events-none">
                      {particles.map((particle) => (
                        <motion.div
                          key={particle.id}
                          className={`absolute w-2 h-2 bg-gradient-to-r ${tech.color} rounded-full opacity-60`}
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                          initial={{ x: 0, y: 0, scale: 0 }}
                          animate={{ 
                            x: particle.x, 
                            y: particle.y,
                            scale: [0, 1, 0],
                            rotate: [0, 360]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <motion.div
                    whileHover={{ 
                      scale: 1.15,
                      rotateY: 10,
                      rotateX: 5,
                      z: 50
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      borderColor: isHovered 
                        ? 'rgb(34 197 94 / 0.8)' 
                        : isSelected
                        ? 'rgb(34 197 94 / 0.6)'
                        : 'rgb(75 85 99)',
                      boxShadow: isHovered 
                        ? `0 0 30px rgb(34 197 94 / 0.4)`
                        : isSelected
                        ? `0 0 20px rgb(34 197 94 / 0.3)`
                        : '0 0 0px transparent'
                    }}
                    className={`relative px-6 py-3 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-2 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${
                      isSelected ? 'ring-2 ring-green-400/30' : ''
                    }`}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                  >
                    {/* Background Gradient Animation */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0`}
                      animate={{ 
                        opacity: isHovered ? 0.1 : 0,
                        scale: isHovered ? 1.2 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Shimmer Effect */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: [-100, 200] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}

                    <div className="relative flex items-center gap-3">
                      <motion.div
                        animate={isHovered ? {
                          rotate: [0, 360],
                          scale: [1, 1.3, 1]
                        } : {}}
                        transition={{ 
                          duration: 2,
                          repeat: isHovered ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      >
                        <Icon className={`w-5 h-5 transition-colors duration-300 ${
                          isHovered ? 'text-green-400' : isSelected ? 'text-green-300' : 'text-gray-400'
                        }`} />
                      </motion.div>
                      
                      <span className={`font-medium transition-all duration-300 ${
                        isHovered ? 'text-green-400' : isSelected ? 'text-green-300' : 'text-gray-300'
                      }`}>
                        {tech.name}
                      </span>

                      {/* Level indicator */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-1 h-1 rounded-full transition-all duration-300 ${
                              i < Math.floor(tech.level / 20) 
                                ? (isHovered ? 'bg-green-400' : 'bg-green-500') 
                                : 'bg-gray-600'
                            }`}
                            animate={isHovered ? {
                              scale: [1, 1.5, 1],
                              opacity: [0.7, 1, 0.7]
                            } : {}}
                            transition={{ 
                              duration: 0.5,
                              delay: i * 0.1,
                              repeat: isHovered ? Infinity : 0
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          className="mt-3 pt-3 border-t border-gray-700/50"
                        >
                          <p className="text-sm text-gray-400 mb-2">
                            {tech.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${tech.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${tech.level}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                            <span className="text-xs text-green-400 font-bold">
                              {tech.level}%
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Enhanced glow effect */}
                  <motion.div 
                    className={`absolute -inset-1 bg-gradient-to-r ${tech.color} rounded-2xl blur-lg`}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isHovered ? 0.4 : isSelected ? 0.2 : 0,
                      scale: isHovered ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Interactive Help Text */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-500 text-sm mt-6"
          >
            Hover to see effects • Click to view proficiency details
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}