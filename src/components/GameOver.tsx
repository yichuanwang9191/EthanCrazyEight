import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverProps {
  winner: 'player' | 'ai' | null;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ winner, onRestart }) => {
  if (!winner) return null;

  const isPlayer = winner === 'player';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        className="bg-white rounded-3xl p-10 shadow-2xl max-w-md w-full text-center relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className={isPlayer ? "text-yellow-600 w-12 h-12" : "text-gray-400 w-12 h-12"} />
          </div>

          <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter italic">
            {isPlayer ? "获胜！" : "遗憾！"}
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            {isPlayer 
              ? "你成功击败了 AI，清空了手牌！" 
              : "AI 棋高一着，下次再接再厉！"}
          </p>

          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            再玩一局
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
