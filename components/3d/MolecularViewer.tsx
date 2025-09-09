'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Atom {
  element: string;
  position: [number, number, number];
}

interface Molecule {
  name: string;
  atoms: Atom[];
  bonds: [number, number][];
}

const molecules: Molecule[] = [
  {
    name: 'Caffeine',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'C', position: [1.4, 0, 0] },
      { element: 'N', position: [2.1, 1.2, 0] },
      { element: 'C', position: [1.4, 2.4, 0] },
      { element: 'N', position: [0, 2.4, 0] },
      { element: 'C', position: [-0.7, 1.2, 0] },
      { element: 'O', position: [-2.1, 1.2, 0] },
      { element: 'N', position: [-0.7, -1.2, 0] },
      { element: 'C', position: [-2.1, -1.2, 0] },
      { element: 'C', position: [2.1, 3.6, 0] },
      { element: 'O', position: [1.4, 4.8, 0] },
      { element: 'N', position: [3.5, 3.6, 0] },
      { element: 'C', position: [4.2, 2.4, 0] },
      { element: 'C', position: [3.5, 1.2, 0] }
    ],
    bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,6], [0,7], [7,8], [3,9], [9,10], [9,11], [11,12], [12,13], [13,2]]
  },
  {
    name: 'Aspirin',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'C', position: [1.4, 0, 0] },
      { element: 'C', position: [2.1, 1.2, 0] },
      { element: 'C', position: [1.4, 2.4, 0] },
      { element: 'C', position: [0, 2.4, 0] },
      { element: 'C', position: [-0.7, 1.2, 0] },
      { element: 'O', position: [-2.1, 1.2, 0] },
      { element: 'C', position: [-2.8, 0, 0] },
      { element: 'O', position: [-4.2, 0, 0] },
      { element: 'C', position: [-2.1, -1.2, 0] },
      { element: 'O', position: [2.1, 3.6, 0] },
      { element: 'H', position: [2.8, 3.6, 0] }
    ],
    bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,6], [6,7], [7,8], [7,9], [3,10], [10,11]]
  },
  {
    name: 'Glucose',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'C', position: [1.4, 0, 0.5] },
      { element: 'C', position: [2.1, 1.2, 0] },
      { element: 'C', position: [1.4, 2.4, 0.5] },
      { element: 'C', position: [0, 2.4, 1] },
      { element: 'O', position: [-0.7, 1.2, 0.5] },
      { element: 'O', position: [-0.7, -1.2, 0] },
      { element: 'O', position: [2.8, 0, 0.5] },
      { element: 'O', position: [3.5, 1.2, 0] },
      { element: 'O', position: [2.1, 3.6, 0.5] },
      { element: 'C', position: [-0.7, 3.6, 1] }
    ],
    bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,6], [1,7], [2,8], [3,9], [4,10]]
  },
  {
    name: 'Ethanol',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'C', position: [1.4, 0, 0] },
      { element: 'O', position: [2.1, 1.2, 0] },
      { element: 'H', position: [2.8, 1.2, 0.7] },
      { element: 'H', position: [-0.7, 0.9, 0] },
      { element: 'H', position: [-0.7, -0.9, 0] },
      { element: 'H', position: [-0.7, 0, 0.9] },
      { element: 'H', position: [1.4, -0.9, 0.7] },
      { element: 'H', position: [1.4, -0.9, -0.7] }
    ],
    bonds: [[0,1], [1,2], [2,3], [0,4], [0,5], [0,6], [1,7], [1,8]]
  }
];

const atomColors: { [key: string]: number } = {
  H: 0xFFFFFF,  // White
  C: 0x909090,  // Gray
  N: 0x3050F8,  // Blue
  O: 0xFF0D0D,  // Red
  S: 0xFFFF30,  // Yellow
  P: 0xFF8000,  // Orange
};

const atomSizes: { [key: string]: number } = {
  H: 0.5,
  C: 0.7,
  N: 0.65,
  O: 0.6,
  S: 1.0,
  P: 1.0,
};

export default function MolecularViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const moleculeGroupRef = useRef<THREE.Group>();
  const animationIdRef = useRef<number>();
  const [currentMolecule, setCurrentMolecule] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x00ff88, 0.4);
    directionalLight2.position.set(-10, -10, -5);
    scene.add(directionalLight2);

    // Load initial molecule
    loadMolecule(molecules[0]);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (moleculeGroupRef.current) {
        moleculeGroupRef.current.rotation.y += 0.005;
        moleculeGroupRef.current.rotation.x += 0.002;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const loadMolecule = (molecule: Molecule) => {
    if (!sceneRef.current) return;

    // Remove existing molecule
    if (moleculeGroupRef.current) {
      sceneRef.current.remove(moleculeGroupRef.current);
      moleculeGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    // Create new molecule group
    const moleculeGroup = new THREE.Group();
    moleculeGroupRef.current = moleculeGroup;

    // Create atoms
    molecule.atoms.forEach((atom, index) => {
      const color = atomColors[atom.element] || 0x888888;
      const size = atomSizes[atom.element] || 0.7;
      
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color,
        shininess: 100,
        specular: 0x222222
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(...atom.position);
      moleculeGroup.add(sphere);
    });

    // Create bonds
    molecule.bonds.forEach(([startIdx, endIdx]) => {
      const startAtom = molecule.atoms[startIdx];
      const endAtom = molecule.atoms[endIdx];
      
      const start = new THREE.Vector3(...startAtom.position);
      const end = new THREE.Vector3(...endAtom.position);
      const direction = end.clone().sub(start);
      const length = direction.length();
      
      const geometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x666666,
        shininess: 50 
      });
      
      const bond = new THREE.Mesh(geometry, material);
      bond.position.copy(start.clone().add(direction.clone().multiplyScalar(0.5)));
      
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
      );
      bond.quaternion.copy(quaternion);
      
      moleculeGroup.add(bond);
    });

    // Center the molecule
    const box = new THREE.Box3().setFromObject(moleculeGroup);
    const center = box.getCenter(new THREE.Vector3());
    moleculeGroup.position.sub(center);

    sceneRef.current.add(moleculeGroup);
  };

  const nextMolecule = () => {
    const next = (currentMolecule + 1) % molecules.length;
    setCurrentMolecule(next);
    loadMolecule(molecules[next]);
  };

  const prevMolecule = () => {
    const prev = currentMolecule === 0 ? molecules.length - 1 : currentMolecule - 1;
    setCurrentMolecule(prev);
    loadMolecule(molecules[prev]);
  };

  return (
    <div className="w-full h-[500px] relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-700">
      <div
        ref={mountRef}
        className="w-full h-full"
      />
      
      {/* Molecule info overlay */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
        <h3 className="font-bold text-lg text-cyan-400">{molecules[currentMolecule].name}</h3>
        <p className="text-sm text-gray-300">
          Atoms: {molecules[currentMolecule].atoms.length}
        </p>
        <p className="text-sm text-gray-300">
          Bonds: {molecules[currentMolecule].bonds.length}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <button
          onClick={prevMolecule}
          className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 rounded-lg transition-colors cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={nextMolecule}
          className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 rounded-lg transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-400">
        Auto-rotating • Click buttons to switch molecules
      </div>
    </div>
  );
}