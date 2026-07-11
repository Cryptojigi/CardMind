import Logo from './Logo';
import { useGlobalState } from '../context/GlobalStateContext';

type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';

interface NavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  variant?: 'landing' | 'app';
}

const appNavItems: { label: string; screen: Screen; icon: string }[] = [
  { label: 'Dashboard', screen: 'dashboard', icon: '⬡' },
  { label: 'Scan', screen: 'scanner', icon: '⊙' },
  { label: 'Portfolio', screen: 'portfolio', icon: '◈' },
  { label: 'Market', screen: 'market', icon: '◉' },
  { label: 'AI Chat', screen: 'chat', icon: '✦' },
];

export default function Nav({ currentScreen, onNavigate, variant = 'app' }: NavProps) {
  const { isWalletConnected, walletAddress, connectWallet, disconnectWallet, isUsingMockData, isFetchingPortfolio } = variant === 'app' ? useGlobalState() : { isWalletConnected: false, walletAddress: '', connectWallet: () => {}, disconnectWallet: () => {}, isUsingMockData: false, isFetchingPortfolio: false };

  if (variant === 'landing') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10,15,28,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-full px-6 md:px-12 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('landing')} className="hover:opacity-80 transition-opacity">
            <Logo size="md" />
          </button>
          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-medium text-[#F8F6F0] opacity-60 hover:opacity-100 transition-opacity">Features</button>
            <button 
              onClick={() => {
                if (variant === 'landing') {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-sm font-medium text-[#F8F6F0] opacity-60 hover:opacity-100 transition-opacity"
            >
              How it Works
            </button>
            <button className="text-sm font-medium text-[#F8F6F0] opacity-60 hover:opacity-100 transition-opacity">Docs</button>
            <button className="text-sm font-medium text-[#F8F6F0] opacity-60 hover:opacity-100 transition-opacity">About</button>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00F5FF, #FF00E5)',
              color: '#0A0F1C',
              boxShadow: '0 0 30px rgba(0,245,255,0.4)',
            }}
          >
            Launch App →
          </button>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10,15,28,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-full px-6 md:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('landing')} className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </button>
            {isUsingMockData && (
              <div 
                className="flex items-center gap-2 px-2.5 py-1 rounded-full animate-pulse cursor-help"
                style={{ background: 'rgba(255, 184, 0, 0.15)', border: '1px solid rgba(255, 184, 0, 0.3)' }}
                title="Demo Mode Active - Using simulated data due to API rate limits"
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FFB800' }}></div>
                <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: '#FFB800' }}>Demo Mode</span>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center gap-1">
            {appNavItems.map((item) => (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: currentScreen === item.screen ? '#00F5FF' : 'rgba(248,246,240,0.6)',
                  background: currentScreen === item.screen ? 'rgba(0,245,255,0.1)' : 'transparent',
                  border: currentScreen === item.screen ? '1px solid rgba(0,245,255,0.2)' : '1px solid transparent',
                }}
              >
                <span className="mr-1.5 text-xs">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          {currentScreen === 'portfolio' ? (
            isWalletConnected ? (
              <button
                onClick={disconnectWallet}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{
                  background: 'rgba(0,230,118,0.1)',
                  color: '#00E676',
                  border: '1px solid rgba(0,230,118,0.3)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                {walletAddress}
              </button>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isFetchingPortfolio}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#F8F6F0',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {isFetchingPortfolio ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fetching...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            )
          ) : (
            <button
              onClick={() => onNavigate('scanner')}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00F5FF, #FF00E5)',
                color: '#0A0F1C',
                boxShadow: '0 0 20px rgba(0,245,255,0.3)',
              }}
            >
              + Scan Card
            </button>
          )}
        </div>
      </nav>

      {/* Bottom mobile nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ background: 'rgba(10,15,28,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-around px-2 py-3">
          {appNavItems.map((item) => (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <span style={{ color: currentScreen === item.screen ? '#00F5FF' : 'rgba(248,246,240,0.4)', fontSize: 18 }}>{item.icon}</span>
              <span className="text-[10px] font-medium" style={{ color: currentScreen === item.screen ? '#00F5FF' : 'rgba(248,246,240,0.4)' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
