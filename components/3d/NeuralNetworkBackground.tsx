'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  OrbitControls,
  PerspectiveCamera,
  Environment
} from '@react-three/drei';
import * as THREE from 'three';

interface NodeProps {
  position: [number, number, number];
  connections: [number, number, number][];
  index: number;
}

function NeuralNode({ position, connections, index }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Pulse effect
      meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = 
        1 + Math.sin(time * 2 + index) * 0.2;
      
      // React to mouse
      const mouseInfluence = 1 - Math.min(
        Math.sqrt(
          Math.pow(mouse.x * 10 - position[0], 2) + 
          Math.pow(mouse.y * 10 - position[1], 2)
        ) / 10,
        1
      );
      
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.emissiveIntensity = 0.5 + mouseInfluence * 2;
      }
    }
  });

  const connectionLines = useMemo(() => {
    return connections.map((endPos, i) => (
      <line key={i}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...position, ...endPos]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#22c55e" 
          opacity={0.2} 
          transparent 
        />
      </line>
    ));
  }, [connections, position]);

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#22c55e"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {connectionLines}
    </group>
  );
}

function LiquidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={4} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} position={[3, -2, -5]} scale={[3, 3, 3]}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#065f46"
          emissive="#10b981"
          emissiveIntensity={0.2}
          metalness={0.95}
          roughness={0.1}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const particleCount = 1000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 20;
      
      col[i3] = 0.1 + Math.random() * 0.2;
      col[i3 + 1] = 0.8 + Math.random() * 0.2;
      col[i3 + 2] = 0.5 + Math.random() * 0.5;
    }
    
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      points.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function NeuralNetwork() {
  const nodes = useMemo(() => {
    const nodeList = [];
    const layers = 4;
    const nodesPerLayer = 5;
    
    for (let layer = 0; layer < layers; layer++) {
      for (let node = 0; node < nodesPerLayer; node++) {
        const x = (layer - layers / 2) * 3;
        const y = (node - nodesPerLayer / 2) * 1.5;
        const z = Math.sin(layer + node) * 0.5;
        
        const connections: [number, number, number][] = [];
        if (layer < layers - 1) {
          for (let nextNode = 0; nextNode < nodesPerLayer; nextNode++) {
            const nextX = ((layer + 1) - layers / 2) * 3;
            const nextY = (nextNode - nodesPerLayer / 2) * 1.5;
            const nextZ = Math.sin((layer + 1) + nextNode) * 0.5;
            
            if (Math.random() > 0.3) {
              connections.push([nextX, nextY, nextZ]);
            }
          }
        }
        
        nodeList.push({
          position: [x, y, z] as [number, number, number],
          connections,
          index: layer * nodesPerLayer + node
        });
      }
    }
    
    return nodeList;
  }, []);

  return (
    <>
      {nodes.map((node, i) => (
        <NeuralNode 
          key={i} 
          position={node.position} 
          connections={node.connections} 
          index={node.index}
        />
      ))}
    </>
  );
}

export default function NeuralNetworkBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color="#22c55e" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#3b82f6" />
        
        <fog attach="fog" args={['#000000', 5, 25]} />
        
        <NeuralNetwork />
        <LiquidMesh />
        <ParticleField />
        
        <Environment preset="night" />
      </Canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
    </div>
  );
}