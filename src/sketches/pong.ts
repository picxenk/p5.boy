import { GameboySketch } from '../types/sketches';
import p5 from 'p5';

/**
 * Classic Pong game for Gameboy
 */
const pongSketch: GameboySketch = {
  setup: (p: p5) => {
    // Game variables are initialized in setup to ensure they're reset on each start
    p.ball = {
      x: p.width / 2,
      y: p.height / 2,
      size: 4,
      speedX: 1.5,
      speedY: 1.5
    };
    
    p.paddle1 = {
      x: 10,
      y: p.height / 2,
      width: 4,
      height: 20,
      speed: 2
    };
    
    p.paddle2 = {
      x: p.width - 14,
      y: p.height / 2,
      width: 4,
      height: 20,
      speed: 2
    };
    
    p.score = {
      player1: 0,
      player2: 0
    };
    
    p.gameState = 'start'; // start, playing, gameOver
  },
  
  draw: (p: p5) => {
    // Game background
    p.background(15, 56, 15); // Dark green background
    
    // Draw center line
    p.stroke(60, 105, 60);
    p.strokeWeight(2);
    p.line(p.width / 2, 0, p.width / 2, p.height);
    p.noStroke();
    
    // Draw scores
    p.fill(60, 105, 60);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(p.score.player1, p.width * 0.25, 15);
    p.text(p.score.player2, p.width * 0.75, 15);
    
    // Draw paddles
    p.fill(90, 142, 90);
    p.rect(p.paddle1.x, p.paddle1.y - p.paddle1.height / 2, p.paddle1.width, p.paddle1.height);
    p.rect(p.paddle2.x, p.paddle2.y - p.paddle2.height / 2, p.paddle2.width, p.paddle2.height);
    
    // Draw ball
    p.ellipse(p.ball.x, p.ball.y, p.ball.size);
    
    // Game state handling
    if (p.gameState === 'start') {
      p.textSize(8);
      p.text('PRESS START', p.width / 2, p.height / 2);
      
      // Start game on START button press
      if (window.gameboyControls.start) {
        p.gameState = 'playing';
      }
    } 
    else if (p.gameState === 'playing') {
      // Move ball
      p.ball.x += p.ball.speedX;
      p.ball.y += p.ball.speedY;
      
      // Handle paddle movement with Gameboy controls
      // Player 1 (Left)
      if (window.gameboyControls.up) {
        p.paddle1.y = Math.max(p.paddle1.height / 2, p.paddle1.y - p.paddle1.speed);
      }
      if (window.gameboyControls.down) {
        p.paddle1.y = Math.min(p.height - p.paddle1.height / 2, p.paddle1.y + p.paddle1.speed);
      }
      
      // Player 2 (Right) - Simple AI
      // Make the AI move toward the ball with some delay
      const targetY = p.ball.y;
      if (p.paddle2.y < targetY - 5) {
        p.paddle2.y = Math.min(p.height - p.paddle2.height / 2, p.paddle2.y + p.paddle2.speed * 0.8);
      } else if (p.paddle2.y > targetY + 5) {
        p.paddle2.y = Math.max(p.paddle2.height / 2, p.paddle2.y - p.paddle2.speed * 0.8);
      }
      
      // Ball collision with top and bottom walls
      if (p.ball.y - p.ball.size / 2 <= 0 || p.ball.y + p.ball.size / 2 >= p.height) {
        p.ball.speedY *= -1;
      }
      
      // Ball collision with paddles
      // Left paddle (Player 1)
      if (
        p.ball.x - p.ball.size / 2 <= p.paddle1.x + p.paddle1.width &&
        p.ball.y >= p.paddle1.y - p.paddle1.height / 2 &&
        p.ball.y <= p.paddle1.y + p.paddle1.height / 2 &&
        p.ball.speedX < 0
      ) {
        p.ball.speedX *= -1;
        // Slightly randomize the return angle
        p.ball.speedY += (p.ball.y - p.paddle1.y) * 0.1;
      }
      
      // Right paddle (Player 2 / AI)
      if (
        p.ball.x + p.ball.size / 2 >= p.paddle2.x &&
        p.ball.y >= p.paddle2.y - p.paddle2.height / 2 &&
        p.ball.y <= p.paddle2.y + p.paddle2.height / 2 &&
        p.ball.speedX > 0
      ) {
        p.ball.speedX *= -1;
        // Slightly randomize the return angle
        p.ball.speedY += (p.ball.y - p.paddle2.y) * 0.1;
      }
      
      // Ball out of bounds - scoring
      if (p.ball.x - p.ball.size / 2 <= 0) {
        // Player 2 scores
        p.score.player2 += 1;
        resetBall(p);
      } else if (p.ball.x + p.ball.size / 2 >= p.width) {
        // Player 1 scores
        p.score.player1 += 1;
        resetBall(p);
      }
      
      // Check win condition (first to 5 points)
      if (p.score.player1 >= 5 || p.score.player2 >= 5) {
        p.gameState = 'gameOver';
      }
    } 
    else if (p.gameState === 'gameOver') {
      // Game Over screen
      p.textSize(10);
      const winner = p.score.player1 >= 5 ? 'YOU WIN!' : 'CPU WINS!';
      p.text(winner, p.width / 2, p.height / 2 - 10);
      p.textSize(8);
      p.text('PRESS START', p.width / 2, p.height / 2 + 10);
      
      // Restart game on START button press
      if (window.gameboyControls.start) {
        p.score.player1 = 0;
        p.score.player2 = 0;
        resetBall(p);
        p.gameState = 'playing';
      }
    }
  }
};

// Helper function to reset the ball to the center with a random direction
function resetBall(p: p5) {
  p.ball.x = p.width / 2;
  p.ball.y = p.height / 2;
  
  // Randomize direction but ensure it's not too vertical
  const angle = p.random(-p.PI/4, p.PI/4) + (p.random() > 0.5 ? 0 : p.PI);
  const speed = 1.5;
  p.ball.speedX = p.cos(angle) * speed;
  p.ball.speedY = p.sin(angle) * speed;
}

// Attach the reset function to p5 instance to make it accessible
(pongSketch as any).resetBall = resetBall;

export default pongSketch;