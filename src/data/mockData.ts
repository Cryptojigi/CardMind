export interface Card {
  id: string;
  name: string;
  set: string;
  year: number;
  grade: number;
  grader: string;
  certNumber: string;
  currentValue: number;
  purchasePrice: number;
  change30d: number;
  changePercent30d: number;
  rarity: string;
  liquidityScore: number;
  renaisssSignal: 'bullish' | 'neutral' | 'bearish';
  recommendation: 'buy' | 'hold' | 'sell';
  confidence: number;
  image: string;
  priceHistory: { date: string; value: number }[];
  population: number;
  popHigher: number;
  onChainUrl?: string;
  isMockFallback?: boolean;
}

export const mockCards: Card[] = [
  {
    id: '1',
    name: 'Charizard',
    set: 'Base Set',
    year: 1999,
    grade: 10,
    grader: 'PSA',
    certNumber: '12345678',
    currentValue: 24500,
    purchasePrice: 18000,
    change30d: 1200,
    changePercent30d: 5.2,
    rarity: 'Holo Rare',
    liquidityScore: 98,
    renaisssSignal: 'bullish',
    recommendation: 'hold',
    confidence: 87,
    image: 'https://images.unsplash.com/photo-1605979257913-1704eb7b6246?w=400&h=560&fit=crop&auto=format',
    priceHistory: [
      { date: 'Jan', value: 19200 }, { date: 'Feb', value: 20100 }, { date: 'Mar', value: 19800 },
      { date: 'Apr', value: 21500 }, { date: 'May', value: 22800 }, { date: 'Jun', value: 23300 },
      { date: 'Jul', value: 24500 },
    ],
    population: 121,
    popHigher: 0,
  },
  {
    id: '2',
    name: 'Lugia',
    set: 'Neo Genesis',
    year: 2000,
    grade: 9,
    grader: 'PSA',
    certNumber: '23456789',
    currentValue: 8900,
    purchasePrice: 6200,
    change30d: 420,
    changePercent30d: 4.9,
    rarity: 'Holo Rare',
    liquidityScore: 91,
    renaisssSignal: 'bullish',
    recommendation: 'buy',
    confidence: 82,
    image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=400&h=560&fit=crop&auto=format',
    priceHistory: [
      { date: 'Jan', value: 7200 }, { date: 'Feb', value: 7600 }, { date: 'Mar', value: 7400 },
      { date: 'Apr', value: 8100 }, { date: 'May', value: 8400 }, { date: 'Jun', value: 8480 },
      { date: 'Jul', value: 8900 },
    ],
    population: 247,
    popHigher: 12,
  },
  {
    id: '3',
    name: 'Umbreon',
    set: 'Neo Discovery',
    year: 2001,
    grade: 10,
    grader: 'PSA',
    certNumber: '34567890',
    currentValue: 6200,
    purchasePrice: 5100,
    change30d: -180,
    changePercent30d: -2.8,
    rarity: 'Holo Rare',
    liquidityScore: 84,
    renaisssSignal: 'neutral',
    recommendation: 'hold',
    confidence: 71,
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=560&fit=crop&auto=format',
    priceHistory: [
      { date: 'Jan', value: 5800 }, { date: 'Feb', value: 6100 }, { date: 'Mar', value: 6380 },
      { date: 'Apr', value: 6200 }, { date: 'May', value: 6450 }, { date: 'Jun', value: 6380 },
      { date: 'Jul', value: 6200 },
    ],
    population: 89,
    popHigher: 0,
  },
  {
    id: '4',
    name: 'Rayquaza',
    set: 'EX Deoxys',
    year: 2005,
    grade: 10,
    grader: 'PSA',
    certNumber: '45678901',
    currentValue: 3800,
    purchasePrice: 2400,
    change30d: 310,
    changePercent30d: 8.9,
    rarity: 'Gold Star',
    liquidityScore: 89,
    renaisssSignal: 'bullish',
    recommendation: 'buy',
    confidence: 91,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=560&fit=crop&auto=format',
    priceHistory: [
      { date: 'Jan', value: 2800 }, { date: 'Feb', value: 2950 }, { date: 'Mar', value: 3100 },
      { date: 'Apr', value: 3300 }, { date: 'May', value: 3490 }, { date: 'Jun', value: 3490 },
      { date: 'Jul', value: 3800 },
    ],
    population: 58,
    popHigher: 0,
  },
  {
    id: '5',
    name: 'Blastoise',
    set: 'Base Set',
    year: 1999,
    grade: 8,
    grader: 'PSA',
    certNumber: '56789012',
    currentValue: 1840,
    purchasePrice: 1650,
    change30d: 90,
    changePercent30d: 5.1,
    rarity: 'Holo Rare',
    liquidityScore: 76,
    renaisssSignal: 'neutral',
    recommendation: 'hold',
    confidence: 68,
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=560&fit=crop&auto=format',
    priceHistory: [
      { date: 'Jan', value: 1620 }, { date: 'Feb', value: 1680 }, { date: 'Mar', value: 1700 },
      { date: 'Apr', value: 1750 }, { date: 'May', value: 1790 }, { date: 'Jun', value: 1750 },
      { date: 'Jul', value: 1840 },
    ],
    population: 512,
    popHigher: 189,
  },
];

export const portfolioStats = {
  totalValue: 45240,
  totalCards: 5,
  totalCost: 33350,
  totalGain: 11890,
  totalGainPercent: 35.6,
  renaisssSignalStrength: 82,
};

export const trendingCards = [
  { name: 'Charizard VMAX', set: 'Shining Fates', change: '+18.4%', value: '$1,240', signal: 'bullish' },
  { name: 'Pikachu Illustrator', set: 'Promo', change: '+12.1%', value: '$5,400,000', signal: 'bullish' },
  { name: 'Mewtwo', set: 'Base Set', change: '+9.8%', value: '$3,200', signal: 'bullish' },
  { name: 'Mew', set: 'Southern Islands', change: '+7.3%', value: '$890', signal: 'bullish' },
  { name: 'Espeon', set: 'Neo Discovery', change: '-3.2%', value: '$2,100', signal: 'bearish' },
  { name: 'Gengar', set: 'Fossil', change: '+5.6%', value: '$740', signal: 'bullish' },
  { name: 'Dragonite', set: 'Fossil', change: '-1.8%', value: '$420', signal: 'neutral' },
  { name: 'Scizor', set: 'Neo Discovery', change: '+11.2%', value: '$1,680', signal: 'bullish' },
];

export const chatHistory = [
  {
    role: 'assistant' as const,
    content: "Hello! I'm CardMind AI, your intelligent TCG assistant powered by multiple specialized agents. I can help you value cards, analyze your portfolio, and surface Renaiss ecosystem signals. What would you like to explore today?",
    timestamp: '2:14 PM',
    agents: ['Market Agent', 'Portfolio Agent'],
  },
];

export const smartPrompts = [
  "What's the outlook for my Charizard PSA 10?",
  "Which cards in my portfolio should I consider selling?",
  "What are the hottest PSA 10 opportunities right now?",
  "Explain Renaiss liquidity signals for my cards",
  "Compare Charizard Base Set vs Neo Genesis Lugia",
  "What's driving the current market trends?",
];
