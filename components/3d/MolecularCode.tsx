'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';


interface Atom {
  element: string;
  position: [number, number, number];
  color: string;
  size: number;
  label: string;
}

interface Bond {
  from: number;
  to: number;
  strength: number;
}

// Define different "code molecules" representing different tech concepts
const codeMolecules = {
  'React Component': {
    atoms: [
      { element: 'React', position: [0, 0, 0] as [number, number, number], color: '#61dafb', size: 0.8, label: 'React Core' },
      { element: 'JSX', position: [2, 1, 0] as [number, number, number], color: '#f7df1e', size: 0.6, label: 'JSX' },
      { element: 'Props', position: [-2, 1, 0] as [number, number, number], color: '#4caf50', size: 0.5, label: 'Props' },
      { element: 'State', position: [0, 2, 1] as [number, number, number], color: '#ff5722', size: 0.6, label: 'State' },
      { element: 'Hook', position: [1, -2, 0] as [number, number, number], color: '#9c27b0', size: 0.5, label: 'Hooks' },
      { element: 'DOM', position: [-1, -1, -1] as [number, number, number], color: '#ff9800', size: 0.4, label: 'Virtual DOM' },
    ],
    bonds: [
      { from: 0, to: 1, strength: 1 },
      { from: 0, to: 2, strength: 1 },
      { from: 0, to: 3, strength: 1.5 },
      { from: 0, to: 4, strength: 1 },
      { from: 0, to: 5, strength: 0.8 },
      { from: 3, to: 4, strength: 0.6 },
    ]
  },
  'API Architecture': {
    atoms: [
      { element: 'API', position: [0, 0, 0] as [number, number, number], color: '#2196f3', size: 0.8, label: 'API Gateway' },
      { element: 'REST', position: [2, 0, 0] as [number, number, number], color: '#4caf50', size: 0.6, label: 'REST' },
      { element: 'JSON', position: [0, 2, 0] as [number, number, number], color: '#ff9800', size: 0.5, label: 'JSON' },
      { element: 'HTTP', position: [-2, 0, 0] as [number, number, number], color: '#f44336', size: 0.6, label: 'HTTP' },
      { element: 'Auth', position: [0, -2, 0] as [number, number, number], color: '#9c27b0', size: 0.5, label: 'Auth' },
      { element: 'DB', position: [0, 0, 2] as [number, number, number], color: '#795548', size: 0.7, label: 'Database' },
      { element: 'Cache', position: [1, 1, -1] as [number, number, number], color: '#607d8b', size: 0.4, label: 'Cache' },
    ],
    bonds: [
      { from: 0, to: 1, strength: 1.5 },
      { from: 0, to: 2, strength: 1 },
      { from: 0, to: 3, strength: 1.5 },
      { from: 0, to: 4, strength: 1 },
      { from: 0, to: 5, strength: 2 },
      { from: 0, to: 6, strength: 0.8 },
      { from: 1, to: 2, strength: 1 },
    ]
  },
  'Neural Network': {
    atoms: [
      { element: 'Input', position: [-3, 0, 0] as [number, number, number], color: '#4caf50', size: 0.6, label: 'Input Layer' },
      { element: 'Hidden1', position: [-1, 1, 0] as [number, number, number], color: '#2196f3', size: 0.5, label: 'Hidden 1' },
      { element: 'Hidden2', position: [-1, -1, 0] as [number, number, number], color: '#2196f3', size: 0.5, label: 'Hidden 2' },
      { element: 'Hidden3', position: [1, 1, 0] as [number, number, number], color: '#2196f3', size: 0.5, label: 'Hidden 3' },
      { element: 'Hidden4', position: [1, -1, 0] as [number, number, number], color: '#2196f3', size: 0.5, label: 'Hidden 4' },
      { element: 'Output', position: [3, 0, 0] as [number, number, number], color: '#f44336', size: 0.6, label: 'Output Layer' },
      { element: 'Bias', position: [0, 2, 0] as [number, number, number], color: '#ff9800', size: 0.4, label: 'Bias' },
    ],
    bonds: [
      { from: 0, to: 1, strength: 0.8 },
      { from: 0, to: 2, strength: 0.8 },
      { from: 1, to: 3, strength: 0.6 },
      { from: 1, to: 4, strength: 0.6 },
      { from: 2, to: 3, strength: 0.6 },
      { from: 2, to: 4, strength: 0.6 },
      { from: 3, to: 5, strength: 0.8 },
      { from: 4, to: 5, strength: 0.8 },
      { from: 6, to: 1, strength: 0.4 },
      { from: 6, to: 2, strength: 0.4 },
    ]
  },
};

