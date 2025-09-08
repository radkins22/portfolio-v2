'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Advanced brain geometry with anatomical accuracy
function createRealisticBrainGeometry() {
  const geometry = new THREE.SphereGeometry(1, 128, 64);
  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;
  
  // Create realistic brain surface with multiple layers of detail
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    // Convert to spherical coordinates for better brain-like deformation
    const radius = Math.sqrt(x*x + y*y + z*z);
    const theta = Math.atan2(Math.sqrt(x*x + z*z), y);
    const phi = Math.atan2(z, x);
    
    // Primary cortical folding patterns (gyri and sulci)
    const corticalFolds = Math.sin(theta * 8) * Math.cos(phi * 6) * 0.08;
    
    // Secondary folding for fine detail
    const secondaryFolds = Math.sin(theta * 20) * Math.cos(phi * 18) * 0.03;
    
    // Tertiary surface texture for brain-like appearance
    const surfaceTexture = Math.sin(theta * 40) * Math.cos(phi * 35) * 0.01;
    
    // Asymmetric deformation for realistic brain shape
    const asymmetry = x > 0 ? 1.0 : 0.95; // Right hemisphere slightly larger
    
    // Flatten the bottom slightly for more realistic shape
    const bottomFlatten = y < -0.3 ? 0.8 : 1.0;
    
    // Apply all deformations
    const totalDeformation = (corticalFolds + secondaryFolds + surfaceTexture) * asymmetry * bottomFlatten;
    
    positions[i] *= (1 + totalDeformation);
    positions[i + 1] *= (1 + totalDeformation) * bottomFlatten;
    positions[i + 2] *= (1 + totalDeformation);
  }
  
  // Recalculate normals for proper lighting
  geometry.computeVertexNormals();
  geometry.computeTangents();
  
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
  
  const brainGeometry = useMemo(() => createRealisticBrainGeometry(), []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Subtle brain activity pulsing
      const pulseScale = 1 + Math.sin(time * 3 + (isLeft ? 0 : Math.PI)) * 0.02;
      meshRef.current.scale.setScalar(pulseScale);
      
      // Gentle rotation
      meshRef.current.rotation.y += 0.005;
      
      // Color changes for activity
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.emissiveIntensity = isActive ? 0.3 : 0.1;
      }
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
          emissiveIntensity={isActive ? 0.4 : 0.15}
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.95}
          normalScale={new THREE.Vector2(0.5, 0.5)}
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
  
  // Create anatomically accurate cerebellum geometry
  const cerebellumGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.45, 64, 32);
    const positions = geometry.attributes.position.array;
    
    // Create characteristic cerebellum foliation (parallel ridges)
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Primary foliation pattern - horizontal ridges
      const primaryFolds = Math.sin(y * 25) * 0.04;
      
      // Secondary vertical subdivisions
      const secondaryFolds = Math.cos(x * 15) * Math.cos(z * 15) * 0.02;
      
      // Flatten top and shape like real cerebellum
      const cerebellumShape = y > 0 ? y * 0.7 : y;
      
      positions[i] += secondaryFolds;
      positions[i + 1] = cerebellumShape + primaryFolds;
      positions[i + 2] += secondaryFolds;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} geometry={cerebellumGeometry} position={[0, -0.8, -1]}>
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
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];
    
    for (let i = 0; i < 200; i++) {
      // Create particles following brain surface more closely
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 1.1 + Math.random() * 0.3;
      
      // Add some noise to make particles follow brain surface variations
      const noise = Math.sin(theta * 8) * Math.cos(phi * 6) * 0.05;
      const finalRadius = radius + noise;
      
      positions.push(
        finalRadius * Math.sin(phi) * Math.cos(theta),
        finalRadius * Math.cos(phi),
        finalRadius * Math.sin(phi) * Math.sin(theta)
      );
      
      // Varied colors for different types of neural activity
      const colorType = Math.random();
      if (colorType < 0.4) {
        colors.push(1.0, 0.2, 0.6); // Pink - dopamine
      } else if (colorType < 0.7) {
        colors.push(0.2, 0.8, 1.0); // Cyan - serotonin
      } else {
        colors.push(0.8, 1.0, 0.2); // Yellow-green - electrical
      }
      
      sizes.push(Math.random() * 3 + 1);
    }
    
    return { 
      positions: new Float32Array(positions), 
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes)
    };
  }, []);
  
  useFrame((state) => {
    if (groupRef.current && active) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = time * 0.3;
      
      // Animate particle sizes and opacity for pulsing effect
      if (particlesRef.current) {
        const material = particlesRef.current.material as THREE.PointsMaterial;
        material.opacity = 0.6 + Math.sin(time * 3) * 0.3;
      }
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      <points ref={particlesRef}>
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
          <bufferAttribute
            attach="attributes-size"
            count={particles.sizes.length}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
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
      {/* Advanced lighting setup for realistic brain rendering */}
      <ambientLight intensity={0.15} color="#4a4a6a" />
      
      {/* Key light - main illumination */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light - soften shadows */}
      <directionalLight position={[-5, 3, -2]} intensity={0.4} color="#e8f4ff" />
      
      {/* Neural activity lighting */}
      <pointLight position={[-2, 1, 2]} color="#ff6b9d" intensity={0.6} distance={4} />
      <pointLight position={[2, -1, -2]} color="#00d4ff" intensity={0.5} distance={4} />
      <pointLight position={[0, 2, 1]} color="#7c3aed" intensity={0.4} distance={3} />
      
      {/* Rim lighting for depth */}
      <spotLight
        position={[0, -5, 0]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={0.8}
        color="#ff9500"
        target-position={[0, 0, 0]}
      />
      
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

export default function RealisticBrain() {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
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
              <h3 className="text-green-400 font-semibold">Anatomical Brain Model</h3>
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