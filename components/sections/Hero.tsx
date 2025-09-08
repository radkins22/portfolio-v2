'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Terminal, Code2, Cpu } from 'lucide-react';

export default function Hero() {
  const [text, setText] = useState('');
  const fullText = "Software Engineer";
  const [showCursor, setShowCursor] = useState(true);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [matrixStreams, setMatrixStreams] = useState<Array<{id: number, x: number, chars: string[], delay: number}>>([]);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Mouse tracking for name interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (nameRef.current) {
        const rect = nameRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);
        
        const maxRotation = 15;
        const rotateY = deltaX * maxRotation;
        const rotateX = -deltaY * maxRotation;
        
        nameRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      }
    };

    const handleMouseLeave = () => {
      if (nameRef.current) {
        nameRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Matrix rain effect - create streams like the movie
  useEffect(() => {
    const generateMatrixStream = () => {
      const chars = ['0', '1'];
      const streamLength = 8 + Math.floor(Math.random() * 12); // 8-20 characters per stream
      const streamChars = Array.from({ length: streamLength }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      );
      
      // Matrix columns spanning entire name area with maximum density
      const nameWidth = 1200; // Much wider coverage for more columns
      const centerX = window.innerWidth / 2;
      const leftEdge = centerX - nameWidth / 2;
      
      // Create columns every 15px for much denser coverage
      const columnSpacing = 15;
      const totalColumns = Math.floor(nameWidth / columnSpacing);
      const columnIndex = Math.floor(Math.random() * totalColumns);
      const x = leftEdge + (columnIndex * columnSpacing) + Math.random() * 8; // Add slight variation
      
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
        // Add new stream - maximum density coverage
        if (newStreams.length < 80) { // Allow many more streams for ultra-dense coverage
          newStreams.push(generateMatrixStream());
        }
        return newStreams;
      });
    }, 150); // Very fast spawn rate for maximum density

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Matrix Rain Effect - Authentic Matrix Streams */}
      <div className="absolute inset-0 pointer-events-none">
        {matrixStreams.map((stream) => (
          <motion.div
            key={stream.id}
            className="absolute flex flex-col"
            style={{ left: stream.x }}
            initial={{ y: -400 }}
            animate={{ y: window.innerHeight + 100 }}
            transition={{ 
              duration: 4 + stream.delay,
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
                className="font-mono text-2xl leading-tight"
                style={{ 
                  color: index === 0 ? '#00ff41' : '#008f11', // Bright green for leading char, darker for trail
                  opacity: index === 0 ? 1 : Math.max(0.1, 1 - (index / stream.chars.length))
                }}
                animate={{
                  opacity: [
                    index === 0 ? 1 : Math.max(0.1, 1 - (index / stream.chars.length)),
                    index === 0 ? 1 : Math.max(0.1, 1 - (index / stream.chars.length)),
                    0
                  ]
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
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

      <div className="max-w-7xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >

          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span 
              ref={nameRef}
              className="gradient-text" 
              data-text="Rachael Higgins"
              style={{ transition: 'transform 0.1s ease-out' }}
            >
              Rachael Higgins
            </span>
          </motion.h1>

          <motion.div 
            className="text-2xl sm:text-3xl md:text-4xl text-gray-400 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="text-green-400">{'>'} </span>
            <span className="text-white">{text}</span>
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400`}>|</span>
          </motion.div>

          <motion.p 
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Building robust backend logic to dynamic UI, I turn complex requirements into real-world, maintainable code. From adversity to full-stack innovation.
          </motion.p>

          <motion.div 
            className="flex gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <button className="group relative px-8 py-3 overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold transition-all duration-300 hover:scale-105 cursor-pointer">
              <span className="relative z-10">View Projects</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button className="px-8 py-3 rounded-lg border-2 border-green-500/50 text-green-400 font-semibold transition-all duration-300 hover:bg-green-500/10 hover:border-green-500 hover:scale-105 cursor-pointer">
              Contact Me
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-green-400/50" />
        </motion.div>
      </div>
    </section>
  );
}