import { useState } from 'react';
import Nav from './components/Nav';
import LandingPage from './screens/LandingPage';
import Dashboard from './screens/Dashboard';
import CardScanner from './screens/CardScanner';
import CardResults from './screens/CardResults';
import Portfolio from './screens/Portfolio';
import AIChat from './screens/AIChat';
import MarketInsights from './screens/MarketInsights';

export type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    return (localStorage.getItem('cardmind_screen') as Screen) || 'landing';
  });

  const navigate = (s: Screen) => {
    setScreen(s);
    localStorage.setItem('cardmind_screen', s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (screen === 'landing') {
    return (
      <>
        <Nav currentScreen="landing" onNavigate={navigate} variant="landing" />
        <LandingPage onNavigate={navigate} />
      </>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A0F1C' }}>
      <Nav currentScreen={screen} onNavigate={navigate} variant="app" />
      <div className="pt-[68px] pb-16 md:pb-0">
        {screen === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {screen === 'scanner' && <CardScanner onNavigate={navigate} />}
        {screen === 'results' && <CardResults onNavigate={navigate} />}
        {screen === 'portfolio' && <Portfolio onNavigate={navigate} />}
        {screen === 'chat' && <AIChat onNavigate={navigate} />}
        {screen === 'market' && <MarketInsights onNavigate={navigate} />}
      </div>
    </div>
  );
}
