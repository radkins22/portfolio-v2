'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import { Brain, Zap, Code, Cpu } from 'lucide-react';

// Import the iframe-based PDB viewer with AI molecule adder
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
  const [isMounted, setIsMounted] = React.useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.01,
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="interactive" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      {isMounted && (
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400/30 rounded-full"
              animate={{
                x: [(i * 100) % 1000, ((i * 100) + 500) % 1000],
                y: [(i * 70) % 1000, ((i * 70) + 400) % 1000],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: (i % 3) * 5 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: `${(i * 10) % 100}%`,
                top: `${(i * 13) % 100}%`,
              }}
            />
          ))}
        </div>
      )}

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

        {/* Centered PDB Viewer with AI Molecule Adder */}
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