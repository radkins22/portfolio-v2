import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, formula } = req.body;

  if (!name && !formula) {
    return res.status(400).json({ error: 'Molecule name or formula is required' });
  }

  try {
    // Generate molecular structure using AI-inspired algorithms
    const moleculeData = await generateMolecularStructure(name || formula);
    
    if (!moleculeData) {
      return res.status(404).json({ error: 'Could not generate molecular structure' });
    }

    res.status(200).json({ 
      pdb: moleculeData.pdb, 
      name: name || formula,
      structureType: 'AI Generated',
      atomCount: moleculeData.atomCount
    });

  } catch (error) {
    console.error('AI molecule generation error:', error);
    res.status(500).json({ error: 'Failed to generate molecular structure' });
  }
}

async function generateMolecularStructure(input: string): Promise<{ pdb: string; atomCount: number } | null> {
  try {
    // First try OpenAI API for sophisticated molecular analysis
    let moleculeInfo = null;
    
    try {
      moleculeInfo = await generateWithOpenAI(input);
    } catch (aiError) {
      console.log('OpenAI generation failed, falling back to rule-based:', aiError);
    }
    
    // Fallback to rule-based generation
    if (!moleculeInfo) {
      moleculeInfo = analyzeMoleculeInput(input);
    }
    
    if (!moleculeInfo) {
      return null;
    }

    const atoms = generateAtomicCoordinates(moleculeInfo);
    const bonds = generateBonds(atoms, moleculeInfo);
    
    const pdb = createPDBFromStructure(atoms, bonds, input);
    
    return {
      pdb,
      atomCount: atoms.length
    };

  } catch (error) {
    console.error('Structure generation error:', error);
    return null;
  }
}

