import React from 'react';
import { motion } from 'motion/react';
import { Play, HelpCircle } from 'lucide-react';

interface StartMenuProps {
  onStart: () => void;
  onShowRules: () => void;
  wins: number;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStart, onShowRules, wins }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-emerald-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Decorative Background Cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 border-4 border-white/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] border-4 border-white/5 rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-12 mb-6 mx-auto">
            <span className="text-black font-black text-5xl italic">8</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter italic uppercase text-white leading-none">
            ETHAN<br />
            <span className="text-yellow-400">CRAZY EIGHTS</span>
          </h1>
          <p className="mt-4 text-emerald-200/60 font-medium tracking-widest uppercase text-sm">
            经典疯狂 8 点纸牌游戏
          </p>
          
          {wins > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex flex-col items-center gap-2"
            >
              <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Play className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-tighter">累计胜利:</span>
                <span className="text-sm font-black text-yellow-400">{wins}</span>
              </div>
              <div className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.2em]">
                当前挑战胜率: {Math.max(1, 95 - Math.floor(wins / 3))}%
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col gap-4 w-full"
        >
          <button
            onClick={onStart}
            className="group relative flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-black text-xl hover:bg-yellow-400 transition-all active:scale-95 shadow-[0_8px_0_rgb(200,200,200)] hover:shadow-[0_8px_0_rgb(202,138,4)] hover:-translate-y-1"
          >
            <Play className="w-6 h-6 fill-current" />
            开始游戏
          </button>

          <button
            onClick={onShowRules}
            className="flex items-center justify-center gap-2 bg-emerald-900/50 text-white/80 py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all border border-white/10"
          >
            <HelpCircle className="w-5 h-5" />
            游戏规则
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-white/20 text-xs font-mono uppercase tracking-[0.3em]"
        >
          Built for Ethan • 2024
        </motion.div>
      </div>
    </div>
  );
};
