'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Simple but effective brain geometry that won't break
function createBrainGeometry() {
  const geometry = new THREE.SphereGeometry(1, 64, 32);
  const positions = geometry.attributes.position;
  const posArray = positions.array.slice(); // Create a copy
  
  // Apply brain-like deformation safely
  for (let i = 0; i < posArray.length; i += 3) {
    const x = posArray[i];
    const y = posArray[i + 1];
    const z = posArray[i + 2];
    
    // Simple but effective brain surface deformation
    const noise1 = Math.sin(x * 3) * Math.cos(y * 3) * 0.05;
    const noise2 = Math.sin(x * 6) * Math.cos(z * 6) * 0.03;
    const folds = Math.sin(x * 12) * Math.cos(y * 12) * 0.02;
    
    posArray[i] = x * (1 + noise1 + folds);
    posArray[i + 1] = y * (1 + noise1 + noise2);
    posArray[i + 2] = z * (1 + noise2 + folds);
  }
  
  // Update the geometry with new positions
  positions.array.set(posArray);
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  
  return geometry;
}

function BrainHemisphere({ 
  position, 
  rotation, 
  isLeft = true, 
  onClick, 
  isActive = false 
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  isLeft: boolean;
  onClick: () => void;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const brainGeometry = useMemo(() => createBrainGeometry(), []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle pulsing
      const pulseScale = 1 + Math.sin(time * 2 + (isLeft ? 0 : Math.PI)) * 0.02;
      meshRef.current.scale.setScalar(pulseScale);
      
      // Slow rotation
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={brainGeometry}
        position={position}
        rotation={rotation}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isActive ? "#ff6b9d" : "#c2a878"}
          emissive={isActive ? "#ff1744" : "#5d4e37"}
          emissiveIntensity={isActive ? 0.3 : 0.1}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {hovered && (
        <Html position={[position[0], position[1] + 1.5, position[2]]} center>
          <div className="bg-black/80 text-green-400 px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap">
            {isLeft ? 'Left Hemisphere' : 'Right Hemisphere'}
            <br />
            <span className="text-gray-300 text-xs">Click to activate</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function BrainStem({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -1.2, 0.2]}>
      <cylinderGeometry args={[0.15, 0.25, 1, 16]} />
      <meshStandardMaterial
        color={isActive ? "#3b82f6" : "#1e3a8a"}
        emissive={isActive ? "#1e40af" : "#0f1629"}
        emissiveIntensity={isActive ? 0.2 : 0.05}
        roughness={0.6}
        metalness={0.2}
      />
    </mesh>
  );
}

function Cerebellum({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.8, -1]}>
      <sphereGeometry args={[0.4, 32, 16]} />
      <meshStandardMaterial
        color={isActive ? "#f59e0b" : "#92400e"}
        emissive={isActive ? "#d97706" : "#451a03"}
        emissiveIntensity={isActive ? 0.2 : 0.05}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

function NeuralActivity({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < 100; i++) {
      // Random positions around the brain
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 1.3 + Math.random() * 0.5;
      
      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
      
      // Colorful neural activity
      const colorType = Math.random();
      if (colorType < 0.33) {
        colors.push(1.0, 0.2, 0.6); // Pink
      } else if (colorType < 0.66) {
        colors.push(0.2, 0.8, 1.0); // Cyan
      } else {
        colors.push(0.8, 1.0, 0.2); // Yellow-green
      }
    }
    
    return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
  }, []);
  
  useFrame((state) => {
    if (groupRef.current && active) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function BrainScene() {
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);
  const [systemActive, setSystemActive] = useState(false);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-3, 2, 3]} color="#ff6b9d" intensity={0.5} />
      <pointLight position={[3, -2, -3]} color="#3b82f6" intensity={0.4} />
      
      {/* Left hemisphere */}
      <BrainHemisphere
        position={[-0.5, 0.2, 0]}
        rotation={[0, 0.2, 0]}
        isLeft={true}
        isActive={leftActive}
        onClick={() => {
          setLeftActive(!leftActive);
          setSystemActive(!leftActive || rightActive);
        }}
      />
      
      {/* Right hemisphere */}
      <BrainHemisphere
        position={[0.5, 0.2, 0]}
        rotation={[0, -0.2, 0]}
        isLeft={false}
        isActive={rightActive}
        onClick={() => {
          setRightActive(!rightActive);
          setSystemActive(leftActive || !rightActive);
        }}
      />
      
      {/* Brain stem */}
      <BrainStem isActive={systemActive} />
      
      {/* Cerebellum */}
      <Cerebellum isActive={systemActive} />
      
      {/* Neural activity */}
      <NeuralActivity active={leftActive || rightActive} />
      
      {/* Floating labels */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
      >
        Interactive Brain Model
      </Text>
    </>
  );
}

export default function WorkingBrain() {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="w-full h-96 overflow-hidden relative" style={{ background: 'transparent' }}>
      <Canvas 
        camera={{ position: [0, 0, 3], fov: 60 }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        gl={{ 
          alpha: true, 
          antialias: true,
          preserveDrawingBuffer: true 
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.setClearAlpha(0);
        }}
      >
        <BrainScene />
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={false}
          minDistance={1.5}
          maxDistance={6}
        />
      </Canvas>
      
      {/* Control panel */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
        >
          {showInfo ? '🙈 Hide Info' : '👁️ Show Info'}
        </button>
      </div>
      
      {/* Information overlay */}
      {showInfo && (
        <motion.div 
          className="absolute bottom-4 left-4 right-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-green-400 font-semibold">Working Brain Model</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>🖱️ <strong>Click hemispheres</strong> to activate neural networks</p>
              <p>🔄 <strong>Drag to rotate</strong> • 🔍 <strong>Scroll to zoom</strong></p>
              <p>🧠 Features: Cerebral cortex, brain stem, cerebellum, neural activity</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}