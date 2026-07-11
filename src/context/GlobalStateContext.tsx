import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Card } from '../data/mockData';
import { fetchWalletPortfolio } from '../services/renaissApi';

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
  pendingChatPrompt: string | null;
  setPendingChatPrompt: (prompt: string | null) => void;
  isFetchingPortfolio: boolean;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<Card[]>([]);
  const [activeScan, setActiveScan] = useState<Card | null>(null);
  const [recentScans, setRecentScans] = useState<Card[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);
  const [isFetchingPortfolio, setIsFetchingPortfolio] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          const address = accounts[0];
          // Format address e.g. 0x123...ABCD
          setWalletAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);

          // Attempt to switch to BNB Chain
          try {
            await (window as any).ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x38' }], // 0x38 is 56 (BNB Chain)
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await (window as any).ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x38',
                      chainName: 'BNB Smart Chain Mainnet',
                      rpcUrls: ['https://bsc-dataseed.binance.org/'],
                      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                      blockExplorerUrls: ['https://bscscan.com/'],
                    },
                  ],
                });
              } catch (addError) {
                console.error('Failed to add BNB chain', addError);
              }
            } else {
              console.error('Failed to switch to BNB chain', switchError);
            }
          }
          
          setIsFetchingPortfolio(true);
          try {
            const fetchedCards = await fetchWalletPortfolio(address);
            if (fetchedCards.length > 0) {
              setPortfolio(fetchedCards);
            }
          } catch (e) {
             console.error("Failed fetching on-chain portfolio", e);
          } finally {
             setIsFetchingPortfolio(false);
          }
        }
      } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('Failed to connect wallet.');
      }
    } else {
      // Fallback for demo if no wallet extension exists, use a known holder address
      setIsWalletConnected(true);
      const fallbackAddress = '0xa044c320755224bbb988a9795a64313b3a677d33';
      setWalletAddress(`${fallbackAddress.slice(0, 6)}...${fallbackAddress.slice(-4)}`);
      alert('No Web3 wallet detected. Falling back to a demo address to fetch an on-chain portfolio.');
      
      setIsFetchingPortfolio(true);
      try {
        const fetchedCards = await fetchWalletPortfolio(fallbackAddress);
        if (fetchedCards.length > 0) {
          setPortfolio(fetchedCards);
        }
      } catch (e) {
         console.error("Failed fetching on-chain portfolio", e);
      } finally {
         setIsFetchingPortfolio(false);
      }
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
        pendingChatPrompt,
        setPendingChatPrompt,
        isFetchingPortfolio,
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
