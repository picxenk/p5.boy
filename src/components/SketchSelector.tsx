import React from 'react';
import { useSketchContext } from '../context/SketchContext';
import { FlameIcon as GameIcon } from 'lucide-react';

interface SketchSelectorProps {
  className?: string;
}

const SketchSelector: React.FC<SketchSelectorProps> = ({ className = '' }) => {
  const { availableSketches, currentSketch, setCurrentSketch } = useSketchContext();

  return (
    <div className={`sketch-selector bg-white rounded-lg p-4 shadow-md ${className}`}>
      <div className="flex items-center mb-3">
        <GameIcon className="mr-2 text-emerald-600" size={18} />
        <h2 className="text-lg font-semibold">Game Library</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {availableSketches.map((sketch) => (
          <button
            key={sketch}
            className={`
              p-2 rounded border text-sm transition-all
              ${currentSketch === sketch 
                ? 'bg-emerald-100 border-emerald-500 text-emerald-800' 
                : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
              }
            `}
            onClick={() => setCurrentSketch(sketch)}
          >
            {sketch.charAt(0).toUpperCase() + sketch.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SketchSelector;