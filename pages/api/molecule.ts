import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Molecule name is required' });
  }

  try {
    // Step 1: Get compound ID from PubChem
    const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/cids/JSON`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      return res.status(404).json({ error: 'Molecule not found' });
    }

    const searchData = await searchResponse.json();
    const cid = searchData.IdentifierList?.CID?.[0];

    if (!cid) {
      return res.status(404).json({ error: 'Molecule not found' });
    }

    // Step 2: Try to get 3D structure first, fallback to 2D
    let sdfData = null;
    let structureType = '3D';

    // Try 3D structure first
    const structure3DUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`;
    const structure3DResponse = await fetch(structure3DUrl);

    if (structure3DResponse.ok) {
      sdfData = await structure3DResponse.text();
    } else {
      // Fallback to 2D structure
      console.log(`3D structure not available for CID ${cid}, trying 2D...`);
      const structure2DUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`;
      const structure2DResponse = await fetch(structure2DUrl);
      
      if (structure2DResponse.ok) {
        sdfData = await structure2DResponse.text();
        structureType = '2D';
      } else {
        return res.status(404).json({ error: 'No molecular structure available' });
      }
    }

    // Step 3: Convert SDF to PDB format
    const pdbData = convertSDFToPDB(sdfData, name, structureType);

    if (!pdbData) {
      return res.status(500).json({ error: 'Failed to convert structure' });
    }

    res.status(200).json({ pdb: pdbData, cid, name, structureType });

  } catch (error) {
    console.error('Molecule API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function convertSDFToPDB(sdfData: string, moleculeName: string, structureType: string = '3D'): string | null {
  try {
    const lines = sdfData.split('\n');
    let pdbContent = `HEADER    ${moleculeName.toUpperCase()}                                                        NONE   1\n`;
    pdbContent += `TITLE     ${moleculeName.toUpperCase()} FROM PUBCHEM ${structureType}                         NONE   2\n`;
    pdbContent += `AUTHOR    Generated from PubChem                                      NONE   3\n`;
    
    // Find counts line (line 4 in SDF format, after header lines)
    let atomCount = 0;
    let bondCount = 0;
    let atomStartIndex = -1;
    
    // SDF format: first 3 lines are header, 4th line is counts
    if (lines.length >= 4) {
      const countsLine = lines[3].trim();
      const parts = countsLine.split(/\s+/);
      if (parts.length >= 2) {
        atomCount = parseInt(parts[0]);
        bondCount = parseInt(parts[1]);
        atomStartIndex = 4; // Atoms start at line 5 (index 4)
      }
    }
    
    if (atomStartIndex === -1 || atomCount === 0) {
      console.error('Could not parse SDF counts line:', lines[3]);
      return null;
    }
    
    console.log(`Converting ${moleculeName}: ${atomCount} atoms, ${bondCount} bonds (${structureType})`);
    
    // Parse atoms
    const atoms = [];
    for (let i = 0; i < atomCount && (atomStartIndex + i) < lines.length; i++) {
      const line = lines[atomStartIndex + i];
      if (line.length < 31) continue;
      
      // SDF format: positions are in fixed columns
      const x = parseFloat(line.substring(0, 10).trim());
      const y = parseFloat(line.substring(10, 20).trim());
      let z = parseFloat(line.substring(20, 30).trim());
      const element = line.substring(31, 34).trim();
      
      // For 2D structures, generate a small random Z coordinate to add depth
      if (structureType === '2D' && (isNaN(z) || Math.abs(z) < 0.001)) {
        z = (Math.random() - 0.5) * 0.3; // Small random displacement
      }
      
      if (!isNaN(x) && !isNaN(y) && !isNaN(z) && element) {
        atoms.push({ x, y, z, element });
      }
    }
    
    if (atoms.length === 0) {
      console.error('No valid atoms parsed from SDF');
      return null;
    }
    
    // Parse bonds (come after atoms in SDF)
    const bonds = [];
    const bondStartIndex = atomStartIndex + atomCount;
    for (let i = 0; i < bondCount && (bondStartIndex + i) < lines.length; i++) {
      const line = lines[bondStartIndex + i];
      if (line.length < 6) continue;
      
      const atom1 = parseInt(line.substring(0, 3).trim()) - 1; // Convert to 0-based index
      const atom2 = parseInt(line.substring(3, 6).trim()) - 1;
      const bondType = parseInt(line.substring(6, 9).trim()) || 1;
      
      if (!isNaN(atom1) && !isNaN(atom2) && atom1 >= 0 && atom2 >= 0 && atom1 < atoms.length && atom2 < atoms.length) {
        bonds.push({ atom1, atom2, bondType });
      }
    }
    
    console.log(`Parsed ${atoms.length} atoms and ${bonds.length} bonds from SDF`);
    
    // Add atoms to PDB
    atoms.forEach((atom, i) => {
      pdbContent += `ATOM  ${(i + 1).toString().padStart(5, ' ')}  ${atom.element.padEnd(3, ' ')}         0    `;
      pdbContent += `${atom.x.toFixed(3).padStart(8, ' ')}${atom.y.toFixed(3).padStart(8, ' ')}${atom.z.toFixed(3).padStart(8, ' ')}`;
      pdbContent += `  0.00  0.00           ${atom.element}+0\n`;
    });
    
    // Add bonds to PDB (CONECT records)
    bonds.forEach(bond => {
      const atom1Index = bond.atom1 + 1; // Convert back to 1-based for PDB
      const atom2Index = bond.atom2 + 1;
      pdbContent += `CONECT${atom1Index.toString().padStart(5, ' ')}${atom2Index.toString().padStart(5, ' ')}    0    0    0\n`;
    });
    
    pdbContent += 'END\n';
    return pdbContent;
    
  } catch (error) {
    console.error('SDF to PDB conversion error:', error);
    return null;
  }
}