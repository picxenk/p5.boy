import { GameboySketch } from '../types/sketches';
import p5 from 'p5';

/**
 * Simple Tetris game for Gameboy
 */
const tetrisSketch: GameboySketch = {
  setup: (p: p5) => {
    // Constants
    const BLOCK_SIZE = 8;
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 18;
    const GRID_OFFSET_X = (p.width - GRID_WIDTH * BLOCK_SIZE) / 2;
    const GRID_OFFSET_Y = 10;
    
    // Game configuration
    p.config = {
      blockSize: BLOCK_SIZE,
      gridWidth: GRID_WIDTH,
      gridHeight: GRID_HEIGHT,
      gridOffsetX: GRID_OFFSET_X,
      gridOffsetY: GRID_OFFSET_Y
    };
    
    // Game state
    p.grid = createEmptyGrid(GRID_WIDTH, GRID_HEIGHT);
    p.gameState = 'start'; // start, playing, paused, gameOver
    p.score = 0;
    p.level = 1;
    p.lines = 0;
    
    // Piece related variables
    p.currentPiece = null;
    p.nextPiece = null;
    p.dropCounter = 0;
    p.dropInterval = 500; // milliseconds
    p.lastTime = 0;
    
    // Input handling
    p.keyDown = false;
    p.lastMoveTime = 0;
    p.moveDelay = 200; // milliseconds
    
    // Load tetrominos
    p.tetrominos = createTetrominos();
    p.frameRate(30);
    
    // Create the first piece
    resetPiece(p);
  },
  
  draw: (p: p5) => {
    const currentTime = p.millis();
    const deltaTime = currentTime - p.lastTime;
    p.lastTime = currentTime;
    
    // Game background
    p.background(15, 56, 15); // Dark green background
    
    // Draw game border
    p.noFill();
    p.stroke(60, 105, 60);
    p.rect(
      p.config.gridOffsetX - 1, 
      p.config.gridOffsetY - 1, 
      p.config.gridWidth * p.config.blockSize + 2, 
      p.config.gridHeight * p.config.blockSize + 2
    );
    p.noStroke();
    
    if (p.gameState === 'start') {
      // Start screen
      p.fill(90, 142, 90);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('TETRIS', p.width / 2, p.height / 2 - 15);
      p.textSize(8);
      p.text('PRESS START', p.width / 2, p.height / 2 + 5);
      
      // Start game on START button press
      if (window.gameboyControls.start) {
        p.gameState = 'playing';
      }
    } 
    else if (p.gameState === 'playing') {
      // Update drop counter
      p.dropCounter += deltaTime;
      if (p.dropCounter > p.dropInterval) {
        dropPiece(p);
        p.dropCounter = 0;
      }
      
      // Handle controls
      handleControls(p, currentTime);
      
      // Draw grid
      drawGrid(p);
      
      // Draw current piece
      drawPiece(p, p.currentPiece);
      
      // Draw UI elements
      drawUI(p);
    } 
    else if (p.gameState === 'paused') {
      // Draw grid and current piece
      drawGrid(p);
      drawPiece(p, p.currentPiece);
      
      // Draw pause overlay
      p.fill(15, 56, 15, 200);
      p.rect(0, 0, p.width, p.height);
      
      p.fill(90, 142, 90);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('PAUSED', p.width / 2, p.height / 2);
      p.textSize(8);
      p.text('PRESS START', p.width / 2, p.height / 2 + 15);
      
      // Resume game on START button press
      if (window.gameboyControls.start) {
        p.gameState = 'playing';
      }
    } 
    else if (p.gameState === 'gameOver') {
      // Draw grid
      drawGrid(p);
      
      // Draw game over overlay
      p.fill(15, 56, 15, 200);
      p.rect(0, 0, p.width, p.height);
      
      p.fill(90, 142, 90);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('GAME OVER', p.width / 2, p.height / 2 - 15);
      p.textSize(8);
      p.text('SCORE: ' + p.score, p.width / 2, p.height / 2);
      p.text('PRESS START', p.width / 2, p.height / 2 + 15);
      
      // Restart game on START button press
      if (window.gameboyControls.start) {
        p.setup();
        p.gameState = 'playing';
      }
    }
  }
};

// Create empty grid
function createEmptyGrid(width, height) {
  const grid = [];
  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      grid[y][x] = 0;
    }
  }
  return grid;
}

// Create tetromino shapes
function createTetrominos() {
  return [
    // I
    {
      shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      color: 1
    },
    // J
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: 2
    },
    // L
    {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: 3
    },
    // O
    {
      shape: [
        [1, 1],
        [1, 1]
      ],
      color: 4
    },
    // S
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      color: 5
    },
    // T
    {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: 6
    },
    // Z
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      color: 7
    }
  ];
}

