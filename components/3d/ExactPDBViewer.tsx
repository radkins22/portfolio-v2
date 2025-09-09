'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export default function ExactPDBViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMolecule, setCurrentMolecule] = useState('caffeine.pdb');
  const [showInfo, setShowInfo] = useState(true);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    labelRenderer: unknown;
    controls: unknown;
    root: THREE.Group;
    cleanup: () => void;
  } | null>(null);

  const MOLECULES = {
    'Ethanol': 'ethanol.pdb',
    'Aspirin': 'aspirin.pdb', 
    'Caffeine': 'caffeine.pdb',
    'Nicotine': 'nicotine.pdb',
    'LSD': 'lsd.pdb',
    'Cocaine': 'cocaine.pdb',
    'Cholesterol': 'cholesterol.pdb',
    'Lycopene': 'lycopene.pdb',
    'Glucose': 'glucose.pdb',
    'Aluminium oxide': 'Al2O3.pdb',
    'Cubane': 'cubane.pdb',
    'Copper': 'cu.pdb',
    'Fluorite': 'caf2.pdb',
    'Salt': 'nacl.pdb',
    'YBCO superconductor': 'ybco.pdb',
    'Buckyball': 'buckyball.pdb',
    'Graphite': 'graphite.pdb'
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const initViewer = async () => {
      // Import the required modules
      const { TrackballControls } = await import('three/examples/jsm/controls/TrackballControls.js');
      const { PDBLoader } = await import('three/examples/jsm/loaders/PDBLoader.js');
      const { CSS2DRenderer, CSS2DObject } = await import('three/examples/jsm/renderers/CSS2DRenderer.js');

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050505);

      // Camera
      const camera = new THREE.PerspectiveCamera(
        70, 
        containerRef.current!.clientWidth / containerRef.current!.clientHeight, 
        1, 
        5000
      );
      camera.position.z = 1000;
      scene.add(camera);

      // Lighting - exact same as original
      const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
      light1.position.set(1, 1, 1);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
      light2.position.set(-1, -1, 1);
      scene.add(light2);

      // Root group for molecules
      const root = new THREE.Group();
      scene.add(root);

      // WebGL Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight);
      containerRef.current!.appendChild(renderer.domElement);

      // CSS2D Label Renderer
      const labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight);
      labelRenderer.domElement.style.position = 'absolute';
      labelRenderer.domElement.style.top = '0px';
      labelRenderer.domElement.style.pointerEvents = 'none';
      containerRef.current!.appendChild(labelRenderer.domElement);

      // Controls - exact same settings
      const controls = new TrackballControls(camera, renderer.domElement);
      controls.minDistance = 500;
      controls.maxDistance = 2000;

      // PDB Loader
      const loader = new PDBLoader();
      const offset = new THREE.Vector3();

      // Animation loop - exact same as original
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();

        const time = Date.now() * 0.0004;
        root.rotation.x = time;
        root.rotation.y = time * 0.7;

        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
      };

      // Store loadMolecule in scope for initial load
      const loadMoleculeInit = (model: string) => {
        const url = `/models/pdb/${model}`;

        // Clear ALL existing objects (except lights and camera)
        while (root.children.length > 0) {
          const child = root.children[0];
          root.remove(child);
          
          // Dispose of geometries and materials to prevent memory leaks
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
          
          // Handle CSS2D objects
          const childWithElement = child as unknown as Record<string, unknown>;
          const element = childWithElement.element as unknown;
          const elementWithParent = element as Record<string, unknown>;
          if (element && elementWithParent.parentNode) {
            (elementWithParent.parentNode as unknown as { removeChild: (child: unknown) => void }).removeChild(element);
          }
        }

        loader.load(url, (pdb: unknown) => {
          const pdbData = pdb as Record<string, unknown>;
          const geometryAtoms = pdbData.geometryAtoms as THREE.BufferGeometry;
          const geometryBonds = pdbData.geometryBonds as THREE.BufferGeometry;
          const json = pdbData.json as { atoms: Array<Array<unknown>> };

          const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
          const sphereGeometry = new THREE.IcosahedronGeometry(1, 3);

          geometryAtoms.computeBoundingBox();
          geometryAtoms.boundingBox!.getCenter(offset).negate();

          geometryAtoms.translate(offset.x, offset.y, offset.z);
          geometryBonds.translate(offset.x, offset.y, offset.z);

          // Create atoms - exact same as original
          let positions = geometryAtoms.getAttribute('position');
          const colors = geometryAtoms.getAttribute('color');

          const position = new THREE.Vector3();
          const color = new THREE.Color();

          for (let i = 0; i < positions.count; i++) {
            position.x = positions.getX(i);
            position.y = positions.getY(i);
            position.z = positions.getZ(i);

            color.r = colors.getX(i);
            color.g = colors.getY(i);
            color.b = colors.getZ(i);

            const material = new THREE.MeshPhongMaterial({ color: color });
            const object = new THREE.Mesh(sphereGeometry, material);
            object.position.copy(position);
            object.position.multiplyScalar(75);
            object.scale.multiplyScalar(25);
            root.add(object);

            // Create labels - exact same as original
            const atom = json.atoms[i] as unknown[];
            const text = document.createElement('div');
            text.className = 'label';
            text.style.color = `rgb(${(atom[3] as number[])[0]},${(atom[3] as number[])[1]},${(atom[3] as number[])[2]})`;
            text.style.textShadow = '-1px 1px 1px rgb(0,0,0)';
            text.style.marginLeft = '25px';
            text.style.fontSize = '20px';
            text.textContent = atom[4] as string;

            const label = new CSS2DObject(text);
            label.position.copy(object.position);
            root.add(label);
          }

          // Create bonds - exact same as original
          positions = geometryBonds.getAttribute('position');
          const start = new THREE.Vector3();
          const end = new THREE.Vector3();

          for (let i = 0; i < positions.count; i += 2) {
            start.x = positions.getX(i);
            start.y = positions.getY(i);
            start.z = positions.getZ(i);

            end.x = positions.getX(i + 1);
            end.y = positions.getY(i + 1);
            end.z = positions.getZ(i + 1);

            start.multiplyScalar(75);
            end.multiplyScalar(75);

            const object = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
            object.position.copy(start);
            object.position.lerp(end, 0.5);
            object.scale.set(5, 5, start.distanceTo(end));
            object.lookAt(end);
            root.add(object);
          }
        }, undefined, (error) => {
          console.error('Error loading initial PDB file:', error);
        });
      };

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return;
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        labelRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      // Store references
      sceneRef.current = {
        scene,
        camera,
        renderer,
        labelRenderer,
        controls,
        root,
        cleanup: () => {
          window.removeEventListener('resize', handleResize);
          controls.dispose();
          renderer.dispose();
          if (containerRef.current) {
            if (renderer.domElement.parentNode) {
              containerRef.current.removeChild(renderer.domElement);
            }
            if (labelRenderer.domElement.parentNode) {
              containerRef.current.removeChild(labelRenderer.domElement);
            }
          }
        }
      };

      // Start animation and load initial molecule
      animate();
      loadMoleculeInit(currentMolecule);
    };

    initViewer().catch(console.error);

    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup();
      }
    };
  }, []);

  // Load new molecule when selection changes
  useEffect(() => {
    if (sceneRef.current) {
      loadMolecule(currentMolecule);
    }
  }, [currentMolecule]);

  const loadMolecule = async (model: string) => {
    if (!sceneRef.current) return;

    const { PDBLoader } = await import('three/examples/jsm/loaders/PDBLoader.js');
    const { CSS2DObject } = await import('three/examples/jsm/renderers/CSS2DRenderer.js');
    
    const url = `/models/pdb/${model}`;
    const loader = new PDBLoader();
    const offset = new THREE.Vector3();
    const root = sceneRef.current.root;

    // Clear ALL existing objects (except lights and camera)
    while (root.children.length > 0) {
      const child = root.children[0];
      root.remove(child);
      
      // Dispose of geometries and materials to prevent memory leaks
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
      
      // Handle CSS2D objects
      const childWithElement = child as unknown as Record<string, unknown>;
      const element = childWithElement.element as unknown;
      const elementWithParent = element as Record<string, unknown>;
      if (element && elementWithParent.parentNode) {
        (elementWithParent.parentNode as unknown as { removeChild: (child: unknown) => void }).removeChild(element);
      }
    }

    loader.load(url, (pdb: unknown) => {
      const pdbData = pdb as Record<string, unknown>;
      const geometryAtoms = pdbData.geometryAtoms as THREE.BufferGeometry;
      const geometryBonds = pdbData.geometryBonds as THREE.BufferGeometry;
      const json = pdbData.json as { atoms: Array<Array<unknown>> };

      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const sphereGeometry = new THREE.IcosahedronGeometry(1, 3);

      geometryAtoms.computeBoundingBox();
      geometryAtoms.boundingBox!.getCenter(offset).negate();

      geometryAtoms.translate(offset.x, offset.y, offset.z);
      geometryBonds.translate(offset.x, offset.y, offset.z);

      // Create atoms
      let positions = geometryAtoms.getAttribute('position');
      const colors = geometryAtoms.getAttribute('color');

      const position = new THREE.Vector3();
      const color = new THREE.Color();

      for (let i = 0; i < positions.count; i++) {
        position.x = positions.getX(i);
        position.y = positions.getY(i);
        position.z = positions.getZ(i);

        color.r = colors.getX(i);
        color.g = colors.getY(i);
        color.b = colors.getZ(i);

        const material = new THREE.MeshPhongMaterial({ color: color });
        const object = new THREE.Mesh(sphereGeometry, material);
        object.position.copy(position);
        object.position.multiplyScalar(75);
        object.scale.multiplyScalar(25);
        root.add(object);

        // Create labels
        const atom = json.atoms[i] as unknown[];
        const text = document.createElement('div');
        text.className = 'label';
        text.style.color = `rgb(${(atom[3] as number[])[0]},${(atom[3] as number[])[1]},${(atom[3] as number[])[2]})`;
        text.style.textShadow = '-1px 1px 1px rgb(0,0,0)';
        text.style.marginLeft = '25px';
        text.style.fontSize = '20px';
        text.textContent = atom[4] as string;

        const label = new CSS2DObject(text);
        label.position.copy(object.position);
        root.add(label);
      }

      // Create bonds
      positions = geometryBonds.getAttribute('position');
      const start = new THREE.Vector3();
      const end = new THREE.Vector3();

      for (let i = 0; i < positions.count; i += 2) {
        start.x = positions.getX(i);
        start.y = positions.getY(i);
        start.z = positions.getZ(i);

        end.x = positions.getX(i + 1);
        end.y = positions.getY(i + 1);
        end.z = positions.getZ(i + 1);

        start.multiplyScalar(75);
        end.multiplyScalar(75);

        const object = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
        object.position.copy(start);
        object.position.lerp(end, 0.5);
        object.scale.set(5, 5, start.distanceTo(end));
        object.lookAt(end);
        root.add(object);
      }
    }, undefined, (error) => {
      console.error('Error loading PDB file:', error);
    });
  };

  return (
    <div className="w-full h-96 lg:h-[500px] bg-black rounded-xl overflow-hidden relative border border-cyan-500/30">
      <div ref={containerRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <select
          value={currentMolecule}
          onChange={(e) => setCurrentMolecule(e.target.value)}
          className="px-3 py-1 bg-gray-900/90 text-cyan-400 rounded-lg text-sm border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          {Object.entries(MOLECULES).map(([name, file]) => (
            <option key={file} value={file}>{name}</option>
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
          className="absolute bottom-4 left-4 right-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h3 className="text-cyan-400 font-semibold">Three.js PDB Molecular Viewer</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>🖱️ <strong>Drag</strong> to rotate • 🔍 <strong>Scroll</strong> to zoom • 🎯 <strong>Right-drag</strong> to pan</p>
              <p>⚛️ Exact replica of Three.js webgl_loader_pdb.html example</p>
              <p>🧬 Viewing: {Object.keys(MOLECULES)[Object.values(MOLECULES).indexOf(currentMolecule as string)]}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}