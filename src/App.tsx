import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card as CardComponent } from './components/Card';
import { SuitSelector } from './components/SuitSelector';
import { GameOver } from './components/GameOver';
import { StartMenu } from './components/StartMenu';
import { Card, Suit, GameState, GameStatus } from './types';
import { createDeck, canPlayCard, getBestSuitForAI, shuffle } from './gameLogic';
import { Info, HelpCircle, Volume2, VolumeX, Trophy } from 'lucide-react';
import { cn } from './lib/utils';
import confetti from 'canvas-confetti';

const INITIAL_HAND_SIZE = 8;

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    discardPile: [],
    playerHand: [],
    aiHand: [],
    currentTurn: 'player',
    status: 'menu',
    winner: null,
    activeSuit: null,
  });

  const [isMuted, setIsMuted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [wins, setWins] = useState(0);

  const currentWinRate = Math.max(1, 95 - Math.floor(wins / 3));

  // Initialize game
  const initGame = useCallback(() => {
    setWins(0); // 每次开始清零胜利数
    const fullDeck = createDeck();
    const playerHand = fullDeck.splice(0, INITIAL_HAND_SIZE);
    const aiHand = fullDeck.splice(0, INITIAL_HAND_SIZE);
    const firstDiscard = fullDeck.pop()!;
    
    let discard = firstDiscard;
    if (discard.rank === '8') {
      fullDeck.unshift(discard);
      discard = fullDeck.pop()!;
    }

    setGameState({
      deck: fullDeck,
      discardPile: [discard],
      playerHand,
      aiHand,
      currentTurn: 'player',
      status: 'playing',
      winner: null,
      activeSuit: null,
    });
  }, []);

  // Removed auto-init useEffect

  // Handle Player Card Play
  const playCard = (card: Card) => {
    if (gameState.currentTurn !== 'player' || gameState.status !== 'playing') return;

    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    if (!canPlayCard(card, topCard, gameState.activeSuit)) return;

    const newPlayerHand = gameState.playerHand.filter(c => c.id !== card.id);
    const newDiscardPile = [...gameState.discardPile, card];

    if (card.rank === '8') {
      setGameState(prev => ({
        ...prev,
        playerHand: newPlayerHand,
        discardPile: newDiscardPile,
        status: 'choosing_suit',
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        playerHand: newPlayerHand,
        discardPile: newDiscardPile,
        currentTurn: 'ai',
        activeSuit: null,
      }));
    }
  };

  // Handle Suit Selection (after playing an 8)
  const handleSuitSelect = (suit: Suit) => {
    setGameState(prev => ({
      ...prev,
      activeSuit: suit,
      status: 'playing',
      currentTurn: prev.currentTurn === 'player' ? 'ai' : 'player',
    }));
  };

  // Handle Drawing a Card
  const drawCard = () => {
    if (gameState.currentTurn !== 'player' || gameState.status !== 'playing') return;

    if (gameState.deck.length === 0) {
      // If deck is empty, skip turn
      setGameState(prev => ({ ...prev, currentTurn: 'ai' }));
      return;
    }

    const newDeck = [...gameState.deck];
    const drawnCard = newDeck.pop()!;
    
    setGameState(prev => ({
      ...prev,
      deck: newDeck,
      playerHand: [...prev.playerHand, drawnCard],
      currentTurn: 'ai', // Drawing ends turn in this version
    }));
  };

  // AI Logic
  useEffect(() => {
    if (gameState.currentTurn === 'ai' && gameState.status === 'playing' && !gameState.winner) {
      const timer = setTimeout(() => {
        const topCard = gameState.discardPile[gameState.discardPile.length - 1];
        const playableCards = gameState.aiHand.filter(c => canPlayCard(c, topCard, gameState.activeSuit));

        // 难度逻辑：根据当前胜率决定 AI 是否“放水”
        // 胜率越高，AI 越容易“犯错”（故意不放牌而选择摸牌）
        const shouldMakeMistake = Math.random() < (currentWinRate / 100);

        if (playableCards.length > 0 && !shouldMakeMistake) {
          // AI 正常出牌
          const nonEightCards = playableCards.filter(c => c.rank !== '8');
          const cardToPlay = nonEightCards.length > 0 ? nonEightCards[0] : playableCards[0];

          const newAiHand = gameState.aiHand.filter(c => c.id !== cardToPlay.id);
          const newDiscardPile = [...gameState.discardPile, cardToPlay];

          if (cardToPlay.rank === '8') {
            const bestSuit = getBestSuitForAI(newAiHand);
            setGameState(prev => ({
              ...prev,
              aiHand: newAiHand,
              discardPile: newDiscardPile,
              activeSuit: bestSuit,
              currentTurn: 'player',
            }));
          } else {
            setGameState(prev => ({
              ...prev,
              aiHand: newAiHand,
              discardPile: newDiscardPile,
              currentTurn: 'player',
              activeSuit: null,
            }));
          }
        } else {
          // AI draws a card
          if (gameState.deck.length > 0) {
            const newDeck = [...gameState.deck];
            const drawnCard = newDeck.pop()!;
            setGameState(prev => ({
              ...prev,
              deck: newDeck,
              aiHand: [...prev.aiHand, drawnCard],
              currentTurn: 'player',
            }));
          } else {
            // Deck empty, AI skips
            setGameState(prev => ({ ...prev, currentTurn: 'player' }));
          }
        }
      }, 1500); // AI "thinks" for 1.5s

      return () => clearTimeout(timer);
    }
  }, [gameState.currentTurn, gameState.status, gameState.aiHand, gameState.discardPile, gameState.activeSuit, gameState.deck, gameState.winner]);

  // Check for Winner
  useEffect(() => {
    if (gameState.playerHand.length === 0 && gameState.status === 'playing') {
      setGameState(prev => ({ ...prev, status: 'game_over', winner: 'player' }));
      setWins(prev => prev + 1);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (gameState.aiHand.length === 0 && gameState.status === 'playing') {
      setGameState(prev => ({ ...prev, status: 'game_over', winner: 'ai' }));
    }
  }, [gameState.playerHand.length, gameState.aiHand.length, gameState.status]);

  // Handle Deck Depletion (Reshuffle discard pile back into deck)
  useEffect(() => {
    if (gameState.deck.length === 0 && gameState.discardPile.length > 1) {
      const topCard = gameState.discardPile[gameState.discardPile.length - 1];
      const restOfPile = gameState.discardPile.slice(0, -1);
      setGameState(prev => ({
        ...prev,
        deck: shuffle(restOfPile),
        discardPile: [topCard],
      }));
    }
  }, [gameState.deck.length, gameState.discardPile.length]);

  const topDiscard = gameState.discardPile[gameState.discardPile.length - 1];

  return (
    <div className="min-h-screen bg-emerald-900 text-white font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
            <span className="text-black font-black text-xl">8</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tighter italic uppercase">
            Ethan <span className="text-yellow-400">Crazy Eights</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/5 mr-1 sm:mr-2">
            <Trophy className="w-3 h-3 sm:w-4 h-4 text-yellow-400" />
            <span className="hidden xs:inline text-[10px] sm:text-xs font-black uppercase tracking-wider">胜率:</span>
            <span className="text-xs sm:text-sm font-black text-yellow-400">{currentWinRate}%</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/5 mr-1 sm:mr-2">
            <span className="hidden xs:inline text-[10px] sm:text-xs font-black uppercase tracking-wider">胜利:</span>
            <span className="text-xs sm:text-sm font-black text-white">{wins}</span>
          </div>
          <button 
            onClick={() => setShowRules(!showRules)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 relative flex flex-col justify-between p-4 sm:p-8">
        
        {/* AI Hand */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              gameState.currentTurn === 'ai' ? "bg-yellow-400 text-black scale-110 shadow-lg" : "bg-white/10 text-white/60"
            )}>
              AI 对手 {gameState.currentTurn === 'ai' && "• 思考中..."}
            </div>
            <div className="bg-white text-black px-3 py-2 rounded-xl flex flex-col items-center justify-center shadow-xl border-2 border-gray-100 transform hover:scale-105 transition-transform min-w-[60px]">
              <span className="text-[10px] font-black uppercase opacity-40 leading-none mb-1">手牌</span>
              <span className="text-xl font-black leading-none">{gameState.aiHand.length}</span>
            </div>
          </div>
          <div className="flex -space-x-12 sm:-space-x-16 overflow-visible justify-center max-w-full">
            {gameState.aiHand.map((card, index) => (
              <CardComponent 
                key={card.id} 
                card={card} 
                isFaceDown 
                className="transform hover:-translate-y-2 transition-transform"
                style={{ zIndex: index }}
              />
            ))}
          </div>
        </div>

        {/* Board Center */}
        <div className="flex-1 flex items-center justify-center gap-8 sm:gap-16 my-8">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {gameState.deck.length > 0 ? (
                <button 
                  onClick={drawCard}
                  disabled={gameState.currentTurn !== 'player' || gameState.status !== 'playing'}
                  className={cn(
                    "relative transition-all",
                    gameState.currentTurn === 'player' && gameState.status === 'playing' 
                      ? "cursor-pointer hover:scale-105 active:scale-95" 
                      : "opacity-80 cursor-not-allowed"
                  )}
                >
                  {/* Stack effect */}
                  <div className="absolute top-1 left-1 w-20 h-28 sm:w-24 sm:h-36 bg-blue-900 rounded-lg border-2 border-white/20 translate-x-1 translate-y-1" />
                  <div className="absolute top-0 left-0 w-20 h-28 sm:w-24 sm:h-36 bg-blue-900 rounded-lg border-2 border-white/20 translate-x-0.5 translate-y-0.5" />
                  <CardComponent card={gameState.deck[0]} isFaceDown className="relative z-10" />
                  
                  {gameState.currentTurn === 'player' && gameState.status === 'playing' && (
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute -top-4 -right-4 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-20"
                    >
                      摸牌
                    </motion.div>
                  )}
                </button>
              ) : (
                <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-white/20 text-xs font-bold uppercase">Empty</span>
                </div>
              )}
            </div>
            <div className="bg-white text-black px-3 py-2 rounded-xl flex flex-col items-center justify-center shadow-xl border-2 border-gray-100 min-w-[60px]">
              <span className="text-[10px] font-black uppercase opacity-40 leading-none mb-1">牌堆</span>
              <span className="text-xl font-black leading-none">{gameState.deck.length}</span>
            </div>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <AnimatePresence mode="popLayout">
                {topDiscard && (
                  <CardComponent 
                    key={topDiscard.id}
                    card={topDiscard} 
                    className="shadow-2xl"
                  />
                )}
              </AnimatePresence>
              
              {gameState.activeSuit && (
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-6 -right-6 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-yellow-400 z-20"
                >
                  <span className={cn(
                    "text-2xl",
                    (gameState.activeSuit === 'hearts' || gameState.activeSuit === 'diamonds') ? "text-red-600" : "text-black"
                  )}>
                    {gameState.activeSuit === 'hearts' ? '♥' : gameState.activeSuit === 'diamonds' ? '♦' : gameState.activeSuit === 'clubs' ? '♣' : '♠'}
                  </span>
                </motion.div>
              )}
            </div>
            <span className="text-xs font-mono opacity-40 uppercase tracking-widest">弃牌堆</span>
          </div>
        </div>

        {/* Player Hand */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              gameState.currentTurn === 'player' ? "bg-yellow-400 text-black scale-110 shadow-lg" : "bg-white/10 text-white/60"
            )}>
              你的回合 {gameState.currentTurn === 'player' && "• 请出牌"}
            </div>
          </div>
          
          <div className="flex -space-x-8 sm:-space-x-12 overflow-x-auto pb-8 pt-4 px-12 max-w-full no-scrollbar">
            {gameState.playerHand.map((card, index) => (
              <CardComponent 
                key={card.id} 
                card={card} 
                isPlayable={gameState.currentTurn === 'player' && gameState.status === 'playing' && canPlayCard(card, topDiscard, gameState.activeSuit)}
                onClick={() => playCard(card)}
                className="transform transition-all"
                style={{ zIndex: index }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Overlays */}
      <SuitSelector 
        isOpen={gameState.status === 'choosing_suit'} 
        onSelect={handleSuitSelect} 
      />
      
      <GameOver 
        winner={gameState.winner} 
        onRestart={initGame} 
      />

      <AnimatePresence>
        {gameState.status === 'menu' && (
          <StartMenu 
            onStart={initGame} 
            onShowRules={() => setShowRules(true)} 
            wins={wins}
          />
        )}
      </AnimatePresence>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRules(false)}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
            >
              <h2 className="text-3xl font-black italic uppercase mb-6 text-yellow-400">游戏规则</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">01.</span>
                  <p>打出的牌必须与弃牌堆顶部的牌<span className="text-white font-semibold">花色</span>或<span className="text-white font-semibold">点数</span>一致。</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">02.</span>
                  <p><span className="text-white font-semibold">万能 8 点：</span> 你可以在任何时候打出数字 8！它是万能牌，可以让你指定新的花色。</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">03.</span>
                  <p>如果你无牌可出，必须从<span className="text-white font-semibold">牌堆</span>摸一张牌。</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">04.</span>
                  <p>最先清空手牌的玩家<span className="text-yellow-400 font-bold italic">获胜！</span></p>
                </li>
              </ul>
              <button 
                onClick={() => setShowRules(false)}
                className="mt-8 w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                我知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
