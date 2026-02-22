import { Card, Rank, Suit } from './types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank}-${suit}-${Math.random().toString(36).substr(2, 9)}`,
        suit,
        rank,
        isFaceUp: false,
      });
    }
  }
  return shuffle(deck);
}

export function shuffle(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function canPlayCard(card: Card, topCard: Card, activeSuit: Suit | null): boolean {
  // 8 is always playable
  if (card.rank === '8') return true;

  const targetSuit = activeSuit || topCard.suit;
  
  // Match suit or rank
  return card.suit === targetSuit || card.rank === topCard.rank;
}

export function getBestSuitForAI(hand: Card[]): Suit {
  const counts: Record<Suit, number> = {
    hearts: 0,
    diamonds: 0,
    clubs: 0,
    spades: 0,
  };
  
  hand.forEach(card => {
    if (card.rank !== '8') {
      counts[card.suit]++;
    }
  });
  
  return Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as Suit;
}
