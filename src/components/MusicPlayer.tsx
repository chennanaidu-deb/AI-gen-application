import React, { useState, useEffect, useMemo } from 'react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music2, Share2, Heart, Volume2 } from 'lucide-react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cybernetic Pulse',
    artist: 'AI Voyager',
    coverUrl: 'https://picsum.photos/seed/cyber1/400/400',
    duration: 184,
  },
  {
    id: '2',
    title: 'Neon Skyline',
    artist: 'Synth Mind',
    coverUrl: 'https://picsum.photos/seed/cyber2/400/400',
    duration: 212,
  },
  {
    id: '3',
    title: 'Synthetic Dreams',
    artist: 'Neural Network',
    coverUrl: 'https://picsum.photos/seed/cyber3/400/400',
    duration: 156,
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(12).fill(10));

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
        
        // Randomize visualizer bars
        setVisualizerBars(prev => prev.map(() => 10 + Math.random() * 80));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.duration]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % DUMMY_TRACKS.length);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(prev => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="w-full h-full flex flex-col p-6 animate-in fade-in duration-700 bg-black/40">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Album Cover with Glitch Effect */}
        <div className="relative group overflow-hidden">
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 md:w-56 md:h-56 border-4 border-white shadow-[12px_12px_0_#00ffff] z-10 relative bg-black overflow-hidden"
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover mix-blend-screen transition-transform duration-1000 ${isPlaying ? 'scale-110 sepia invert hue-rotate-90' : 'scale-100'}`}
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <>
                <div className="absolute inset-0 bg-transparent mix-blend-overlay pointer-events-none glitch" data-text="" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-magenta animate-[scanline_2s_linear_infinite]" />
              </>
            )}
          </motion.div>

          {/* Visualizer Ring - Jagged */}
          <div className="absolute -inset-4 z-0 pointer-events-none">
            <div className={`absolute inset-0 border-2 border-dashed border-neon-magenta/30 animate-[spin_10s_linear_infinite] ${isPlaying ? 'block' : 'hidden'}`} />
          </div>
        </div>

        {/* Track Title & Artist - Pixel Font */}
        <div className="text-center mt-4 font-pixel">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg tracking-tighter text-white glitch" data-text={currentTrack.title.toUpperCase()}>
                {currentTrack.title.toUpperCase()}
              </h3>
              <p className="text-neon-yellow text-[8px] tracking-[0.3em] opacity-80">ORIGIN: {currentTrack.artist.toUpperCase()}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar - Minimal/Raw */}
        <div className="w-full max-w-sm space-y-3 font-pixel">
          <div className="h-4 w-full bg-white/5 border-2 border-white/20 relative overflow-hidden">
            <motion.div
              className="h-full bg-neon-cyan/50 backdrop-invert"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[6px] text-white/40">BUFFERING_STREAM... {(progress).toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex justify-between text-[7px] text-white/40 tracking-wider">
            <span>OFFSET:: {formatTime(currentTime)}</span>
            <span>END:: {formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls - Industrial Buttons */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handlePrev} 
            className="p-3 border-2 border-white/20 text-white/40 hover:text-neon-cyan hover:border-neon-cyan transition-all active:scale-90"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-white text-black border-4 border-black ring-4 ring-white/20 flex items-center justify-center hover:bg-neon-magenta hover:text-white transition-all active:translate-x-1 active:translate-y-1"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
          </button>

          <button 
            onClick={handleNext} 
            className="p-3 border-2 border-white/20 text-white/40 hover:text-neon-cyan hover:border-neon-cyan transition-all active:scale-90"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Footer Controls - Brutalist */}
      <div className="border-t-2 border-white/10 mt-8 pt-6 flex items-center justify-between font-pixel text-[6px]">
        <div className="flex items-center gap-6 text-white/30 uppercase">
          <button className="hover:text-neon-magenta transition-colors flex items-center gap-1">
            <Heart size={12} /> SAVE
          </button>
          <button className="hover:text-neon-cyan transition-colors flex items-center gap-1">
            <Share2 size={12} /> BROADCAST
          </button>
        </div>
        <div className="flex items-center gap-3 opacity-50">
          <Volume2 size={12} className="text-white" />
          <div className="w-16 h-2 bg-white/10 border border-white/20 relative">
             <div className="absolute top-0 left-0 bottom-0 bg-neon-cyan w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
