import { GameboySketch } from '../types/sketches';
import p5 from 'p5';

/**
 * Classic Snake game for Gameboy
 */
const snakeSketch: GameboySketch = {
  setup: (p: p5) => {
    const GRID_SIZE = 8;
    p.gridSize = GRID_SIZE;
    p.cols = Math.floor(p.width / GRID_SIZE);
    p.rows = Math.floor(p.height / GRID_SIZE);
    
    // Initialize game state
    p.snake = [
      {x: Math.floor(p.cols / 2), y: Math.floor(p.rows / 2)}
    ];
    p.food = createFood(p);
    p.direction = 'right';
    p.nextDirection = 'right';
    p.score = 0;
    p.gameState = 'start'; // start, playing, gameOver
    p.frameRate(8); // Lower frameRate for slower game speed
  },
  
  draw: (p: p5) => {
    // Game background
    p.background(15, 56, 15); // Dark green background
    
    // Draw score
    p.fill(60, 105, 60);
    p.textSize(8);
    p.textAlign(p.LEFT, p.TOP);
    p.text('SCORE: ' + p.score, 5, 5);
    
    if (p.gameState === 'start') {
      p.fill(90, 142, 90);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('SNAKE', p.width / 2, p.height / 2 - 15);
      p.textSize(8);
      p.text('PRESS START', p.width / 2, p.height / 2 + 5);
      
      // Start game on START button press
      if (window.gameboyControls.start) {
        p.gameState = 'playing';
      }
    } 
    else if (p.gameState === 'playing') {
      // Handle direction changes
      if (window.gameboyControls.up && p.direction !== 'down') {
        p.nextDirection = 'up';
      } else if (window.gameboyControls.down && p.direction !== 'up') {
        p.nextDirection = 'down';
      } else if (window.gameboyControls.left && p.direction !== 'right') {
        p.nextDirection = 'left';
      } else if (window.gameboyControls.right && p.direction !== 'left') {
        p.nextDirection = 'right';
      }
      
      // Update snake position
      updateSnake(p);
      
      // Check for game over conditions
      checkGameOver(p);
      
      // Draw snake
      p.fill(90, 142, 90);
      for (let i = 0; i < p.snake.length; i++) {
        const cell = p.snake[i];
        p.rect(
          cell.x * p.gridSize, 
          cell.y * p.gridSize, 
          p.gridSize, 
          p.gridSize
        );
      }
      
      // Draw food
      p.fill(142, 90, 90);
      p.rect(
        p.food.x * p.gridSize,
        p.food.y * p.gridSize,
        p.gridSize,
        p.gridSize
      );
    } 
    else if (p.gameState === 'gameOver') {
      // Game Over screen
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

// Create food at a random location not occupied by the snake
function createFood(p: p5) {
  let foodX, foodY;
  let validPosition = false;
  
  while (!validPosition) {
    foodX = Math.floor(p.random(p.cols));
    foodY = Math.floor(p.random(p.rows));
    validPosition = true;
    
    // Check if the food is not on the snake
    for (let i = 0; i < p.snake.length; i++) {
      if (p.snake[i].x === foodX && p.snake[i].y === foodY) {
        validPosition = false;
        break;
      }
    }
  }
  
  return { x: foodX, y: foodY };
}

// Update snake position based on current direction
function updateSnake(p: p5) {
  // Set current direction to next direction
  p.direction = p.nextDirection;
  
  // Calculate new head position
  const head = { ...p.snake[0] };
  
  switch (p.direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }
  
  // Check if snake eats food
  if (head.x === p.food.x && head.y === p.food.y) {
    p.food = createFood(p);
    p.score += 1;
    // No need to remove tail as the snake grows
  } else {
    // Remove tail
    p.snake.pop();
  }
  
  // Add new head
  p.snake.unshift(head);
}

// Check for game over conditions
function checkGameOver(p: p5) {
  const head = p.snake[0];
  
  // Check if snake hits the walls
  if (head.x < 0 || head.x >= p.cols || head.y < 0 || head.y >= p.rows) {
    p.gameState = 'gameOver';
    return;
  }
  
  // Check if snake hits itself
  for (let i = 1; i < p.snake.length; i++) {
    if (head.x === p.snake[i].x && head.y === p.snake[i].y) {
      p.gameState = 'gameOver';
      return;
    }
  }
}

export default snakeSketch;