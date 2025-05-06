import React from 'react';
import { GameboyControls } from '../types/gameboy';

interface ControlsProps {
  onControlChange: (controlName: keyof GameboyControls, isActive: boolean) => void;
  controls: GameboyControls;
}

const Controls: React.FC<ControlsProps> = ({ onControlChange, controls }) => {
  const handleMouseDown = (controlName: keyof GameboyControls) => {
    onControlChange(controlName, true);
  };

  const handleMouseUp = (controlName: keyof GameboyControls) => {
    onControlChange(controlName, false);
  };

  const handleTouchStart = (e: React.TouchEvent, controlName: keyof GameboyControls) => {
    e.preventDefault();
    onControlChange(controlName, true);
  };

  const handleTouchEnd = (e: React.TouchEvent, controlName: keyof GameboyControls) => {
    e.preventDefault();
    onControlChange(controlName, false);
  };

  return (
    <div className="controls-container">
      {/* D-Pad */}
      <div className="d-pad-container relative">
        <div className="d-pad-cross absolute left-4 top-1/3 -translate-y-1/2 w-24 h-24">
          <div className="dpad-outer relative bg-gray-700 w-20 h-20 rounded-full">
            {/* Up button */}
            <div 
              className={`button-dpad dpad-button absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-t-lg cursor-pointer ${controls.up ? 'active' : ''}`}
              onMouseDown={() => handleMouseDown('up')}
              onMouseUp={() => handleMouseUp('up')}
              onMouseLeave={() => handleMouseUp('up')}
              onTouchStart={(e) => handleTouchStart(e, 'up')}
              onTouchEnd={(e) => handleTouchEnd(e, 'up')}
            ></div>
            
            {/* Right button */}
            <div 
              className={`button-dpad dpad-button absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-r-lg cursor-pointer ${controls.right ? 'active' : ''}`}
              onMouseDown={() => handleMouseDown('right')}
              onMouseUp={() => handleMouseUp('right')}
              onMouseLeave={() => handleMouseUp('right')}
              onTouchStart={(e) => handleTouchStart(e, 'right')}
              onTouchEnd={(e) => handleTouchEnd(e, 'right')}
            ></div>
            
            {/* Down button */}
            <div 
              className={`button-dpad dpad-button absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-b-lg cursor-pointer ${controls.down ? 'active' : ''}`}
              onMouseDown={() => handleMouseDown('down')}
              onMouseUp={() => handleMouseUp('down')}
              onMouseLeave={() => handleMouseUp('down')}
              onTouchStart={(e) => handleTouchStart(e, 'down')}
              onTouchEnd={(e) => handleTouchEnd(e, 'down')}
            ></div>
            
            {/* Left button */}
            <div 
              className={`button-dpad dpad-button absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-l-lg cursor-pointer ${controls.left ? 'active' : ''}`}
              onMouseDown={() => handleMouseDown('left')}
              onMouseUp={() => handleMouseUp('left')}
              onMouseLeave={() => handleMouseUp('left')}
              onTouchStart={(e) => handleTouchStart(e, 'left')}
              onTouchEnd={(e) => handleTouchEnd(e, 'left')}
            ></div>
            
            <div className="dpad-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full"></div>
          </div>
        </div>
        
        {/* A B buttons */}
        <div className="action-buttons absolute right-4 top-1/3 -translate-y-1/2 flex gap-4 transform rotate-12">
          <div className="button-container flex flex-col items-center">
            <div 
              className={`button-action bg-red-500 w-10 h-10 rounded-full shadow-md cursor-pointer ${controls.b ? 'active' : ''}`}
              onMouseDown={() => handleMouseDown('b')}
              onMouseUp={() => handleMouseUp('b')}
              onMouseLeave={() => handleMouseUp('b')}
              onTouchStart={(e) => handleTouchStart(e, 'b')}
              onTouchEnd={(e) => handleTouchEnd(e, 'b')}
            ></div>
            <div className="button-label text-xs text-gray-700 mt-1 font-bold">B</div>
          </div>
          
          <div className="button-container flex flex-col items-center">
            <div 
              className={`button-action bg-red-500 w-10 h-10 rounded-full shadow-md cursor-pointer ${controls.a ? 'active' : ''}`}
              onMouseDown={() => handleMouseDown('a')}
              onMouseUp={() => handleMouseUp('a')}
              onMouseLeave={() => handleMouseUp('a')}
              onTouchStart={(e) => handleTouchStart(e, 'a')}
              onTouchEnd={(e) => handleTouchEnd(e, 'a')}
            ></div>
            <div className="button-label text-xs text-gray-700 mt-1 font-bold">A</div>
          </div>
        </div>
      </div>
      
      {/* Start / Select buttons */}
      <div className="menu-buttons flex justify-center gap-8 mt-32">
        <div className="button-container flex flex-col items-center">
          <div 
            className={`button-menu bg-gray-700 w-12 h-3 rounded-full cursor-pointer ${controls.select ? 'active' : ''}`}
            onMouseDown={() => handleMouseDown('select')}
            onMouseUp={() => handleMouseUp('select')}
            onMouseLeave={() => handleMouseUp('select')}
            onTouchStart={(e) => handleTouchStart(e, 'select')}
            onTouchEnd={(e) => handleTouchEnd(e, 'select')}
          ></div>
          <div className="button-label text-xs text-gray-700 mt-1">SELECT</div>
        </div>
        
        <div className="button-container flex flex-col items-center">
          <div 
            className={`button-menu bg-gray-700 w-12 h-3 rounded-full cursor-pointer ${controls.start ? 'active' : ''}`}
            onMouseDown={() => handleMouseDown('start')}
            onMouseUp={() => handleMouseUp('start')}
            onMouseLeave={() => handleMouseUp('start')}
            onTouchStart={(e) => handleTouchStart(e, 'start')}
            onTouchEnd={(e) => handleTouchEnd(e, 'start')}
          ></div>
          <div className="button-label text-xs text-gray-700 mt-1">START</div>
        </div>
      </div>
    </div>
  );
};

export default Controls;