import { GameboySketch } from '../types/sketches';

// A cache for loaded sketches to avoid unnecessary fetching
const sketchCache: Record<string, GameboySketch> = {};

/**
 * Loads a sketch by name from the sketches directory
 */
export const loadSketch = async (sketchName: string): Promise<GameboySketch> => {
  // If sketch is already in cache, return it
  if (sketchCache[sketchName]) {
    return sketchCache[sketchName];
  }
  
  try {
    // Dynamic import of the sketch module
    let sketchModule;
    
    switch (sketchName) {
      case 'pong':
        sketchModule = await import('./pong');
        break;
      case 'snake':
        sketchModule = await import('./snake');
        break;
      case 'tetris':
        sketchModule = await import('./tetris');
        break;
      default:
        // Default to pong if sketch not found
        sketchModule = await import('./pong');
    }
    
    // Cache the sketch for future use
    sketchCache[sketchName] = sketchModule.default;
    
    // Call the onGameboyLoad lifecycle method if it exists
    if (sketchModule.default.onGameboyLoad) {
      sketchModule.default.onGameboyLoad();
    }
    
    return sketchModule.default;
  } catch (error) {
    console.error(`Failed to load sketch "${sketchName}":`, error);
    
    // Return a placeholder sketch on error
    return {
      setup: (p) => {
        p.background(70, 80, 70);
      },
      draw: (p) => {
        p.background(70, 80, 70);
        p.fill(255);
        p.textSize(8);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`Error loading "${sketchName}"`, p.width / 2, p.height / 2 - 10);
        p.text("Please check console", p.width / 2, p.height / 2 + 10);
      }
    };
  }
};