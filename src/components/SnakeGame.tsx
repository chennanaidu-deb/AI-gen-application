import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction, GameState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('snake-high-score') || '0'),
  });
  const [isPaused, setIsPaused] = useState(true);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      isGameOver: false,
      score: 0,
    }));
    directionRef.current = INITIAL_DIRECTION;
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': if (directionRef.current !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isPaused || gameState.isGameOver) return;

    const moveSnake = () => {
      setGameState(prev => {
        const head = { ...prev.snake[0] };
        const newDirection = directionRef.current;

        switch (newDirection) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          const newHighScore = Math.max(prev.score, prev.highScore);
          localStorage.setItem('snake-high-score', newHighScore.toString());
          return { ...prev, isGameOver: true, highScore: newHighScore };
        }

        // Check self-collision
        if (prev.snake.some(p => p.x === head.x && p.y === head.y)) {
          const newHighScore = Math.max(prev.score, prev.highScore);
          localStorage.setItem('snake-high-score', newHighScore.toString());
          return { ...prev, isGameOver: true, highScore: newHighScore };
        }

        const newSnake = [head, ...prev.snake];
        const ateFood = head.x === prev.food.x && head.y === prev.food.y;

        if (ateFood) {
          return {
            ...prev,
            snake: newSnake,
            food: generateFood(newSnake),
            score: prev.score + 10,
            direction: newDirection
          };
        } else {
          newSnake.pop();
          return { ...prev, snake: newSnake, direction: newDirection };
        }
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isPaused, gameState.isGameOver, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(canvas.width, i * size);
        ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((p, i) => {
        // Add random jitter if moving
        const jitterX = isPaused ? 0 : (Math.random() - 0.5) * 2;
        const jitterY = isPaused ? 0 : (Math.random() - 0.5) * 2;
        
        ctx.fillStyle = i === 0 ? '#00ffff' : '#ff00ff';
        ctx.shadowBlur = 0; // Hard edges
        
        // Blocky pulse effect
        const scale = i === 0 ? 1 : 0.8 + Math.sin(Date.now() / 200 + i) * 0.1;
        const offset = (size * (1 - scale)) / 2;

        ctx.fillRect(
          p.x * size + offset + jitterX, 
          p.y * size + offset + jitterY, 
          size * scale, 
          size * scale
        );

        // Chromatic aberration effect on head
        if (i === 0) {
            ctx.strokeStyle = '#ff00ff';
            ctx.strokeRect(p.x * size + offset - 2, p.y * size + offset, size * scale, size * scale);
        }
    });

    // Draw food - Square and glitchy
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(
        gameState.food.x * size + 4 + (Math.random() - 0.5) * 4,
        gameState.food.y * size + 4 + (Math.random() - 0.5) * 4,
        size - 8,
        size - 8
    );

  }, [gameState]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-lg mx-auto" ref={containerRef}>
      {/* Stats Bar */}
      <div className="w-full flex justify-between items-end mb-4 px-4 font-pixel text-[8px]">
        <div className="flex flex-col gap-1">
          <span className="text-white/40 uppercase">DATA_STREAM</span>
          <span className="text-neon-cyan drop-shadow-[2px_2px_0_#ff00ff]">{gameState.score}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-white/40 uppercase">PEAK_BUFFER</span>
          <div className="flex items-center gap-2">
            <span className="text-neon-magenta drop-shadow-[2px_2px_0_#00ffff]">{gameState.highScore}</span>
            <Trophy size={10} className="text-neon-yellow" />
          </div>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="relative p-2 bg-black border-4 border-neon-cyan shadow-[8px_8px_0_rgba(255,0,255,0.5)] overflow-hidden crt-flicker">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black image-render-pixel"
        />
        
        {/* Overlay */}
        <AnimatePresence>
          {(isPaused || gameState.isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              {gameState.isGameOver ? (
                <div className="text-center font-pixel px-4">
                  <h2 className="text-2xl text-neon-magenta mb-4 glitch" data-text="SYSTEM_CRASH">SYSTEM_CRASH</h2>
                  <p className="text-[10px] text-white/60 mb-8 leading-relaxed">KERNEL_PANIC: SEGMENTATION_FAULT_AT_HEAD</p>
                  <button
                    onClick={resetGame}
                    className="group relative px-6 py-3 bg-neon-magenta text-white text-[10px] uppercase border-4 border-white active:translate-x-1 active:translate-y-1 transition-transform"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <RefreshCw size={14} />
                      REBOOT_PROCEDURE
                    </span>
                    <div className="absolute inset-0 bg-neon-cyan -z-10 translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="text-center font-pixel px-4">
                  <h2 className="text-2xl text-neon-cyan mb-4 glitch" data-text="NEURAL_LINK">NEURAL_LINK</h2>
                  <p className="text-[10px] text-white/60 mb-8 uppercase tracking-widest">Interface: SYNC_WAITING</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="group relative px-6 py-3 bg-neon-cyan text-black text-[10px] uppercase border-4 border-black active:translate-x-1 active:translate-y-1 transition-transform"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Play size={14} fill="currentColor" />
                      INITIALIZE_ENGINE
                    </span>
                    <div className="absolute inset-0 bg-neon-magenta -z-10 translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanline Effect */}
        <div className="scanline pointer-events-none" />
      </div>

      <div className="mt-6 flex flex-col items-center gap-2 opacity-40">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center text-[10px]">↑</div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center text-[10px]">←</div>
          <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center text-[10px]">↓</div>
          <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center text-[10px]">→</div>
        </div>
        <p className="text-[10px] uppercase font-mono tracking-tighter">Keyboard Navigation Required</p>
      </div>
    </div>
  );
}
