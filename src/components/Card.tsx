import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType, Suit } from '../types';
import { cn } from '../lib/utils';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  isFaceDown?: boolean;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-black',
  spades: 'text-black',
};

export const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  isPlayable, 
  className,
  isFaceDown = false 
}) => {
  if (!card) return null;

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  if (isFaceDown) {
    return (
      <motion.div
        layoutId={card.id}
        className={cn(
          "w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 border-white bg-blue-800 shadow-lg flex items-center justify-center overflow-hidden relative",
          className
        )}
      >
        <div className="absolute inset-1 border border-white/20 rounded-md flex items-center justify-center">
           <div className="w-full h-full opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:10px_10px]" />
           <span className="text-white/40 font-bold text-xl rotate-45">ETHAN</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={card.id}
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        "w-20 h-28 sm:w-24 sm:h-36 rounded-lg bg-white border-2 shadow-lg flex flex-col items-center justify-center cursor-default select-none relative overflow-hidden",
        isPlayable ? "border-yellow-400 cursor-pointer ring-4 ring-yellow-400/30" : "border-gray-200",
        className
      )}
    >
      <div className={cn("flex flex-col items-center justify-center", SUIT_COLORS[card.suit])}>
        <span className="text-3xl sm:text-4xl font-black leading-none mb-1">{card.rank}</span>
        <span className="text-2xl sm:text-3xl">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      
      {/* Subtle background pattern for a "crafted" feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
        <span className="text-9xl font-black rotate-12">{card.rank}</span>
      </div>
    </motion.div>
  );
};
