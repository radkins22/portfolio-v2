'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiPython, 
  SiNodedotjs, SiDocker, SiMongodb,
  SiPostgresql, SiGraphql, SiTailwindcss, SiGit,
  SiFirebase, SiVercel, SiSupabase, SiThreedotjs
} from 'react-icons/si';
import { Cloud, Code, Zap, Database, Server, Palette, Search, Filter } from 'lucide-react';

const skillCategories = [
  {
    name: 'Frontend',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React', icon: SiReact, level: 95, description: 'Building complex UIs with hooks, context, and modern patterns' },
      { name: 'JavaScript', icon: SiJavascript, level: 92, description: 'ES6+, async/await, closures, and advanced concepts' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, level: 88, description: 'Utility-first CSS framework for rapid UI development' },
      { name: 'Three.js', icon: SiThreedotjs, level: 80, description: '3D graphics and WebGL visualization library' },
      { name: 'Next.js', icon: SiNextdotjs, level: 75, description: 'Full-stack React framework with SSR and API routes' },
      { name: 'TypeScript', icon: SiTypescript, level: 70, description: 'Static typing for better code quality and developer experience' },
    ],
  },
  {
    name: 'Backend & Database',
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, level: 90, description: 'Server-side JavaScript with Express and custom APIs' },
      { name: 'MongoDB', icon: SiMongodb, level: 88, description: 'NoSQL database with aggregation pipelines and indexing' },
      { name: 'Supabase', icon: SiSupabase, level: 85, description: 'Open-source Firebase alternative with PostgreSQL backend' },
      { name: 'PostgreSQL', icon: SiPostgresql, level: 75, description: 'Relational database with complex queries and optimization' },
      { name: 'GraphQL', icon: SiGraphql, level: 70, description: 'Query language for APIs with Apollo and schema design' },
      { name: 'Python', icon: SiPython, level: 65, description: 'Data analysis, automation, and backend development' },
    ],
  },
  {
    name: 'DevOps & Tools',
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Git', icon: SiGit, level: 95, description: 'Version control with branching strategies and collaboration' },
      { name: 'Vercel', icon: SiVercel, level: 90, description: 'Modern deployment platform for frontend applications' },
      { name: 'Google Cloud', icon: Cloud, level: 85, description: 'Cloud services, deployment, and infrastructure management' },
      { name: 'Firebase', icon: SiFirebase, level: 80, description: 'Real-time database, authentication, and hosting' },
      { name: 'AWS', icon: Cloud, level: 75, description: 'Amazon Web Services cloud infrastructure and deployment' },
      { name: 'Docker', icon: SiDocker, level: 70, description: 'Containerization and deployment orchestration' },
    ],
  },
];

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [particlePositions, setParticlePositions] = useState<Array<{x: number, y: number}>>([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Generate floating particles for hover effect
  useEffect(() => {
    if (hoveredSkill) {
      const particles = Array.from({ length: 12 }, () => ({
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }));
      setParticlePositions(particles);
    }
  }, [hoveredSkill]);

  // Global search functionality
  useEffect(() => {
    if (searchTerm) {
      // Search across all categories
      let foundInCategory = -1;
      let foundSkills: typeof skillCategories[0]['skills'] = [];
      
      skillCategories.forEach((category, index) => {
        const matchingSkills = category.skills.filter(skill =>
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (matchingSkills.length > 0) {
          if (foundInCategory === -1) {
            foundInCategory = index;
            foundSkills = matchingSkills;
          } else {
            // Found in multiple categories, add all matching skills
            foundSkills = [...foundSkills, ...matchingSkills];
          }
        }
      });
      
      // If skill found in a different category, switch to it
      if (foundInCategory !== -1 && foundInCategory !== selectedCategory) {
        setSelectedCategory(foundInCategory);
      }
    }
  }, [searchTerm]);

  // Filter skills based on search term - now searches globally if needed
  const getFilteredSkills = () => {
    if (!searchTerm) {
      return skillCategories[selectedCategory].skills;
    }
    
    // First check current category
    const currentCategoryMatches = skillCategories[selectedCategory].skills.filter(skill =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (currentCategoryMatches.length > 0) {
      return currentCategoryMatches;
    }
    
    // If not found in current category, search all categories
    const allMatches: typeof skillCategories[0]['skills'] = [];
    skillCategories.forEach((category) => {
      const matches = category.skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      allMatches.push(...matches);
    });
    
    return allMatches;
  };
  
  const filteredSkills = getFilteredSkills();

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full"
            animate={{
              x: [Math.random() * 1000, Math.random() * 1000],
              y: [Math.random() * 1000, Math.random() * 1000],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Technical </span>
            <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Constantly evolving and learning new technologies
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-900/50 backdrop-blur-sm p-1">
            {skillCategories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => {
                  setSelectedCategory(index);
                  setExpandedSkill(null);
                  // Don't clear search term since it's global
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
                  selectedCategory === index
                    ? 'bg-gradient-to-r text-white ' + category.color
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center items-center gap-4 mb-12"
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 hover:border-green-500/50 transition-all duration-300 group cursor-pointer"
            >
              <Search className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
            </button>
            
            <AnimatePresence>
              {showSearch && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  placeholder="Search all skills globally..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="px-4 py-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 focus:border-green-500/50 text-white placeholder-gray-500 outline-none transition-all duration-300"
                />
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="text-sm text-gray-400 bg-gray-900/30 px-4 py-2 rounded-lg"
            animate={{ opacity: filteredSkills.length > 0 ? 1 : 0.5 }}
          >
            {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} found
            {searchTerm && filteredSkills.length > 0 && (
              <span className="ml-2 text-green-400">
                (global search active)
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* Skills Grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredSkills.map((skill, index) => {
              const Icon = skill.icon;
              const isExpanded = expandedSkill === skill.name;
              
              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: -180 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5,
                    z: 50
                  }}
                  onHoverStart={() => setHoveredSkill(skill.name)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                  className="relative group cursor-pointer"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  <motion.div 
                    className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-green-500/50 transition-all duration-300 relative overflow-hidden"
                    animate={{ 
                      borderColor: hoveredSkill === skill.name ? 'rgb(34 197 94 / 0.5)' : 'rgb(31 41 55)',
                      boxShadow: hoveredSkill === skill.name ? '0 0 40px rgb(34 197 94 / 0.3)' : '0 0 0px transparent'
                    }}
                  >
                    {/* Floating Particles */}
                    {hoveredSkill === skill.name && (
                      <div className="absolute inset-0 pointer-events-none">
                        {particlePositions.map((pos, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-green-400/60 rounded-full"
                            style={{
                              left: '50%',
                              top: '50%',
                            }}
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{ 
                              x: pos.x, 
                              y: pos.y, 
                              opacity: [0, 1, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.1,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Icon and Name with 3D float effect */}
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div 
                        className="relative"
                        animate={hoveredSkill === skill.name ? {
                          rotateY: [0, 360],
                          scale: [1, 1.2, 1]
                        } : {}}
                        transition={{ 
                          duration: 2,
                          repeat: hoveredSkill === skill.name ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      >
                        <Icon className="w-12 h-12 text-gray-400 group-hover:text-green-400 transition-colors duration-300" />
                        {hoveredSkill === skill.name && (
                          <motion.div
                            className="absolute inset-0 blur-xl bg-green-400/50"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ 
                              opacity: [0, 1, 0],
                              scale: [0.5, 2, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-green-100 transition-colors">
                          {skill.name}
                        </h3>
                        <span className="text-sm text-gray-500 group-hover:text-green-400/80 transition-colors">
                          {skill.level}% Proficiency
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Progress Bar with pulse effect */}
                    <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${skillCategories[selectedCategory].color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                      />
                      
                      {/* Animated glow sweep */}
                      <motion.div
                        className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: [-96, 400],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut"
                        }}
                      />

                      {/* Pulse effect on hover */}
                      {hoveredSkill === skill.name && (
                        <motion.div
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${skillCategories[selectedCategory].color} opacity-50`}
                          animate={{
                            width: [`${skill.level}%`, `${Math.min(skill.level + 10, 100)}%`, `${skill.level}%`]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </div>

                    {/* Expandable Description */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-700 pt-4"
                        >
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {skill.description}
                          </p>
                          <motion.div
                            className="mt-3 flex items-center gap-2 text-xs text-green-400"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Zap className="w-3 h-3" />
                            Click to collapse
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Click hint */}
                    {!isExpanded && (
                      <motion.div
                        className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        initial={{ y: 10 }}
                        animate={{ y: 0 }}
                      >
                        <Code className="w-3 h-3" />
                        Click for details
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Enhanced hover glow with multiple layers */}
                  <motion.div 
                    className={`absolute -inset-2 bg-gradient-to-r ${skillCategories[selectedCategory].color} rounded-xl blur-xl`}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: hoveredSkill === skill.name ? 0.3 : 0,
                      scale: hoveredSkill === skill.name ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className={`absolute -inset-1 bg-gradient-to-r ${skillCategories[selectedCategory].color} rounded-xl blur-lg`}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: hoveredSkill === skill.name ? 0.2 : 0
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}