// Reset the current piece
function resetPiece(p) {
  // If there's a next piece, make it the current piece
  if (p.nextPiece) {
    p.currentPiece = p.nextPiece;
  } else {
    // Create a new random piece
    const idx = Math.floor(p.random(p.tetrominos.length));
    p.currentPiece = {
      ...p.tetrominos[idx],
      position: {
        x: Math.floor(p.config.gridWidth / 2) - Math.floor(p.tetrominos[idx].shape[0].length / 2),
        y: 0
      }
    };
  }
  
  // Create a new next piece
  const nextIdx = Math.floor(p.random(p.tetrominos.length));
  p.nextPiece = {
    ...p.tetrominos[nextIdx],
    position: {
      x: Math.floor(p.config.gridWidth / 2) - Math.floor(p.tetrominos[nextIdx].shape[0].length / 2),
      y: 0
    }
  };
  
  // Check if the new piece collides immediately - game over
  if (checkCollision(p, p.currentPiece)) {
    p.gameState = 'gameOver';
  }
}

// Draw the grid
function drawGrid(p) {
  for (let y = 0; y < p.config.gridHeight; y++) {
    for (let x = 0; x < p.config.gridWidth; x++) {
      if (p.grid[y][x] !== 0) {
        const color = getBlockColor(p, p.grid[y][x]);
        p.fill(color);
        p.rect(
          p.config.gridOffsetX + x * p.config.blockSize,
          p.config.gridOffsetY + y * p.config.blockSize,
          p.config.blockSize,
          p.config.blockSize
        );
      }
    }
  }
}

// Draw a tetromino piece
function drawPiece(p, piece) {
  if (!piece) return;
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const color = getBlockColor(p, piece.color);
        p.fill(color);
        p.rect(
          p.config.gridOffsetX + (piece.position.x + x) * p.config.blockSize,
          p.config.gridOffsetY + (piece.position.y + y) * p.config.blockSize,
          p.config.blockSize,
          p.config.blockSize
        );
      }
    }
  }
}

// Draw UI elements
function drawUI(p) {
  // Draw score
  p.fill(90, 142, 90);
  p.textSize(8);
  p.textAlign(p.LEFT, p.TOP);
  p.text('SCORE: ' + p.score, 5, 5);
  p.text('LEVEL: ' + p.level, 5, 15);
  p.text('LINES: ' + p.lines, 5, 25);
  
  // Draw next piece
  p.text('NEXT:', p.width - 45, 5);
  
  if (p.nextPiece) {
    for (let y = 0; y < p.nextPiece.shape.length; y++) {
      for (let x = 0; x < p.nextPiece.shape[y].length; x++) {
        if (p.nextPiece.shape[y][x] !== 0) {
          const color = getBlockColor(p, p.nextPiece.color);
          p.fill(color);
          p.rect(
            p.width - 40 + x * 6, // Smaller blocks for the preview
            15 + y * 6,
            6,
            6
          );
        }
      }
    }
  }
}

// Get block color based on color ID
function getBlockColor(p, colorId) {
  const colors = [
    [15, 56, 15],          // Background (not used)
    [60, 105, 60],         // I piece
    [90, 142, 90],         // J piece
    [120, 160, 120],       // L piece
    [80, 130, 80],         // O piece
    [100, 150, 100],       // S piece
    [70, 120, 70],         // T piece
    [90, 135, 90]          // Z piece
  ];
  
  return colors[colorId];
}

// Check if a piece collides with walls or existing blocks
function checkCollision(p, piece) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const newX = piece.position.x + x;
        const newY = piece.position.y + y;
        
        // Check boundaries
        if (
          newX < 0 || 
          newX >= p.config.gridWidth || 
          newY >= p.config.gridHeight
        ) {
          return true;
        }
        
        // Check collision with existing blocks
        if (newY >= 0 && p.grid[newY][newX] !== 0) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Move the current piece
function movePiece(p, direction) {
  const newPosition = {
    x: p.currentPiece.position.x,
    y: p.currentPiece.position.y
  };
  
  if (direction === 'left') {
    newPosition.x -= 1;
  } else if (direction === 'right') {
    newPosition.x += 1;
  } else if (direction === 'down') {
    newPosition.y += 1;
  }
  
  const movedPiece = {
    ...p.currentPiece,
    position: newPosition
  };
  
  if (!checkCollision(p, movedPiece)) {
    p.currentPiece = movedPiece;
    return true;
  }
  
  return false;
}

