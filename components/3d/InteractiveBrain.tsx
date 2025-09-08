'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment,
  Text,
  Html,
  Float,
  MeshDistortMaterial,
  Sphere
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Brain hemisphere component
function BrainHemisphere({ 
  position, 
  rotation, 
  isLeft = true, 
  hovered, 
  onHover,
  onClick 
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  isLeft?: boolean;
  hovered: boolean;
  onHover: (hovering: boolean) => void;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
      
      if (hovered) {
        meshRef.current.scale.setScalar(1.05 + Math.sin(time * 3) * 0.02);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onClick={onClick}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={hovered ? "#22c55e" : "#065f46"}
        emissive={hovered ? "#10b981" : "#022c22"}
        emissiveIntensity={hovered ? 0.3 : 0.1}
        metalness={0.8}
        roughness={0.2}
        distort={0.3}
        speed={2}
        transparent
        opacity={0.8}
      />
      {hovered && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-black/80 text-green-400 px-3 py-1 rounded-lg text-sm font-semibold">
            {isLeft ? 'Left Hemisphere' : 'Right Hemisphere'}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Neural connections component
function NeuralConnections({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const connections = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const radius = 0.8 + Math.random() * 0.4;
      points.push([
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius
      ]);
    }
    return points;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {connections.map((point, i) => (
        <mesh key={i} position={point as [number, number, number]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial 
            color={active ? "#22c55e" : "#065f46"}
            transparent
            opacity={active ? 0.8 : 0.3}
          />
        </mesh>
      ))}
      
      {/* Connection lines */}
      {connections.map((point, i) => {
        if (i < connections.length - 1) {
          const nextPoint = connections[i + 1];
          return (
            <line key={`line-${i}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    ...point,
                    ...nextPoint
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial 
                color={active ? "#22c55e" : "#065f46"}
                opacity={active ? 0.6 : 0.2}
                transparent
              />
            </line>
          );
        }
        return null;
      })}
    </group>
  );
}

// Brain stem component
function BrainStem({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -1.5, 0]}>
      <cylinderGeometry args={[0.3, 0.5, 1.5, 16]} />
      <meshStandardMaterial
        color={active ? "#3b82f6" : "#1e40af"}
        emissive={active ? "#1e40af" : "#0f172a"}
        emissiveIntensity={active ? 0.2 : 0.05}
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  );
}

// Thought bubbles
function ThoughtBubbles({ count = 20 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const bubbles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        Math.random() * 4 + 2,
        (Math.random() - 0.5) * 6
      ] as [number, number, number],
      scale: Math.random() * 0.1 + 0.05,
      speed: Math.random() * 0.02 + 0.01
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const bubble = bubbles[i];
        child.position.y = bubble.position[1] + Math.sin(state.clock.getElapsedTime() * bubble.speed + i) * 0.5;
        child.rotation.x = state.clock.getElapsedTime() * 0.5;
        child.rotation.y = state.clock.getElapsedTime() * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {bubbles.map((bubble, i) => (
        <mesh key={i} position={bubble.position} scale={bubble.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main brain scene
function BrainScene() {
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);
  const [activeSystem, setActiveSystem] = useState<'neural' | 'stem' | null>(null);
  const { camera } = useThree();

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#22c55e" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
      
      {/* Left hemisphere */}
      <BrainHemisphere
        position={[-0.8, 0, 0]}
        rotation={[0, 0.2, 0]}
        isLeft={true}
        hovered={leftHovered}
        onHover={setLeftHovered}
        onClick={() => setActiveSystem(activeSystem === 'neural' ? null : 'neural')}
      />
      
      {/* Right hemisphere */}
      <BrainHemisphere
        position={[0.8, 0, 0]}
        rotation={[0, -0.2, 0]}
        isLeft={false}
        hovered={rightHovered}
        onHover={setRightHovered}
        onClick={() => setActiveSystem(activeSystem === 'neural' ? null : 'neural')}
      />
      
      {/* Brain stem */}
      <BrainStem active={activeSystem === 'stem'} />
      
      {/* Neural connections */}
      <NeuralConnections active={activeSystem === 'neural'} />
      
      {/* Thought bubbles */}
      <ThoughtBubbles />
      
      {/* Floating text */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={2}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.3}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
          font="/fonts/SpaceGrotesk-Bold.woff"
        >
          Interactive Brain Model
        </Text>
      </Float>
      
      {/* Instructions */}
      <Html position={[0, -3, 0]} center>
        <div className="text-center">
          <p className="text-green-400 text-sm mb-2">
            🖱️ Click and drag to rotate • 🔍 Scroll to zoom
          </p>
          <p className="text-gray-400 text-xs">
            Click on brain hemispheres to activate neural networks
          </p>
        </div>
      </Html>
    </>
  );
}

export default function InteractiveBrain() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-96'} bg-black rounded-xl overflow-hidden`}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          maxDistance={10}
          minDistance={2}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <BrainScene />
        
        <Environment preset="night" />
      </Canvas>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors"
        >
          {isFullscreen ? '🗗 Exit' : '🗖 Fullscreen'}
        </button>
      </div>
      
      {/* Info panel */}
      <div className="absolute bottom-4 left-4 max-w-xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-green-500/30"
        >
          <h3 className="text-green-400 font-semibold mb-2">🧠 Brain Explorer</h3>
          <p className="text-sm text-gray-300">
            This interactive 3D brain model showcases the complexity of neural networks - 
            much like the software architectures I design and build.
          </p>
        </motion.div>
      </div>
    </div>
  );
}