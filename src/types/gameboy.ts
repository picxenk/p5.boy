// Define global types for the Gameboy API

// Controls for the Gameboy
export interface GameboyControls {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  a: boolean;
  b: boolean;
  start: boolean;
  select: boolean;
}

// Extend window interface to include Gameboy globals
declare global {
  interface Window {
    gameboyControls: GameboyControls;
    gameboyP5: any; // p5 instance
  }
}