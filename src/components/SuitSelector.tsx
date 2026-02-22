import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { cn } from '../lib/utils';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
  isOpen: boolean;
}

const SUITS: { id: Suit; symbol: string; color: string; label: string }[] = [
  { id: 'hearts', symbol: '♥', color: 'text-red-600', label: 'Hearts' },
  { id: 'diamonds', symbol: '♦', color: 'text-red-600', label: 'Diamonds' },
  { id: 'clubs', symbol: '♣', color: 'text-black', label: 'Clubs' },
  { id: 'spades', symbol: '♠', color: 'text-black', label: 'Spades' },
];

export const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800 italic serif">疯狂 8 点！</h2>
            <p className="text-gray-600 mb-8">请选择新的花色：</p>
            
            <div className="grid grid-cols-2 gap-4">
              {SUITS.map((suit) => (
                <button
                  key={suit.id}
                  onClick={() => onSelect(suit.id)}
                  className="group flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-yellow-400 hover:bg-yellow-50 transition-all active:scale-95"
                >
                  <span className={cn("text-5xl mb-2 group-hover:scale-110 transition-transform", suit.color)}>
                    {suit.symbol}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">{suit.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
