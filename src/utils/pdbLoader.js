import * as THREE from 'three';

const atomColors = {
  H: 0xFFFFFF,
  C: 0x909090,
  N: 0x3050F8,
  O: 0xFF0D0D,
  F: 0x90E050,
  S: 0xFFFF30,
  Cl: 0x1FF01F,
  P: 0xFF8000,
  Fe: 0xE06633,
  Cu: 0xC88033,
  Al: 0xBFA6A6,
  Y: 0x94FFFF,
  Ca: 0x3DFF00,
  Na: 0xAB5CF2,
  default: 0xDA70D6
};

const atomSizes = {
  H: 0.25,
  C: 0.7,
  N: 0.65,
  O: 0.6,
  F: 0.5,
  S: 1.0,
  Cl: 1.0,
  P: 1.0,
  Fe: 1.25,
  Cu: 1.35,
  Al: 1.43,
  Y: 1.8,
  Ca: 1.97,
  Na: 1.66,
  default: 0.7
};

export class PDBLoader {
  constructor() {
    this.atoms = [];
    this.bonds = [];
  }

  async load(url) {
    const response = await fetch(url);
    const text = await response.text();
    return this.parse(text);
  }

  parse(pdbText) {
    const lines = pdbText.split('\n');
    this.atoms = [];
    this.bonds = [];
    
    lines.forEach(line => {
      if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
        const atom = {
          x: parseFloat(line.substring(30, 38)),
          y: parseFloat(line.substring(38, 46)),
          z: parseFloat(line.substring(46, 54)),
          element: line.substring(76, 78).trim() || line.substring(12, 16).trim()[0]
        };
        this.atoms.push(atom);
      } else if (line.startsWith('CONECT')) {
        const indices = line.substring(6).trim().split(/\s+/).map(n => parseInt(n) - 1);
        const fromIndex = indices[0];
        for (let i = 1; i < indices.length; i++) {
          if (!isNaN(indices[i])) {
            this.bonds.push([fromIndex, indices[i]]);
          }
        }
      }
    });

    // Auto-generate bonds if none specified
    if (this.bonds.length === 0) {
      this.generateBonds();
    }

    return { atoms: this.atoms, bonds: this.bonds };
  }

  generateBonds() {
    const maxBondLength = 1.9;
    
    for (let i = 0; i < this.atoms.length; i++) {
      for (let j = i + 1; j < this.atoms.length; j++) {
        const atom1 = this.atoms[i];
        const atom2 = this.atoms[j];
        const distance = Math.sqrt(
          Math.pow(atom2.x - atom1.x, 2) +
          Math.pow(atom2.y - atom1.y, 2) +
          Math.pow(atom2.z - atom1.z, 2)
        );
        
        if (distance < maxBondLength) {
          this.bonds.push([i, j]);
        }
      }
    }
  }

  createMoleculeGroup(data) {
    const group = new THREE.Group();
    
    // Create atoms
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
    
    data.atoms.forEach(atom => {
      const color = atomColors[atom.element] || atomColors.default;
      const size = atomSizes[atom.element] || atomSizes.default;
      
      const material = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 100,
        specular: 0x222222
      });
      
      const mesh = new THREE.Mesh(sphereGeometry, material);
      mesh.position.set(atom.x, atom.y, atom.z);
      mesh.scale.setScalar(size);
      group.add(mesh);
    });
    
    // Create bonds
    const bondMaterial = new THREE.MeshPhongMaterial({
      color: 0x808080,
      shininess: 100
    });
    
    data.bonds.forEach(bond => {
      const atom1 = data.atoms[bond[0]];
      const atom2 = data.atoms[bond[1]];
      
      if (atom1 && atom2) {
        const start = new THREE.Vector3(atom1.x, atom1.y, atom1.z);
        const end = new THREE.Vector3(atom2.x, atom2.y, atom2.z);
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        
        const geometry = new THREE.CylinderGeometry(0.15, 0.15, length, 8);
        const mesh = new THREE.Mesh(geometry, bondMaterial);
        
        const position = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mesh.position.copy(position);
        
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        mesh.quaternion.copy(quaternion);
        
        group.add(mesh);
      }
    });
    
    // Center the molecule
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.children.forEach(child => {
      child.position.sub(center);
    });
    
    return group;
  }
}