import { useGlobalState } from '../context/GlobalStateContext';
import { portfolioStats } from '../data/mockData';
import Logo from '../components/Logo';

type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';
interface Props { onNavigate: (s: Screen) => void; }

const StatCard = ({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: string }) => (
  <div className="rounded-2xl p-6 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
    <div className="flex items-center justify-between">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: `${color}18`, color }}>{sub}</span>
    </div>
    <div className="text-3xl font-black" style={{ color, fontFamily: 'Poppins, sans-serif' }}>{value}</div>
    <div className="text-sm font-medium" style={{ color: 'rgba(248,246,240,0.5)' }}>{label}</div>
  </div>
);

const signalColor = (s: string) => s === 'bullish' ? '#00F5FF' : s === 'bearish' ? '#FF4444' : '#FFB800';
const recColor = (r: string) => r === 'buy' ? '#00E676' : r === 'sell' ? '#FF4444' : '#FFB800';

export default function Dashboard({ onNavigate }: Props) {
  const { recentScans } = useGlobalState();
  const totalGain = portfolioStats.totalGain;
  const gainPositive = totalGain >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Hero Banner */}
      <div
        className="rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,245,255,0.1) 0%, rgba(255,0,229,0.08) 50%, rgba(10,15,28,0.5) 100%)',
          border: '1px solid rgba(0,245,255,0.2)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#F8F6F0] mb-3 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Scan. Value. <span className="gradient-text">Decide Smarter.</span>
          </h1>
          <p className="text-base md:text-lg mb-8 max-w-xl" style={{ color: 'rgba(248,246,240,0.6)', fontFamily: 'Poppins, sans-serif' }}>
            Your multi-agent AI assistant for PSA-graded Pokémon card valuations, portfolio intelligence, and Renaiss ecosystem signals.
          </p>
          <div className="flex gap-3 sm:gap-4 w-full">
            <button
              onClick={() => onNavigate('scanner')}
              className="flex-1 px-2 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #00F5FF, #FF00E5)', color: '#0A0F1C', boxShadow: '0 0 30px rgba(0,245,255,0.4)', fontFamily: 'Poppins, sans-serif' }}
            >
              ⊙ Scan a Card
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className="flex-1 px-2 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 whitespace-nowrap"
              style={{ background: 'rgba(248,246,240,0.06)', border: '1px solid rgba(248,246,240,0.2)', color: '#F8F6F0', fontFamily: 'Poppins, sans-serif' }}
            >
              ◈ My Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Portfolio Value"
          value={`$${portfolioStats.totalValue.toLocaleString()}`}
          sub={`+${portfolioStats.totalGainPercent}%`}
          color="#00F5FF"
          icon="◈"
        />
        <StatCard
          label="Cards Tracked"
          value={portfolioStats.totalCards.toString()}
          sub="PSA Graded"
          color="#FF00E5"
          icon="⬡"
        />
        <StatCard
          label="Renaiss Signal Strength"
          value={`${portfolioStats.renaisssSignalStrength}%`}
          sub="Bullish"
          color="#00E676"
          icon="◉"
        />
      </div>

      {/* Recent Scans */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#F8F6F0]" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Scans</h2>
          <button onClick={() => onNavigate('portfolio')} className="text-sm font-medium" style={{ color: '#00F5FF' }}>View All →</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {recentScans.length === 0 ? (
            <div className="text-sm" style={{ color: 'rgba(248,246,240,0.5)' }}>No recent scans yet. Scan a card to see it here.</div>
          ) : (
            recentScans.map((card) => (
              <div
                key={card.id}
                onClick={() => onNavigate('results')}
                className="flex-shrink-0 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  width: 180,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Card visual */}
                <div className="rounded-xl mb-3 flex items-center justify-center text-4xl relative overflow-hidden"
                  style={{ height: 120, background: 'linear-gradient(145deg, rgba(0,245,255,0.1), rgba(255,0,229,0.1))', border: '1px solid rgba(0,245,255,0.2)' }}>
                  {card.image ? (
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                      <span className="text-sm font-bold text-gray-500">No Image</span>
                    </div>
                  )}
                {/* PSA badge */}
                {card.grade && card.grade !== 'Ungraded' && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black" style={{ background: 'rgba(0,245,255,0.9)', color: '#0A0F1C' }}>
                    PSA {card.grade}
                  </div>
                )}
              </div>
              <div className="text-sm font-bold text-[#F8F6F0] truncate">{card.name}</div>
              <div className="text-xs mb-2" style={{ color: 'rgba(248,246,240,0.5)' }}>{card.set}</div>
              <div className="text-lg font-black" style={{ color: '#00F5FF' }}>${card.currentValue.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-semibold" style={{ color: card.changePercent30d >= 0 ? '#00E676' : '#FF4444' }}>
                  {card.changePercent30d >= 0 ? '▲' : '▼'} {Math.abs(card.changePercent30d)}%
                </span>
                <span className="text-[10px]" style={{ color: 'rgba(248,246,240,0.4)' }}>30d</span>
              </div>
              <div className="mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-center"
                style={{ background: `${recColor(card.recommendation)}18`, color: recColor(card.recommendation), border: `1px solid ${recColor(card.recommendation)}40` }}>
                {card.recommendation.toUpperCase()}
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Renaiss API + AI Chat CTA */}
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,245,255,0.15)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,245,255,0.15)' }}>
              <span style={{ color: '#00F5FF' }}>◉</span>
            </div>
            <div>
              <div className="text-sm font-bold text-[#F8F6F0]">Renaiss Index API</div>
              <div className="text-xs font-semibold" style={{ color: '#00F5FF' }}>Beta</div>
            </div>
          </div>
          <p className="text-sm mb-4" style={{ color: 'rgba(248,246,240,0.6)' }}>
            Real-time on-chain marketplace signals, liquidity scores, and ecosystem activity from the Renaiss platform — integrated directly into every card valuation.
          </p>
          <div className="text-[10px] font-medium p-3 rounded-lg" style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.2)', color: 'rgba(255,184,0,0.8)' }}>
            ⚠ Renaiss API data is in beta. Values are for informational purposes only and do not constitute financial advice.
          </div>
        </div>

        <div
          onClick={() => onNavigate('chat')}
          className="rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
          style={{ background: 'linear-gradient(135deg, rgba(255,0,229,0.08), rgba(0,245,255,0.08))', border: '1px solid rgba(255,0,229,0.2)' }}
        >
          <div className="text-3xl mb-3">✦</div>
          <h3 className="text-lg font-bold text-[#F8F6F0] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>AI Advisor Chat</h3>
          <p className="text-sm mb-4" style={{ color: 'rgba(248,246,240,0.6)' }}>
            Ask anything about your collection. Our multi-agent AI pulls live market data, portfolio context, and Renaiss signals to give you personalized advice.
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#FF00E5' }}>
            Start Chatting →
          </div>
        </div>
      </div>
    </div>
  );
}