// Drop the current piece one step down
function dropPiece(p) {
  if (!movePiece(p, 'down')) {
    // If cannot move down, lock the piece in place
    mergePiece(p);
    clearLines(p);
    resetPiece(p);
  }
}

// Hard drop the current piece
function hardDrop(p) {
  while (movePiece(p, 'down')) {
    // Move down until collision
    p.score += 1;
  }
  
  // Lock piece in place
  mergePiece(p);
  clearLines(p);
  resetPiece(p);
}

// Merge the current piece into the grid
function mergePiece(p) {
  for (let y = 0; y < p.currentPiece.shape.length; y++) {
    for (let x = 0; x < p.currentPiece.shape[y].length; x++) {
      if (p.currentPiece.shape[y][x] !== 0) {
        const newY = p.currentPiece.position.y + y;
        const newX = p.currentPiece.position.x + x;
        
        if (newY >= 0) {
          p.grid[newY][newX] = p.currentPiece.color;
        }
      }
    }
  }
}

// Clear completed lines
function clearLines(p) {
  let linesCleared = 0;
  
  for (let y = p.config.gridHeight - 1; y >= 0; y--) {
    let lineComplete = true;
    
    for (let x = 0; x < p.config.gridWidth; x++) {
      if (p.grid[y][x] === 0) {
        lineComplete = false;
        break;
      }
    }
    
    if (lineComplete) {
      // Clear the line
      for (let yy = y; yy > 0; yy--) {
        for (let x = 0; x < p.config.gridWidth; x++) {
          p.grid[yy][x] = p.grid[yy - 1][x];
        }
      }
      
      // Clear the top line
      for (let x = 0; x < p.config.gridWidth; x++) {
        p.grid[0][x] = 0;
      }
      
      // Move the check position back
      y++;
      linesCleared++;
    }
  }
  
  // Update score and level
  if (linesCleared > 0) {
    const points = [0, 40, 100, 300, 1200];
    p.score += points[linesCleared] * p.level;
    p.lines += linesCleared;
    
    // Level up every 10 lines
    p.level = Math.floor(p.lines / 10) + 1;
    
    // Adjust drop speed based on level
    p.dropInterval = Math.max(100, 500 - (p.level - 1) * 50);
  }
}

// Rotate the current piece
function rotatePiece(p) {
  const rotatedShape = [];
  
  // Create a new rotated shape matrix
  for (let y = 0; y < p.currentPiece.shape[0].length; y++) {
    rotatedShape[y] = [];
    for (let x = 0; x < p.currentPiece.shape.length; x++) {
      rotatedShape[y][x] = p.currentPiece.shape[p.currentPiece.shape.length - 1 - x][y];
    }
  }
  
  const rotatedPiece = {
    ...p.currentPiece,
    shape: rotatedShape
  };
  
  // Wall kick - try to adjust position if rotation causes collision
  if (!checkCollision(p, rotatedPiece)) {
    p.currentPiece = rotatedPiece;
  } else {
    // Try to move left
    rotatedPiece.position.x -= 1;
    if (!checkCollision(p, rotatedPiece)) {
      p.currentPiece = rotatedPiece;
    } else {
      // Try to move right
      rotatedPiece.position.x += 2;
      if (!checkCollision(p, rotatedPiece)) {
        p.currentPiece = rotatedPiece;
      }
    }
  }
}

// Handle user controls
function handleControls(p, currentTime) {
  // Start/Pause
  if (window.gameboyControls.start && !p.keyDown) {
    p.gameState = p.gameState === 'playing' ? 'paused' : 'playing';
    p.keyDown = true;
  } else if (!window.gameboyControls.start) {
    p.keyDown = false;
  }
  
  // Only process movement if enough time has passed since last move
  if (currentTime - p.lastMoveTime > p.moveDelay) {
    if (window.gameboyControls.left) {
      movePiece(p, 'left');
      p.lastMoveTime = currentTime;
    } else if (window.gameboyControls.right) {
      movePiece(p, 'right');
      p.lastMoveTime = currentTime;
    }
    
    if (window.gameboyControls.down) {
      movePiece(p, 'down');
      p.lastMoveTime = currentTime;
    }
  }
  
  // Rotate with A button (single press)
  if (window.gameboyControls.a && !p.aPressed) {
    rotatePiece(p);
    p.aPressed = true;
  } else if (!window.gameboyControls.a) {
    p.aPressed = false;
  }
  
  // Hard drop with B button (single press)
  if (window.gameboyControls.b && !p.bPressed) {
    hardDrop(p);
    p.bPressed = true;
  } else if (!window.gameboyControls.b) {
    p.bPressed = false;
  }
}

export default tetrisSketch;