async function generateWithOpenAI(input: string): Promise<any> {
  console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('OpenAI API Key length:', process.env.OPENAI_API_KEY?.length);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a chemistry expert. For any molecule, drug, or compound, provide the chemical formula and structural info. Return ONLY a JSON object with this exact format:
{
  "formula": "C8H10N4O2",
  "atoms": {"C": 8, "H": 10, "N": 4, "O": 2},
  "name": "caffeine",
  "type": "organic_compound|inorganic_salt|metallic_element|ion_compound",
  "structure_type": "linear|branched|cyclic|cage|aromatic|polycyclic",
  "special_features": ["benzene_rings", "cage_structure", "bridged_rings", "fused_rings"],
  "description": "brief description"
}

Special structure types:
- cage: for paddlanes, adamantane, cubane, dodecahedrane
- polycyclic: for steroids, complex ring systems
- bridged_rings: for bicyclic and tricyclic compounds

If it's a metallic element, use type "metallic_element".
If unknown/fictional, create a reasonable organic structure.`
        },
        {
          role: 'user',
          content: `What is the chemical formula and composition for: "${input}"?`
        }
      ],
      max_tokens: 150,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error details:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content from OpenAI');
  }

  try {
    const aiResult = JSON.parse(content);
    
    // Convert AI result to our internal format
    return {
      backbone: aiResult.structure_type === 'cage' ? 'cage_structure' : 
               aiResult.structure_type === 'polycyclic' ? 'polycyclic_structure' :
               'formula_based',
      atoms: aiResult.atoms,
      name: aiResult.name || input,
      aiGenerated: true,
      description: aiResult.description,
      originalFormula: aiResult.formula,
      structureType: aiResult.structure_type,
      specialFeatures: aiResult.special_features || []
    };
  } catch (parseError) {
    throw new Error('Invalid JSON from OpenAI');
  }
}

function analyzeMoleculeInput(input: string): any {
  const inputLower = input.toLowerCase().trim();
  
  // Metallic elements and their crystal structures
  const metallicElements = {
    'silver': { element: 'Ag', structure: 'fcc_crystal', description: 'Face-centered cubic crystal' },
    'gold': { element: 'Au', structure: 'fcc_crystal', description: 'Face-centered cubic crystal' },
    'copper': { element: 'Cu', structure: 'fcc_crystal', description: 'Face-centered cubic crystal' },
    'iron': { element: 'Fe', structure: 'bcc_crystal', description: 'Body-centered cubic crystal' },
    'aluminum': { element: 'Al', structure: 'fcc_crystal', description: 'Face-centered cubic crystal' },
    'platinum': { element: 'Pt', structure: 'fcc_crystal', description: 'Face-centered cubic crystal' },
    'palladium': { element: 'Pd', structure: 'fcc_crystal', description: 'Face-centered cubic crystal' },
    'titanium': { element: 'Ti', structure: 'hcp_crystal', description: 'Hexagonal close-packed crystal' },
    'zinc': { element: 'Zn', structure: 'hcp_crystal', description: 'Hexagonal close-packed crystal' },
    'nickel': { element: 'Ni', structure: 'fcc_crystal', description: 'Face-centered cubic crystal' },
  };
  
  // Check for metallic elements first
  for (const [metal, info] of Object.entries(metallicElements)) {
    if (inputLower.includes(metal)) {
      return { 
        backbone: 'metallic_crystal',
        metalInfo: info,
        name: input 
      };
    }
  }
  
  // Common molecule patterns and their typical structures
  const knownPatterns = {
    // Hydrocarbons
    'alkane': { backbone: 'carbon_chain', functional_groups: [] },
    'alkene': { backbone: 'carbon_chain', functional_groups: ['double_bond'] },
    'benzene': { backbone: 'benzene_ring', functional_groups: [] },
    'toluene': { backbone: 'benzene_ring', functional_groups: ['methyl'] },
    
    // Alcohols
    'alcohol': { backbone: 'carbon_chain', functional_groups: ['hydroxyl'] },
    'ethanol': { backbone: 'carbon_chain', functional_groups: ['hydroxyl'], length: 2 },
    'methanol': { backbone: 'carbon_chain', functional_groups: ['hydroxyl'], length: 1 },
    
    // Acids
    'acid': { backbone: 'carbon_chain', functional_groups: ['carboxyl'] },
    'acetic': { backbone: 'carbon_chain', functional_groups: ['carboxyl'], length: 2 },
    
    // Amino compounds
    'amine': { backbone: 'carbon_chain', functional_groups: ['amino'] },
    'amino': { backbone: 'carbon_chain', functional_groups: ['amino'] },
    
    // Common pharmaceuticals (simplified)
    'penicillin': { backbone: 'beta_lactam', functional_groups: ['amino', 'carboxyl'] },
    'insulin': { backbone: 'protein_chain', functional_groups: ['amino', 'carboxyl'] },
    'morphine': { backbone: 'phenanthrene', functional_groups: ['hydroxyl', 'amino'] },
    
    // Cage structures
    'paddlane': { backbone: 'cage_structure', atoms: { C: 16, H: 24 }, name: 'paddlane', specialFeatures: ['cage_structure'] },
    'adamantane': { backbone: 'cage_structure', atoms: { C: 10, H: 16 }, name: 'adamantane', specialFeatures: ['cage_structure'] },
    'cubane': { backbone: 'cage_structure', atoms: { C: 8, H: 8 }, name: 'cubane', specialFeatures: ['cage_structure'] },
    'dodecahedrane': { backbone: 'cage_structure', atoms: { C: 20, H: 20 }, name: 'dodecahedrane', specialFeatures: ['cage_structure'] },
  };
  
  // Check for known patterns
  for (const [pattern, structure] of Object.entries(knownPatterns)) {
    if (inputLower.includes(pattern)) {
      return { ...structure, name: input };
    }
  }
  
  // Try to parse chemical formula (e.g., C6H12O6)
  const formulaMatch = input.match(/C(\d*)H(\d*)(?:O(\d*))?(?:N(\d*))?/i);
  if (formulaMatch) {
    const c = parseInt(formulaMatch[1]) || 1;
    const h = parseInt(formulaMatch[2]) || 0;
    const o = parseInt(formulaMatch[3]) || 0;
    const n = parseInt(formulaMatch[4]) || 0;
    
    return {
      backbone: 'formula_based',
      atoms: { C: c, H: h, O: o, N: n },
      name: input
    };
  }
  
  // Default: assume simple organic molecule
  return {
    backbone: 'carbon_chain',
    functional_groups: [],
    length: 3,
    name: input
  };
}

function generateAtomicCoordinates(moleculeInfo: any): Array<{ x: number; y: number; z: number; element: string }> {
  const atoms = [];
  
  if (moleculeInfo.backbone === 'metallic_crystal' && moleculeInfo.metalInfo) {
    // Generate crystal structure for metallic elements
    const { element, structure } = moleculeInfo.metalInfo;
    
    if (structure === 'fcc_crystal') {
      // Face-centered cubic crystal structure
      const a = 4.0; // Lattice parameter (scaled for visualization)
      const positions = [
        // Corner atoms
        [0, 0, 0], [a, 0, 0], [0, a, 0], [0, 0, a],
        [a, a, 0], [a, 0, a], [0, a, a], [a, a, a],
        // Face-centered atoms
        [a/2, a/2, 0], [a/2, 0, a/2], [0, a/2, a/2],
        [a/2, a/2, a], [a/2, a, a/2], [a, a/2, a/2]
      ];
      
      positions.forEach(([x, y, z]) => {
        atoms.push({ x, y, z, element });
      });
      
      // Add bonds between nearest neighbors
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const distance = Math.sqrt(
            Math.pow(atoms[i].x - atoms[j].x, 2) +
            Math.pow(atoms[i].y - atoms[j].y, 2) +
            Math.pow(atoms[i].z - atoms[j].z, 2)
          );
          // Connect atoms that are close (nearest neighbors in FCC)
          if (Math.abs(distance - a/Math.sqrt(2)) < 0.1) {
            atoms[i].bonds = atoms[i].bonds || [];
            atoms[i].bonds.push(j);
          }
        }
      }
      
    } else if (structure === 'bcc_crystal') {
      // Body-centered cubic crystal structure
      const a = 4.0;
      const positions = [
        // Corner atoms
        [0, 0, 0], [a, 0, 0], [0, a, 0], [0, 0, a],
        [a, a, 0], [a, 0, a], [0, a, a], [a, a, a],
        // Body-centered atom
        [a/2, a/2, a/2]
      ];
      
      positions.forEach(([x, y, z]) => {
        atoms.push({ x, y, z, element });
      });
      
    } else if (structure === 'hcp_crystal') {
      // Hexagonal close-packed structure (simplified)
      const a = 3.0;
      const c = a * 1.633; // Ideal c/a ratio for HCP
      
      const positions = [
        // First layer (hexagonal)
        [0, 0, 0], [a, 0, 0], [a/2, a*Math.sqrt(3)/2, 0],
        [-a/2, a*Math.sqrt(3)/2, 0], [-a, 0, 0], [-a/2, -a*Math.sqrt(3)/2, 0],
        [a/2, -a*Math.sqrt(3)/2, 0],
        // Second layer
        [a/2, a*Math.sqrt(3)/6, c/2], [-a/2, a*Math.sqrt(3)/6, c/2], [0, -a*Math.sqrt(3)/3, c/2]
      ];
      
      positions.forEach(([x, y, z]) => {
        atoms.push({ x, y, z, element });
      });
    }
    
  } else if (moleculeInfo.backbone === 'cage_structure' && moleculeInfo.atoms) {
    // Generate cage-like structures (paddlanes, adamantane, cubane, etc.)
    const atomCounts = moleculeInfo.atoms;
    const C = atomCounts.C || 0;
    const H = atomCounts.H || 0;
    
    if (C >= 8) {
      // Generate paddlane-like or adamantane-like structure
      const specialFeatures = moleculeInfo.specialFeatures || [];
      
      if (specialFeatures.includes('cage_structure') || moleculeInfo.name?.toLowerCase().includes('paddlan')) {
        // Paddlane structure - two parallel rings connected by bridges
        const positions = [];
        
        // First ring (bottom)
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * 2 * Math.PI;
          positions.push([
            2.0 * Math.cos(angle),
            2.0 * Math.sin(angle),
            0
          ]);
        }
        
        // Second ring (top)
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * 2 * Math.PI + Math.PI/4; // Offset by 45 degrees
          positions.push([
            2.0 * Math.cos(angle),
            2.0 * Math.sin(angle),
            3.0
          ]);
        }
        
        // Bridge carbons connecting the rings
        const remainingC = C - 8;
        for (let i = 0; i < remainingC; i++) {
          const ringIndex1 = i % 4;
          const ringIndex2 = (i + 1) % 4 + 4;
          const pos1 = positions[ringIndex1];
          const pos2 = positions[ringIndex2];
          
          positions.push([
            (pos1[0] + pos2[0]) / 2 + (Math.random() - 0.5) * 0.5,
            (pos1[1] + pos2[1]) / 2 + (Math.random() - 0.5) * 0.5,
            (pos1[2] + pos2[2]) / 2
          ]);
        }
        
        // Add carbons
        positions.slice(0, C).forEach(([x, y, z]) => {
          atoms.push({ x, y, z, element: 'C' });
        });
        
      } else {
        // Adamantane-like structure
        const adamantanePositions = [
          [0, 0, 0], [1.5, 1.5, 0], [1.5, -1.5, 0], [-1.5, 1.5, 0],
          [0, 0, 2.45], [1.5, 1.5, 2.45], [1.5, -1.5, 2.45], [-1.5, 1.5, 2.45],
          [0, 1.5, 1.225], [-1.5, 0, 1.225]
        ];
        
        adamantanePositions.slice(0, C).forEach(([x, y, z]) => {
          atoms.push({ x, y, z, element: 'C' });
        });
      }
      
      // Add hydrogens around the cage structure
      const hydrogensPerCarbon = Math.floor(H / C);
      atoms.filter(a => a.element === 'C').forEach((carbon, i) => {
        for (let j = 0; j < hydrogensPerCarbon && atoms.filter(a => a.element === 'H').length < H; j++) {
          const angle = (j / hydrogensPerCarbon) * 2 * Math.PI;
          const distance = 1.1;
          atoms.push({
            x: carbon.x + distance * Math.cos(angle),
            y: carbon.y + distance * Math.sin(angle),
            z: carbon.z + distance * 0.5,
            element: 'H'
          });
        }
      });
    }
    
  } else if (moleculeInfo.backbone === 'polycyclic_structure' && moleculeInfo.atoms) {
    // Generate polycyclic structures (steroids, complex ring systems)
    const atomCounts = moleculeInfo.atoms;
    const C = atomCounts.C || 0;
    const H = atomCounts.H || 0;
    const O = atomCounts.O || 0;
    const N = atomCounts.N || 0;
    
    // Create multiple fused rings
    const ringsNeeded = Math.min(4, Math.floor(C / 5));
    let atomsPlaced = 0;
    
    for (let ring = 0; ring < ringsNeeded && atomsPlaced < C; ring++) {
      const ringSize = ring === 0 ? 6 : 5; // First ring larger
      for (let i = 0; i < ringSize && atomsPlaced < C; i++) {
        const angle = (i / ringSize) * 2 * Math.PI;
        const radius = 1.4;
        const x = ring * 2.5 + radius * Math.cos(angle);
        const y = (ring % 2) * 1.5 + radius * Math.sin(angle);
        const z = Math.floor(ring / 2) * 1.0;
        
        atoms.push({ x, y, z, element: 'C' });
        atomsPlaced++;
      }
    }
    
    // Add remaining carbons as side chains
    while (atomsPlaced < C) {
      const baseAtom = atoms[Math.floor(Math.random() * atoms.length)];
      atoms.push({
        x: baseAtom.x + (Math.random() - 0.5) * 2.0,
        y: baseAtom.y + (Math.random() - 0.5) * 2.0,
        z: baseAtom.z + (Math.random() - 0.5) * 1.0,
        element: 'C'
      });
      atomsPlaced++;
    }
    
    // Add heteroatoms
    [O, N].forEach((count, elementIndex) => {
      const element = ['O', 'N'][elementIndex];
      for (let i = 0; i < count; i++) {
        const carbon = atoms[i % atoms.length];
        atoms.push({
          x: carbon.x + 1.2,
          y: carbon.y + (Math.random() - 0.5) * 0.5,
          z: carbon.z,
          element: element
        });
      }
    });
    
    // Add some hydrogens
    const visibleHydrogens = Math.min(H, atoms.length * 2);
    for (let i = 0; i < visibleHydrogens; i++) {
      const heavyAtom = atoms[i % atoms.length];
      atoms.push({
        x: heavyAtom.x + 1.0 * Math.cos(i),
        y: heavyAtom.y + 1.0 * Math.sin(i),
        z: heavyAtom.z + 0.5,
        element: 'H'
      });
    }
    
  } else if (moleculeInfo.backbone === 'formula_based' && moleculeInfo.atoms) {
    // Generate coordinates based on chemical formula with improved 3D structure
    const atomCounts = moleculeInfo.atoms;
    const C = atomCounts.C || 0;
    const H = atomCounts.H || 0;
    const O = atomCounts.O || 0;
    const N = atomCounts.N || 0;
    const S = atomCounts.S || 0;
    const P = atomCounts.P || 0;
    
    // Build carbon backbone first
    const carbonPositions = [];
    if (C > 0) {
      if (C <= 4) {
        // Small molecules - use proper tetrahedral geometry
        if (C === 1) {
          carbonPositions.push({ x: 0, y: 0, z: 0, element: 'C' });
        } else if (C === 2) {
          carbonPositions.push({ x: -0.77, y: 0, z: 0, element: 'C' });
          carbonPositions.push({ x: 0.77, y: 0, z: 0, element: 'C' });
        } else if (C === 3) {
          // Trigonal arrangement
          for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * 2 * Math.PI;
            carbonPositions.push({
              x: 1.2 * Math.cos(angle),
              y: 1.2 * Math.sin(angle),
              z: 0,
              element: 'C'
            });
          }
        } else if (C === 4) {
          // Tetrahedral arrangement (like methane)
          const tetrahedralAngles = [
            [0, 0, 0],
            [1.633, 0, -1.155],
            [-0.816, 1.414, -1.155],
            [-0.816, -1.414, -1.155]
          ];
          tetrahedralAngles.forEach(([x, y, z]) => {
            carbonPositions.push({ x, y, z, element: 'C' });
          });
        }
      } else if (C <= 8) {
        // Medium molecules - chain with some branching
        for (let i = 0; i < C; i++) {
          if (i < C / 2) {
            // Main chain
            carbonPositions.push({
              x: i * 1.5,
              y: 0,
              z: 0,
              element: 'C'
            });
          } else {
            // Branch off from middle carbons
            const branchFrom = Math.floor(C / 4);
            carbonPositions.push({
              x: carbonPositions[branchFrom].x,
              y: carbonPositions[branchFrom].y + (i - C/2 + 1) * 1.4,
              z: (i % 2) * 0.8,
              element: 'C'
            });
          }
        }
      } else {
        // Large molecules - more complex 3D arrangement
        const ringsNeeded = Math.floor(C / 6);
        let atomsPlaced = 0;
        
        // Create benzene-like rings
        for (let ring = 0; ring < ringsNeeded && atomsPlaced < C; ring++) {
          for (let i = 0; i < 6 && atomsPlaced < C; i++) {
            const angle = (i / 6) * 2 * Math.PI;
            const radius = 1.4;
            carbonPositions.push({
              x: ring * 3.0 + radius * Math.cos(angle),
              y: radius * Math.sin(angle),
              z: ring * 0.5,
              element: 'C'
            });
            atomsPlaced++;
          }
        }
        
        // Add remaining carbons as side chains
        while (atomsPlaced < C) {
          const attachTo = Math.floor(Math.random() * carbonPositions.length);
          const basePos = carbonPositions[attachTo];
          carbonPositions.push({
            x: basePos.x + (Math.random() - 0.5) * 2.0,
            y: basePos.y + (Math.random() - 0.5) * 2.0,
            z: basePos.z + (Math.random() - 0.5) * 2.0,
            element: 'C'
          });
          atomsPlaced++;
        }
      }
    }
    
    atoms.push(...carbonPositions);
    
    // Add heteroatoms (O, N, S, P) attached to carbons
    const heteroAtoms = [
      ...Array(O).fill('O'),
      ...Array(N).fill('N'),
      ...Array(S).fill('S'),
      ...Array(P).fill('P')
    ];
    
    heteroAtoms.forEach((element, i) => {
      if (carbonPositions.length > 0) {
        const carbonIndex = i % carbonPositions.length;
        const carbon = carbonPositions[carbonIndex];
        
        // Use proper bond lengths based on elements
        const bondLengths = {
          'C-O': 1.43, 'C-N': 1.47, 'C-S': 1.82, 'C-P': 1.85,
          'C-F': 1.35, 'C-Cl': 1.78, 'C-Br': 1.94, 'C-I': 2.14
        };
        
        const bondLength = bondLengths[`C-${element}`] || 1.4;
        
        // Place heteroatom with tetrahedral geometry (109.5° bond angle)
        const tetrahedralAngle = 109.5 * (Math.PI / 180);
        const phi = (i / heteroAtoms.length) * 2 * Math.PI;
        
        atoms.push({
          x: carbon.x + bondLength * Math.sin(tetrahedralAngle) * Math.cos(phi),
          y: carbon.y + bondLength * Math.sin(tetrahedralAngle) * Math.sin(phi),
          z: carbon.z + bondLength * Math.cos(tetrahedralAngle),
          element: element
        });
      } else {
        // No carbons, place heteroatoms in a simple arrangement
        const angle = (i / heteroAtoms.length) * 2 * Math.PI;
        atoms.push({
          x: 2.0 * Math.cos(angle),
          y: 2.0 * Math.sin(angle),
          z: 0,
          element: element
        });
      }
    });
    
    // Add hydrogens around heavy atoms (simplified - not all hydrogens)
    const heavyAtoms = atoms.filter(a => a.element !== 'H');
    const hydrogensToAdd = Math.min(H, heavyAtoms.length * 3); // Reasonable number of visible hydrogens
    
    for (let i = 0; i < hydrogensToAdd; i++) {
      const heavyAtomIndex = i % heavyAtoms.length;
      const heavyAtom = heavyAtoms[heavyAtomIndex];
      const angle = (i / hydrogensToAdd) * 2 * Math.PI + Math.random() * 0.5;
      const distance = 1.0; // Typical C-H bond length
      
      atoms.push({
        x: heavyAtom.x + distance * Math.cos(angle),
        y: heavyAtom.y + distance * Math.sin(angle),
        z: heavyAtom.z + (Math.random() - 0.5) * 0.5,
        element: 'H'
      });
    }
    
  } else {
    // Default: simple carbon chain with functional groups
    const length = moleculeInfo.length || 4;
    
    // Create carbon backbone
    for (let i = 0; i < length; i++) {
      atoms.push({
        x: i * 1.5,
        y: 0,
        z: 0,
        element: 'C'
      });
    }
    
    // Add functional groups
    if (moleculeInfo.functional_groups?.includes('hydroxyl')) {
      atoms.push({
        x: atoms[atoms.length - 1].x,
        y: 1.2,
        z: 0,
        element: 'O'
      });
      atoms.push({
        x: atoms[atoms.length - 1].x,
        y: 2.0,
        z: 0,
        element: 'H'
      });
    }
    
    // Add some hydrogens
    atoms.forEach((atom, i) => {
      if (atom.element === 'C') {
        atoms.push({
          x: atom.x + 0.8,
          y: atom.y + 0.8,
          z: 0.5,
          element: 'H'
        });
        atoms.push({
          x: atom.x - 0.8,
          y: atom.y + 0.8,
          z: 0.5,
          element: 'H'
        });
      }
    });
  }
  
  return atoms;
}

function generateBonds(atoms: Array<{ x: number; y: number; z: number; element: string }>, moleculeInfo: any): Array<{ atom1: number; atom2: number }> {
  const bonds = [];
  
  // Generate bonds based on proximity and chemical rules
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const atom1 = atoms[i];
      const atom2 = atoms[j];
      
      const distance = Math.sqrt(
        Math.pow(atom1.x - atom2.x, 2) +
        Math.pow(atom1.y - atom2.y, 2) +
        Math.pow(atom1.z - atom2.z, 2)
      );
      
      // Bond if atoms are close enough (typical bond lengths)
      let shouldBond = false;
      
      if (atom1.element === 'C' && atom2.element === 'C' && distance < 2.0) {
        shouldBond = true;
      } else if ((atom1.element === 'C' && atom2.element === 'O') || (atom1.element === 'O' && atom2.element === 'C')) {
        if (distance < 1.8) shouldBond = true;
      } else if ((atom1.element === 'C' && atom2.element === 'H') || (atom1.element === 'H' && atom2.element === 'C')) {
        if (distance < 1.5) shouldBond = true;
      } else if ((atom1.element === 'O' && atom2.element === 'H') || (atom1.element === 'H' && atom2.element === 'O')) {
        if (distance < 1.2) shouldBond = true;
      } else if ((atom1.element === 'C' && atom2.element === 'N') || (atom1.element === 'N' && atom2.element === 'C')) {
        if (distance < 1.8) shouldBond = true;
      }
      
      if (shouldBond) {
        bonds.push({ atom1: i, atom2: j });
      }
    }
  }
  
  return bonds;
}

function createPDBFromStructure(atoms: Array<{ x: number; y: number; z: number; element: string }>, bonds: Array<{ atom1: number; atom2: number }>, name: string): string {
  let pdbContent = `HEADER    ${name.toUpperCase()}                                                        NONE   1\n`;
  pdbContent += `TITLE     ${name.toUpperCase()} AI GENERATED                                   NONE   2\n`;
  pdbContent += `AUTHOR    Generated by AI                                           NONE   3\n`;
  
  // Add atoms
  atoms.forEach((atom, i) => {
    pdbContent += `ATOM  ${(i + 1).toString().padStart(5, ' ')}  ${atom.element.padEnd(3, ' ')}         0    `;
    pdbContent += `${atom.x.toFixed(3).padStart(8, ' ')}${atom.y.toFixed(3).padStart(8, ' ')}${atom.z.toFixed(3).padStart(8, ' ')}`;
    pdbContent += `  0.00  0.00           ${atom.element}+0\n`;
  });
  
  // Add bonds
  bonds.forEach(bond => {
    const atom1Index = bond.atom1 + 1;
    const atom2Index = bond.atom2 + 1;
    pdbContent += `CONECT${atom1Index.toString().padStart(5, ' ')}${atom2Index.toString().padStart(5, ' ')}    0    0    0\n`;
  });
  
  pdbContent += 'END\n';
  return pdbContent;
}