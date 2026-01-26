'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.01,
  });

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
              From adversity to full-stack innovation, I&apos;ve turned setbacks into source code. With a strong STEM foundation and relentless drive, I build real-world solutions— from scalable backends to responsive frontends.
            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="text-gray-400 text-lg leading-relaxed"
            >
              I write clean, efficient code with purpose, using every challenge as fuel to grow, solve, and ship. I&apos;m not here just to build apps—I&apos;m here to break barriers, inspire through action, and prove that where you start doesn&apos;t define how far you can go.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4">
              <motion.a
                href="/documents/Rachael's Tech-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Rachael-Higgins-Resume.pdf"
                className="group relative inline-flex items-center gap-2 text-green-400 font-semibold hover:text-white transition-all duration-300 px-6 py-3 border-2 border-green-400 hover:border-green-300 rounded-lg hover:bg-green-400/20 cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0)",
                    "0 0 20px 10px rgba(34, 197, 94, 0.3)",
                    "0 0 40px 20px rgba(34, 197, 94, 0.1)",
                    "0 0 20px 10px rgba(34, 197, 94, 0.3)",
                    "0 0 0 0 rgba(34, 197, 94, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-cyan-400/20 to-green-400/20 rounded-lg"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.95, 1.05, 0.95]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  animate={{
                    x: [-100, 300]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 1
                  }}
                />

                <span className="relative z-10">Download Resume</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              </motion.a>
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

      </div>
    </section>
  );
}