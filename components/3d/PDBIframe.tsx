'use client';

import React, { useEffect } from 'react';

export default function PDBIframe() {
  useEffect(() => {
    // External molecule loading functionality
    const handleExternalLoad = async () => {
      const input = document.getElementById('externalMoleculeInput') as HTMLInputElement;
      const button = document.getElementById('externalLoadMolecule') as HTMLButtonElement;
      const status = document.getElementById('externalStatusMessage') as HTMLDivElement;
      
      if (!input || !button || !status) return;
      
      const moleculeName = input.value.trim();
      if (!moleculeName) {
        showExternalStatus('Please enter a molecule name or formula', 'error');
        return;
      }
      
      button.disabled = true;
      showExternalStatus('Loading molecule...', 'loading');
      
      try {
        // Send message to iframe to load molecule
        const iframe = document.querySelector('iframe[title="Three.js PDB Molecular Viewer"]') as HTMLIFrameElement;
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            action: 'loadMolecule',
            moleculeName: moleculeName
          }, '*');
        }
        
        // The status will be updated by the iframe response
        setTimeout(() => {
          button.disabled = false;
        }, 1000);
        
      } catch (error) {
        console.error('Error loading external molecule:', error);
        showExternalStatus('Error loading molecule', 'error');
        button.disabled = false;
      }
    };

    const showExternalStatus = (message: string, type: 'loading' | 'success' | 'error') => {
      const status = document.getElementById('externalStatusMessage');
      if (!status) return;
      
      status.textContent = message;
      status.className = `text-sm text-center min-h-[20px]`;
      
      if (type === 'loading') {
        status.classList.add('text-yellow-400');
      } else if (type === 'success') {
        status.classList.add('text-green-400');
      } else if (type === 'error') {
        status.classList.add('text-red-400');
      }
      
      if (type === 'success' || type === 'error') {
        setTimeout(() => {
          status.textContent = '';
          status.className = 'text-sm text-center min-h-[20px]';
        }, 3000);
      }
    };

    // Add event listeners
    const button = document.getElementById('externalLoadMolecule');
    const input = document.getElementById('externalMoleculeInput');
    
    if (button) {
      button.addEventListener('click', handleExternalLoad);
    }
    
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleExternalLoad();
        }
      });
    }

    // Listen for iframe responses
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data?.action === 'moleculeLoadResult') {
        const { success, message } = event.data;
        showExternalStatus(message, success ? 'success' : 'error');
      }
    };

    window.addEventListener('message', handleIframeMessage);

    return () => {
      if (button) button.removeEventListener('click', handleExternalLoad);
      if (input) input.removeEventListener('keypress', handleExternalLoad);
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  return (
    <div className="flex gap-6 w-full">
      {/* Molecule Viewer - Large Left Section */}
      <div className="flex-1 h-96 lg:h-[600px] bg-black rounded-xl overflow-hidden border-4 border-cyan-400/50 shadow-lg shadow-cyan-400/20">
        <iframe
          src="/webgl_loader_pdb.html"
          className="w-full h-full border-0"
          title="Three.js PDB Molecular Viewer"
          style={{ 
            background: 'black',
            colorScheme: 'dark'
          }}
        />
      </div>
      
      {/* Add Your Own Molecule Panel - Compact Right Section */}
      <div className="w-80 h-96 lg:h-[600px] bg-gray-900/30 rounded-xl border-4 border-cyan-400/50 p-6 flex flex-col shadow-lg shadow-cyan-400/20">
        <div className="text-cyan-400 font-bold text-lg mb-4 text-center border-b border-cyan-400/50 pb-3">
          Add Your Own Molecule
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          <input 
            type="text" 
            id="externalMoleculeInput"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
            placeholder="Enter molecule name or formula"
          />
          
          <button 
            id="externalLoadMolecule"
            className="w-full px-4 py-2 bg-cyan-400/50 hover:bg-cyan-400/70 disabled:bg-gray-600 disabled:cursor-not-allowed text-cyan-400 font-medium rounded transition-colors text-sm cursor-pointer border border-cyan-400/50"
          >
            Load Molecule
          </button>
          
          <div className="text-gray-400 text-xs text-center">
            Try: aspirin, megaphone, housane, codeine, ibuprofen, or other molecules or molecular formulas
          </div>
          
          <div id="externalStatusMessage" className="text-xs text-center min-h-[16px]"></div>
          
          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-500 space-y-2">
              <div className="font-medium text-gray-400 mb-2">Features:</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Real molecules from PubChem</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>AI-generated for unknowns</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>Chemical formulas supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}