interface AtomComponentProps {
  atom: Atom;
  index: number;
  onClick: (index: number) => void;
  isHovered: boolean;
}

function AtomComponent({ atom, index, onClick, isHovered }: AtomComponentProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle pulsing animation
      meshRef.current.scale.setScalar(atom.size + Math.sin(time * 2 + index) * 0.1);
      
      // Hover effect
      if (isHovered) {
        meshRef.current.scale.setScalar(atom.size * 1.5);
      }
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={atom.position}
        onClick={() => onClick(index)}
        onPointerEnter={(e) => e.stopPropagation()}
      >
        <sphereGeometry args={[atom.size, 16, 16]} />
        <meshStandardMaterial
          color={atom.color}
          emissive={atom.color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {isHovered && (
        <Html position={[atom.position[0], atom.position[1] + 1, atom.position[2]]} center>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap border border-cyan-500/50">
            {atom.label}
          </div>
        </Html>
      )}
    </group>
  );
}

interface BondComponentProps {
  bond: Bond;
  atoms: Atom[];
}

function BondComponent({ bond, atoms }: BondComponentProps) {
  const points = [
    new THREE.Vector3(...atoms[bond.from].position),
    new THREE.Vector3(...atoms[bond.to].position),
  ];
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial 
        attach="material" 
        color="#ffffff" 
        opacity={bond.strength} 
        transparent 
        linewidth={2}
      />
    </line>
  );
}

function MoleculeScene({ moleculeName }: { moleculeName: keyof typeof codeMolecules }) {
  const [hoveredAtom, setHoveredAtom] = useState<number | null>(null);
  const molecule = codeMolecules[moleculeName];

  const handleAtomClick = (index: number) => {
    setHoveredAtom(hoveredAtom === index ? null : index);
  };

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} color="#61dafb" intensity={0.5} />

      {/* Atoms */}
      {molecule.atoms.map((atom, index) => (
        <AtomComponent
          key={index}
          atom={atom}
          index={index}
          onClick={handleAtomClick}
          isHovered={hoveredAtom === index}
        />
      ))}

      {/* Bonds */}
      {molecule.bonds.map((bond, index) => (
        <BondComponent key={index} bond={bond} atoms={molecule.atoms} />
      ))}
    </group>
  );
}

export default function MolecularCode() {
  const [currentMolecule, setCurrentMolecule] = useState<keyof typeof codeMolecules>('React Component');
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="w-full h-96 lg:h-[500px] bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden relative border border-cyan-500/30">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <MoleculeScene moleculeName={currentMolecule} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <select
          value={currentMolecule}
          onChange={(e) => setCurrentMolecule(e.target.value as keyof typeof codeMolecules)}
          className="px-3 py-1 bg-gray-900/90 text-cyan-400 rounded-lg text-sm border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          {Object.keys(codeMolecules).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm transition-colors"
        >
          {showInfo ? '🙈 Hide Info' : '👁️ Show Info'}
        </button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div 
          className="absolute bottom-4 left-4 right-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h3 className="text-cyan-400 font-semibold">Code Molecule: {currentMolecule}</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>🖱️ <strong>Click atoms</strong> to see component details</p>
              <p>🔄 <strong>Drag to rotate</strong> • 🔍 <strong>Scroll to zoom</strong></p>
              <p>⚛️ Visualizing software architecture as molecular structures</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}