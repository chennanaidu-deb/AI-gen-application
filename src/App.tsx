/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Zap, Radio, Heart } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-dark overflow-hidden flex flex-col relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-magenta/30 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header / Top Bar */}
      <header className="relative z-20 h-16 border-b-2 border-white/20 bg-black px-6 flex items-center justify-between font-pixel">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-neon-cyan flex items-center justify-center shadow-[4px_4px_0_#ff00ff]">
            <Cpu className="text-neon-cyan" size={20} />
          </div>
          <div>
            <h1 className="text-sm tracking-tighter glitch" data-text="NEURAL_SNAKE_V1.0">NEURAL_SNAKE_V1.0</h1>
            <div className="flex items-center gap-2">
              <span className="text-[6px] text-neon-lime animate-pulse">UP_LINK: STABLE</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[8px] text-white/30 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <Zap size={10} className="text-neon-yellow" />
            <span>PWR_CORE:: 98%</span>
          </div>
          <div className="flex items-center gap-2 border-x border-white/10 px-8">
            <Radio size={10} className="text-neon-cyan" />
            <span>FREQ_RANGE:: GHZ_MODE</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal size={10} className="text-neon-magenta" />
            <span>LOG:: ENABLED</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2 py-1 border border-white/30 text-[6px] text-white/50">
            ROOT_ACCESS_GRANTED
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[200px_1fr_400px] h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Side Navigation / Quick Stats (Desktop Only) */}
        <div className="hidden xl:flex flex-col border-r-2 border-white/10 p-6 gap-8 font-pixel">
          <div className="space-y-8">
            <div className="p-4 border-2 border-white/20 hover:border-neon-cyan transition-colors bg-white/5 cursor-pointer shadow-[4px_4px_0_rgba(255,255,255,0.05)]">
              <Zap className="text-neon-cyan mb-3" size={16} />
              <div className="text-[6px] text-white/30 uppercase mb-1">UP_TIME</div>
              <div className="text-[10px]">14:22:04</div>
            </div>
            <div className="p-4 border-2 border-white/20 hover:border-neon-magenta transition-colors bg-white/5 cursor-pointer shadow-[4px_4px_0_rgba(255,255,255,0.05)]">
              <Heart className="text-neon-magenta mb-3" size={16} />
              <div className="text-[6px] text-white/30 uppercase mb-1">BIO_SIG</div>
              <div className="text-[10px]">NOMINAL</div>
            </div>
          </div>
          
          <div className="mt-auto space-y-4">
             <div className="text-[6px] text-white/20 uppercase tracking-widest text-center">KERNEL_LOG</div>
             <div className="p-2 border border-white/10 space-y-2 opacity-50">
                <div className="h-0.5 w-full bg-neon-cyan" />
                <div className="h-0.5 w-3/4 bg-white" />
                <div className="h-0.5 w-1/2 bg-neon-magenta" />
             </div>
          </div>
        </div>

        {/* Center Section: The Game */}
        <section className="p-4 md:p-8 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.03)_0%,transparent_70%)] overflow-y-auto custom-scrollbar">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <SnakeGame />
          </motion.div>
        </section>

        {/* Right Section: The Player */}
        <section className="hidden lg:block border-l border-border-dim bg-card-dark/40 backdrop-blur-sm shadow-2xl relative overflow-hidden">
          {/* Animated Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
          
          <div className="relative h-full flex flex-col">
            <div className="flex items-center gap-3 p-6 border-b border-border-dim">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Neural Audio Stream</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <MusicPlayer />
            </div>
          </div>
        </section>

        {/* Floating Mobile Player Trigger (Mobile Only) */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
           <button className="w-14 h-14 rounded-full bg-neon-cyan text-bg-dark shadow-[0_0_20px_rgba(0,243,255,0.5)] flex items-center justify-center">
              <Radio size={24} />
           </button>
        </div>
      </main>

      {/* Global CSS for Custom Scrollbar and such */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 243, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

