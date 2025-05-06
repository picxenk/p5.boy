import React, { useState } from 'react';
import Gameboy from './components/Gameboy';
import SketchSelector from './components/SketchSelector';
import { SketchProvider } from './context/SketchContext';
import './App.css';

function App() {
  const [showSelector, setShowSelector] = useState(false);

  return (
    <SketchProvider>
      <div className="app-container min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-bold mb-2">p5.boy</h1>
          <p className="text-sm text-gray-600 mb-4">Run p5.js sketches in a classic GameBoy-like interface</p>
          <button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-4 rounded text-sm transition-colors"
            onClick={() => setShowSelector(!showSelector)}
          >
            {showSelector ? 'Hide Game Selector' : 'Show Game Selector'}
          </button>
        </header>
        
        {showSelector && <SketchSelector className="mb-4" />}
        
        <main className="flex-1 flex items-center justify-center">
          <Gameboy />
        </main>
        
        <footer className="mt-4 text-xs text-gray-500 text-center">
          <p>© 2025 p5.boy | <a href="https://github.com/picxenk/p5.boy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">GitHub</a></p>
        </footer>
      </div>
    </SketchProvider>
  );
}

export default App;