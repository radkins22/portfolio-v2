'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function BrainCore({ color = "#22c55e", position = [0, 0, 0] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      meshRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.8}
      />
    </Sphere>
  );
}

function BrainStem() {
  return (
    <mesh position={[0, -1.5, 0]}>
      <cylinderGeometry args={[0.3, 0.5, 1.5, 16]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  );
}

export default function SimpleBrain() {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className="w-full h-96 bg-black/20 rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />
        
        {/* Left hemisphere */}
        <BrainCore position={[-0.8, 0, 0]} color="#22c55e" />
        
        {/* Right hemisphere */}
        <BrainCore position={[0.8, 0, 0]} color="#10b981" />
        
        {/* Brain stem */}
        <BrainStem />
        
        <OrbitControls
          enableZoom={true}
          autoRotate={!isInteracting}
          autoRotateSpeed={1}
          onStart={() => setIsInteracting(true)}
          onEnd={() => setIsInteracting(false)}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/80 text-white p-3 rounded-lg text-sm"
        >
          <p className="text-green-400 font-semibold">🧠 Interactive Brain</p>
          <p className="text-gray-300">Click and drag to explore!</p>
        </motion.div>
      </div>
    </div>
  );
}