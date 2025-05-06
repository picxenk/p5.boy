import React, { useRef, useEffect, useState } from 'react';
import Screen from './Screen';
import Controls from './Controls';
import { useSketchContext } from '../context/SketchContext';
import { GameboyControls } from '../types/gameboy';

const Gameboy: React.FC = () => {
  const { currentSketch } = useSketchContext();
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [controls, setControls] = useState<GameboyControls>({
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
    start: false,
    select: false
  });
  
  const screenRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setControls(prev => ({ ...prev, up: true }));
          break;
        case 'ArrowDown':
          setControls(prev => ({ ...prev, down: true }));
          break;
        case 'ArrowLeft':
          setControls(prev => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
          setControls(prev => ({ ...prev, right: true }));
          break;
        case 'z':
          setControls(prev => ({ ...prev, a: true }));
          break;
        case 'x':
          setControls(prev => ({ ...prev, b: true }));
          break;
        case 'Enter':
          setControls(prev => ({ ...prev, start: true }));
          break;
        case 'Shift':
          setControls(prev => ({ ...prev, select: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setControls(prev => ({ ...prev, up: false }));
          break;
        case 'ArrowDown':
          setControls(prev => ({ ...prev, down: false }));
          break;
        case 'ArrowLeft':
          setControls(prev => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
          setControls(prev => ({ ...prev, right: false }));
          break;
        case 'z':
          setControls(prev => ({ ...prev, a: false }));
          break;
        case 'x':
          setControls(prev => ({ ...prev, b: false }));
          break;
        case 'Enter':
          setControls(prev => ({ ...prev, start: false }));
          break;
        case 'Shift':
          setControls(prev => ({ ...prev, select: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleControlChange = (controlName: keyof GameboyControls, isActive: boolean) => {
    setControls(prev => ({ ...prev, [controlName]: isActive }));
  };

  const togglePower = () => {
    setIsPoweredOn(!isPoweredOn);
  };

  return (
    <div className="gameboy-container relative">
      <div className="gameboy-body bg-[#dcdcdc] rounded-b-2xl rounded-t-md p-4 pt-6 gameboy-shadow">
        <div className="power-section flex items-center justify-end mb-3">
          <div className="text-xs text-gray-600 mr-2">OFF · ON</div>
          <div 
            className={`power-switch w-8 h-4 bg-gray-300 rounded-full flex items-center relative cursor-pointer ${isPoweredOn ? 'on' : ''}`}
            onClick={togglePower}
          >
            <div className="w-3 h-3 bg-gray-600 rounded-full absolute left-1"></div>
          </div>
        </div>
        
        <div className="screen-container bg-gray-800 rounded-lg p-4 mb-6 w-full aspect-[160/144]">
          <div className="screen-header flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="text-xs text-gray-400 pixel-text">POWER</div>
            </div>
            <div className="text-xs text-gray-400 uppercase pixel-text">GameP5</div>
          </div>
          
          <div 
            ref={screenRef} 
            className="gameboy-screen rounded overflow-hidden dot-matrix h-[calc(100%-2rem)]"
          >
            <Screen 
              isPoweredOn={isPoweredOn} 
              controls={controls} 
              sketchName={currentSketch}
            />
          </div>
          
          <div className="text-xs text-center text-gray-400 mt-2 uppercase tracking-widest">
            DOT MATRIX WITH STEREO SOUND
          </div>
        </div>
        
        <div className="controls-section mt-4">
          <Controls onControlChange={handleControlChange} controls={controls} />
        </div>
        
        <div className="gameboy-logo text-center mt-4">
          <div className="text-[10px] font-bold tracking-widest text-gray-700">
             p5.boy
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gameboy;