'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Users, Code, Award, Briefcase } from 'lucide-react';

const experiences = [
  {
    id: 1,
    title: 'Teaching Team Assistant',
    company: 'Columbia University',
    location: 'Remote',
    period: '08/2024 - Present',
    type: 'Full-time',
    description: [
      'Support 11-week AI Edge cohort, providing technical guidance in Python, APIs, and backend development to justice-impacted adult learners while facilitating live Zoom sessions (Mon-Thurs, 6:15-9:30 PM EST)',
      'Conduct weekly office hours and grade assignments in Canvas LMS, delivering personalized coding support and constructive feedback to help fellows develop foundational software and AI skills',
      'Monitor Slack channels for technical questions, track common issues, and submit weekly performance notes to optimize curriculum delivery and student success',
    ],
    technologies: ['Python', 'APIs', 'Backend Development', 'Canvas LMS', 'Teaching', 'AI Education'],
    icon: Award,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: 2,
    title: 'Software Engineer',
    company: 'Banyan Labs',
    location: 'Remote',
    period: '03/2024 - Present',
    type: 'Full-time',
    description: [
      'Lead Agile Scrum teams as Project Manager and Lead Developer across multiple AI-powered applications, managing project timelines and deliverables using ClickUp',
      'Oversee development of AI-driven platforms including a government grant proposal evaluation system (React, Python, SQLAlchemy, FastAPI, Next.js) and HRPR personal assistant (OpenAI API, RAG, Supabase)',
      'Leverage AI tools and APIs to accelerate development cycles while guiding junior developers through version control best practices and AI integration techniques',
    ],
    technologies: ['React', 'Python', 'SQLAlchemy', 'FastAPI', 'Next.js', 'OpenAI API', 'RAG', 'Supabase', 'ClickUp'],
    icon: Briefcase,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Software Engineer',
    company: 'Assessment Pathways',
    location: 'Remote',
    period: '03/2024 - 09/2024',
    type: 'Full-time',
    description: [
      'Developed a Google Chrome extension using React, JavaScript, and Node.js to assist teachers in grading assignments with AI-generated feedback',
      'Implemented OAuth2 authentication and Google Cloud Platform integration to ensure secure access, scalability, and efficient AI processing',
      'Collaborated with educators and developers in an Agile environment to optimize AI models for accurate grading and enhance user experience',
    ],
    technologies: ['React', 'JavaScript', 'Node.js', 'OAuth2', 'Google Cloud Platform', 'AI/ML', 'Chrome Extension'],
    icon: Code,
    gradient: 'from-green-500 to-cyan-500',
  },
];

export default function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [matrixStreams, setMatrixStreams] = useState<Array<{id: number, x: number, chars: string[], delay: number}>>([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  // Matrix rain effect for experience section
  useEffect(() => {
    const generateMatrixStream = () => {
      const chars = ['0', '1'];
      const streamLength = 8 + Math.floor(Math.random() * 12); // 8-20 characters per stream
      const streamChars = Array.from({ length: streamLength }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      );
      
      // Create columns across the entire width of the screen
      // Generate random x position across full viewport width
      const screenWidth = window.innerWidth;
      const columnWidth = 40; // 40px between columns
      const totalColumns = Math.floor(screenWidth / columnWidth);
      const columnIndex = Math.floor(Math.random() * totalColumns);
      const x = columnIndex * columnWidth + Math.random() * 20; // Add some variation
      
      return {
        id: Math.random(),
        x: x,
        chars: streamChars,
        delay: Math.random() * 2
      };
    };

    const interval = setInterval(() => {
      setMatrixStreams(prev => {
        const newStreams = [...prev];
        // Many more streams across full width
        if (newStreams.length < 40) { // Much higher limit for full-width coverage
          newStreams.push(generateMatrixStream());
        }
        return newStreams;
      });
    }, 200); // Much faster spawn rate for dense coverage

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Matrix Rain Effect for Experience Section */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {matrixStreams.map((stream) => (
          <motion.div
            key={stream.id}
            className="absolute flex flex-col"
            style={{ left: stream.x }}
            initial={{ y: -200 }} // Start from top of experience section
            animate={{ y: window.innerHeight + 200 }} // Fall through entire section
            transition={{ 
              duration: 6 + stream.delay, // Longer duration to fall through experience
              ease: "linear",
              delay: stream.delay
            }}
            onAnimationComplete={() => {
              setMatrixStreams(prev => prev.filter(s => s.id !== stream.id));
            }}
          >
            {stream.chars.map((char, index) => (
              <motion.div
                key={index}
                className="font-mono text-xl leading-tight"
                style={{ 
                  color: index === 0 ? '#00ff41' : '#006611', // Slightly darker trail for better contrast
                  opacity: index === 0 ? 0.8 : Math.max(0.1, 0.6 - (index / stream.chars.length))
                }}
                animate={{
                  opacity: [
                    index === 0 ? 0.8 : Math.max(0.1, 0.6 - (index / stream.chars.length)),
                    index === 0 ? 0.8 : Math.max(0.1, 0.6 - (index / stream.chars.length)),
                    0
                  ]
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                {char}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Work </span>
            <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            My professional journey and key accomplishments in software development
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-cyan-400 hidden md:block" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-8"
          >
            {experiences.map((experience, index) => {
              const Icon = experience.icon;
              return (
                <motion.div
                  key={experience.id}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Timeline dot */}
                    <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 relative z-10 flex-shrink-0">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Experience card */}
                    <div className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-green-500/50 transition-all duration-300"
                      >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {experience.title}
                            </h3>
                            <p className="text-green-400 font-semibold mb-2">
                              {experience.company}
                            </p>
                          </div>
                          <div className="flex flex-col sm:items-end text-sm text-gray-400">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4" />
                              {experience.period}
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4" />
                              {experience.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {experience.type}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <ul className="text-gray-300 space-y-2 mb-4">
                          {experience.description.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: 'Years Experience', value: '2+', icon: Calendar },
            { label: 'Projects Completed', value: '10+', icon: Code },
            { label: 'Technologies', value: '15+', icon: Award },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="text-center p-6 bg-gray-900/30 rounded-xl border border-gray-800"
              >
                <Icon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}