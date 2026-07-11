import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Card } from '../data/mockData';

interface GlobalState {
  portfolio: Card[];
  activeScan: Card | null;
  recentScans: Card[];
  isWalletConnected: boolean;
  walletAddress: string | null;
  addCardToPortfolio: (card: Card) => void;
  setActiveScan: (card: Card | null) => void;
  addRecentScan: (card: Card) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isUsingMockData: boolean;
  setIsUsingMockData: (val: boolean) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<Card[]>([]);
  const [activeScan, setActiveScan] = useState<Card | null>(null);
  const [recentScans, setRecentScans] = useState<Card[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          const address = accounts[0];
          // Format address e.g. 0x123...ABCD
          setWalletAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
        }
      } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('Failed to connect wallet.');
      }
    } else {
      // Fallback for demo if no wallet extension exists, use the provided API key as address
      setIsWalletConnected(true);
      setWalletAddress('0xcd4e...fce8');
      alert('No Web3 wallet detected. Falling back to the provided address.');
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress(null);
  };

  const addCardToPortfolio = (card: Card) => {
    setPortfolio((prev) => {
      // Prevent duplicates by ID
      if (prev.find((c) => c.id === card.id)) return prev;
      return [...prev, card];
    });
  };

  const addRecentScan = (card: Card) => {
    setRecentScans((prev) => {
      // Remove duplicate if it exists, then add to front
      const filtered = prev.filter((c) => c.id !== card.id);
      return [card, ...filtered].slice(0, 10); // Keep last 10
    });
  };

  return (
    <GlobalStateContext.Provider
      value={{
        portfolio,
        activeScan,
        recentScans,
        isWalletConnected,
        walletAddress,
        addCardToPortfolio,
        setActiveScan,
        addRecentScan,
        connectWallet,
        disconnectWallet,
        isUsingMockData,
        setIsUsingMockData,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}
