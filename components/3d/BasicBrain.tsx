'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function RotatingBrain() {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const stemRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (leftRef.current && rightRef.current) {
      leftRef.current.rotation.y = time * 0.3;
      rightRef.current.rotation.y = time * 0.3;
      
      // Subtle pulsing
      const scale = 1 + Math.sin(time * 2) * 0.05;
      leftRef.current.scale.setScalar(scale);
      rightRef.current.scale.setScalar(scale);
    }
    
    if (stemRef.current) {
      stemRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Left hemisphere */}
      <mesh ref={leftRef} position={[-0.7, 0, 0]}>
        <sphereGeometry args={[0.8, 20, 20]} />
        <meshStandardMaterial 
          color="#22c55e" 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Right hemisphere */}
      <mesh ref={rightRef} position={[0.7, 0, 0]}>
        <sphereGeometry args={[0.8, 20, 20]} />
        <meshStandardMaterial 
          color="#10b981" 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Brain stem */}
      <mesh ref={stemRef} position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.25, 0.4, 1.2, 12]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}

export default function BasicBrain() {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} color="#3b82f6" intensity={0.5} />
        <pointLight position={[5, -5, 5]} color="#22c55e" intensity={0.3} />
        
        <RotatingBrain />
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={true}
          autoRotateSpeed={1}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
      
      {/* Overlay info */}
      <motion.div 
        className="absolute bottom-4 left-4 right-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-green-400 font-semibold">Interactive 3D Brain</h3>
          </div>
          <p className="text-sm text-gray-300">
            🖱️ Click & drag to rotate • 🔍 Scroll to zoom • Represents the neural complexity in software architecture
          </p>
        </div>
      </motion.div>
    </div>
  );
}