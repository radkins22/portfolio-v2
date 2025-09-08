'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import { Brain, Zap, Code, Cpu } from 'lucide-react';

// Import the iframe-based PDB viewer (guaranteed to work)
const PDBIframe = dynamic(
  () => import('@/components/3d/PDBIframe'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-black/20 rounded-xl flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading Three.js PDB Viewer...</div>
      </div>
    )
  }
);

export default function Interactive() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="interactive" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            animate={{
              x: [Math.random() * 1000, Math.random() * 1000],
              y: [Math.random() * 1000, Math.random() * 1000],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-[95vw] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Interactive </span>
            <span className="gradient-text">Showcase</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore molecular structures through interactive 3D visualization powered by Three.js
          </p>
        </motion.div>

        {/* Centered PDB Viewer */}
        <div ref={ref} className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="w-full max-w-none"
          >
            <PDBIframe />
          </motion.div>
        </div>

      </div>
    </section>
  );
}