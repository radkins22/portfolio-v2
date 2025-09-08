'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Define molecule structures similar to the original PDB data
const molecules = {
  'Ethanol': {
    atoms: [
      { element: 'C', x: 0.0, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: 1.54, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'O', x: -0.78, y: 1.08, z: 0.0, color: 0xff0000 },
      { element: 'H', x: 0.0, y: -0.63, z: 0.89, color: 0xffffff },
      { element: 'H', x: 0.0, y: -0.63, z: -0.89, color: 0xffffff },
      { element: 'H', x: 1.54, y: 0.63, z: 0.89, color: 0xffffff },
      { element: 'H', x: 1.54, y: 0.63, z: -0.89, color: 0xffffff },
      { element: 'H', x: 2.32, y: -0.63, z: 0.0, color: 0xffffff },
      { element: 'H', x: -0.78, y: 1.42, z: 0.89, color: 0xffffff }
    ],
    bonds: [
      [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [1, 7], [2, 8]
    ]
  },
  'Caffeine': {
    atoms: [
      { element: 'N', x: 1.19, y: 0.75, z: 0.0, color: 0x3050f8 },
      { element: 'C', x: 0.0, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: -1.19, y: 0.75, z: 0.0, color: 0x909090 },
      { element: 'N', x: -1.19, y: 2.25, z: 0.0, color: 0x3050f8 },
      { element: 'C', x: 0.0, y: 3.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: 1.19, y: 2.25, z: 0.0, color: 0x909090 },
      { element: 'O', x: 0.0, y: 4.5, z: 0.0, color: 0xff0000 },
      { element: 'N', x: 2.38, y: 3.0, z: 0.0, color: 0x3050f8 },
      { element: 'C', x: 2.38, y: 1.5, z: 0.0, color: 0x909090 },
      { element: 'N', x: 3.57, y: 0.75, z: 0.0, color: 0x3050f8 },
      { element: 'C', x: 3.57, y: 4.5, z: 0.0, color: 0x909090 },
      { element: 'C', x: -2.38, y: 3.0, z: 0.0, color: 0x909090 }
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [4, 6], [5, 7], [7, 8], [8, 0], [8, 9], [7, 10], [3, 11]
    ]
  },
  'Aspirin': {
    atoms: [
      { element: 'C', x: 0.0, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: 1.4, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: 2.1, y: 1.215, z: 0.0, color: 0x909090 },
      { element: 'C', x: 1.4, y: 2.43, z: 0.0, color: 0x909090 },
      { element: 'C', x: 0.0, y: 2.43, z: 0.0, color: 0x909090 },
      { element: 'C', x: -0.7, y: 1.215, z: 0.0, color: 0x909090 },
      { element: 'O', x: -0.7, y: -1.215, z: 0.0, color: 0xff0000 },
      { element: 'C', x: -2.1, y: -1.215, z: 0.0, color: 0x909090 },
      { element: 'O', x: -2.8, y: -2.43, z: 0.0, color: 0xff0000 },
      { element: 'C', x: -2.8, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'O', x: 2.1, y: 3.645, z: 0.0, color: 0xff0000 }
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [0, 6], [6, 7], [7, 8], [7, 9], [3, 10]
    ]
  },
  'Nicotine': {
    atoms: [
      { element: 'C', x: 0.0, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: 1.4, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: 2.1, y: 1.215, z: 0.0, color: 0x909090 },
      { element: 'N', x: 1.4, y: 2.43, z: 0.0, color: 0x3050f8 },
      { element: 'C', x: 0.0, y: 2.43, z: 0.0, color: 0x909090 },
      { element: 'N', x: -0.7, y: 1.215, z: 0.0, color: 0x3050f8 },
      { element: 'C', x: -2.1, y: 1.215, z: 0.0, color: 0x909090 },
      { element: 'C', x: -2.8, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: -2.1, y: -1.215, z: 0.0, color: 0x909090 },
      { element: 'C', x: -0.7, y: -1.215, z: 0.0, color: 0x909090 }
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [5, 6], [6, 7], [7, 8], [8, 9], [9, 0]
    ]
  },
  'Cocaine': {
    atoms: [
      { element: 'N', x: 0.0, y: 0.0, z: 0.0, color: 0x3050f8 },
      { element: 'C', x: 1.4, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: 2.1, y: 1.215, z: 0.0, color: 0x909090 },
      { element: 'C', x: 1.4, y: 2.43, z: 0.0, color: 0x909090 },
      { element: 'C', x: 0.0, y: 2.43, z: 0.0, color: 0x909090 },
      { element: 'C', x: -0.7, y: 1.215, z: 0.0, color: 0x909090 },
      { element: 'C', x: 3.5, y: 1.215, z: 0.0, color: 0x909090 },
      { element: 'O', x: 4.2, y: 2.43, z: 0.0, color: 0xff0000 },
      { element: 'O', x: 4.2, y: 0.0, z: 0.0, color: 0xff0000 },
      { element: 'C', x: 5.6, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: -1.4, y: -1.215, z: 0.0, color: 0x909090 }
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [2, 6], [6, 7], [6, 8], [8, 9], [0, 10]
    ]
  },
  'LSD': {
    atoms: [
      { element: 'C', x: 0.0, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: 1.4, y: 0.0, z: 0.0, color: 0x909090 },
      { element: 'C', x: 2.1, y: 1.215, z: 0.0, color: 0x909090 },
      { element: 'C', x: 1.4, y: 2.43, z: 0.0, color: 0x909090 },
      { element: 'C', x: 0.0, y: 2.43, z: 0.0, color: 0x909090 },
      { element: 'C', x: -0.7, y: 1.215, z: 0.0, color: 0x909090 },
      { element: 'N', x: 3.5, y: 1.215, z: 0.0, color: 0x3050f8 },
      { element: 'C', x: 4.2, y: 2.43, z: 0.0, color: 0x909090 },
      { element: 'C', x: 3.5, y: 3.645, z: 0.0, color: 0x909090 },
      { element: 'C', x: 2.1, y: 3.645, z: 0.0, color: 0x909090 },
      { element: 'N', x: 1.4, y: 4.86, z: 0.0, color: 0x3050f8 },
      { element: 'C', x: 0.0, y: 4.86, z: 0.0, color: 0x909090 }
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [2, 6], [6, 7], [7, 8], [8, 9], [9, 3], [9, 10], [10, 11]
    ]
  }
};

const atomColors: { [key: string]: number } = {
  'H': 0xffffff,
  'C': 0x909090,
  'N': 0x3050f8,
  'O': 0xff0000,
  'F': 0x90e050,
  'Cl': 0x1ff01f,
  'Br': 0xa62929,
  'I': 0x940094,
  'He': 0xd9ffff,
  'Ne': 0xb3e3f5,
  'Ar': 0x80d1e3,
  'Xe': 0x429eb0,
  'Kr': 0x5cb8d1,
  'P': 0xff8000,
  'S': 0xffff30,
  'B': 0xffb5b5,
  'Li': 0xcc80ff,
  'Na': 0xab5cf2,
  'K': 0x8f40d4,
  'Rb': 0x702eb0,
  'Cs': 0x57178f,
  'Fr': 0x420066,
  'Be': 0xc2ff00,
  'Mg': 0x8aff00,
  'Ca': 0x3dff00,
  'Sr': 0x00ff00,
  'Ba': 0x00d900,
  'Ra': 0x00cc00,
  'Ti': 0xbfc2c7,
  'Fe': 0xe06633,
  'default': 0xff1493
};

const atomRadii: { [key: string]: number } = {
  'H': 0.31,
  'C': 0.70,
  'N': 0.65,
  'O': 0.60,
  'F': 0.50,
  'Cl': 1.00,
  'Br': 1.20,
  'I': 1.40,
  'P': 1.00,
  'S': 1.00,
  'default': 0.60
};

export default function PDBViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentMolecule, setCurrentMolecule] = useState<string>('Caffeine');
  const [showInfo, setShowInfo] = useState(true);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: any;
    cleanup: () => void;
  }>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      70,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      1,
      5000
    );
    camera.position.set(0, 0, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Import TrackballControls dynamically
    const initControls = async () => {
      const { TrackballControls } = await import('three/examples/jsm/controls/TrackballControls.js');
      
      const controls = new TrackballControls(camera, renderer.domElement);
      controls.rotateSpeed = 1.0;
      controls.zoomSpeed = 1.2;
      controls.panSpeed = 0.8;
      controls.keys = ['KeyA', 'KeyS', 'KeyD'];

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      sceneRef.current = {
        scene,
        camera,
        renderer,
        controls,
        cleanup: () => {
          renderer.dispose();
          controls.dispose();
          if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
          }
        }
      };

      loadMolecule(currentMolecule);
    };

    initControls();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return;
      
      const { camera, renderer } = sceneRef.current;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        sceneRef.current.cleanup();
      }
    };
  }, []);

  const loadMolecule = (moleculeName: string) => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;
    
    // Clear existing objects
    const objectsToRemove = scene.children.filter(child => 
      child.type === 'Mesh' || child.type === 'Line'
    );
    objectsToRemove.forEach(obj => scene.remove(obj));

    const molecule = molecules[moleculeName as keyof typeof molecules];
    if (!molecule) return;

    const atomGroup = new THREE.Group();
    const bondGroup = new THREE.Group();

    // Create atoms
    molecule.atoms.forEach((atom, index) => {
      const radius = atomRadii[atom.element] || atomRadii.default;
      const geometry = new THREE.SphereGeometry(radius, 16, 16);
      const material = new THREE.MeshLambertMaterial({
        color: atom.color || atomColors[atom.element] || atomColors.default
      });
      
      const atomMesh = new THREE.Mesh(geometry, material);
      atomMesh.position.set(atom.x, atom.y, atom.z);
      atomMesh.userData = { element: atom.element, index };
      
      atomGroup.add(atomMesh);
    });

    // Create bonds
    molecule.bonds.forEach(bond => {
      const atom1 = molecule.atoms[bond[0]];
      const atom2 = molecule.atoms[bond[1]];
      
      const start = new THREE.Vector3(atom1.x, atom1.y, atom1.z);
      const end = new THREE.Vector3(atom2.x, atom2.y, atom2.z);
      
      const geometry = new THREE.CylinderGeometry(0.1, 0.1, start.distanceTo(end), 8);
      const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      
      const bondMesh = new THREE.Mesh(geometry, material);
      bondMesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      bondMesh.lookAt(end);
      bondMesh.rotateX(Math.PI / 2);
      
      bondGroup.add(bondMesh);
    });

    scene.add(atomGroup);
    scene.add(bondGroup);

    // Center and scale molecule
    const box = new THREE.Box3();
    box.setFromObject(atomGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 10 / maxDim;

    atomGroup.position.sub(center);
    bondGroup.position.sub(center);
    atomGroup.scale.setScalar(scale);
    bondGroup.scale.setScalar(scale);
  };

  useEffect(() => {
    loadMolecule(currentMolecule);
  }, [currentMolecule]);

  return (
    <div className="w-full h-96 lg:h-[500px] bg-black rounded-xl overflow-hidden relative border border-cyan-500/30">
      <div ref={mountRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <select
          value={currentMolecule}
          onChange={(e) => setCurrentMolecule(e.target.value)}
          className="px-3 py-1 bg-gray-900/90 text-cyan-400 rounded-lg text-sm border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          {Object.keys(molecules).map((name) => (
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
              <h3 className="text-cyan-400 font-semibold">Molecule: {currentMolecule}</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>🖱️ <strong>Click & drag</strong> to rotate molecule</p>
              <p>🔍 <strong>Scroll</strong> to zoom • 🎯 <strong>Right-click & drag</strong> to pan</p>
              <p>⚛️ Interactive 3D molecular visualization using Three.js</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}