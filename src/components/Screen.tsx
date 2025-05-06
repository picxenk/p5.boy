import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { GameboyControls } from '../types/gameboy';
import { loadSketch } from '../sketches/sketchLoader';

interface ScreenProps {
  isPoweredOn: boolean;
  controls: GameboyControls;
  sketchName: string;
}

const Screen: React.FC<ScreenProps> = ({ isPoweredOn, controls, sketchName }) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  
  // Global window object to store controls state for p5 sketch to access
  useEffect(() => {
    window.gameboyControls = controls;
  }, [controls]);
  
  // When power state or sketch changes, reload sketch
  useEffect(() => {
    let isMounted = true;
    let currentP5Instance: p5 | null = null;

    const cleanup = () => {
      if (currentP5Instance) {
        try {
          // Remove all event listeners first
          if (window.gameboyP5) {
            window.gameboyP5.remove();
            window.gameboyP5 = null;
          }
          // Then remove the p5 instance
          currentP5Instance.remove();
        } catch (error) {
          console.warn('Error removing p5 instance:', error);
        } finally {
          currentP5Instance = null;
        }
      }
    };

    // Clean up existing sketch
    cleanup();
    
    if (isPoweredOn && screenRef.current && isMounted) {
      // Set screen dimensions - classic Gameboy had 160x144 resolution
      const WIDTH = 160;
      const HEIGHT = 144;
      
      // Create new p5 instance with the selected sketch
      loadSketch(sketchName).then(sketchFn => {
        if (!isMounted) return;
        
        // Make sure the previous instance is completely removed
        cleanup();
        
        if (screenRef.current) {
          try {
            currentP5Instance = new p5((p: p5) => {
              // Set the window.gameboyP5 to the p5 instance for global access
              window.gameboyP5 = p;
              
              // Initialize the sketch with setup
              p.setup = () => {
                p.createCanvas(WIDTH, HEIGHT);
                // Call original setup if it exists
                if (sketchFn.setup) sketchFn.setup(p);
              };
              
              // Create the draw loop
              p.draw = () => {
                if (!isPoweredOn || !isMounted) {
                  p.background(70, 70, 70);
                  return;
                }
                
                // Call the sketch's draw function
                if (sketchFn.draw) sketchFn.draw(p);
              };
              
              // Add other necessary p5 methods
              if (sketchFn.mousePressed) p.mousePressed = () => sketchFn.mousePressed(p);
              if (sketchFn.keyPressed) p.keyPressed = () => sketchFn.keyPressed(p);
              if (sketchFn.keyReleased) p.keyReleased = () => sketchFn.keyReleased(p);
              
            }, screenRef.current);
            p5InstanceRef.current = currentP5Instance;
          } catch (error) {
            console.error('Error creating p5 instance:', error);
            cleanup();
          }
        }
      });
    }
    
    return () => {
      isMounted = false;
      cleanup();
    };
  }, [isPoweredOn, sketchName]);
  
  return (
    <div 
      ref={screenRef} 
      className="gameboy-screen-inner w-full h-full overflow-hidden"
      style={{ 
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }}
    >
      {!isPoweredOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-600 pixel-text text-xs">
          POWER OFF
        </div>
      )}
    </div>
  );
};

export default Screen;