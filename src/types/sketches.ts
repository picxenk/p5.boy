import p5 from 'p5';

// Define the interface for a GameboySketch
export interface GameboySketch {
  // Required p5 functions
  setup?: (p: p5) => void;
  draw?: (p: p5) => void;
  
  // Optional p5 event handlers
  mousePressed?: (p: p5) => void;
  mouseReleased?: (p: p5) => void;
  keyPressed?: (p: p5) => void;
  keyReleased?: (p: p5) => void;
  
  // Gameboy specific lifecycle events
  onGameboyLoad?: () => void;
  onGameboyUnload?: () => void;
}