import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGlobalState } from '../context/GlobalStateContext';
import Logo from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';

type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';
interface Props { onNavigate: (s: Screen) => void; }


const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(10,15,28,0.95)', border: '1px solid rgba(0,245,255,0.3)', color: '#F8F6F0' }}>
      <div className="font-bold text-[#00F5FF]">{label}</div>
      <div>${payload[0].value.toLocaleString()}</div>
    </div>
  );
};

export default function CardResults({ onNavigate }: Props) {
  const { activeScan: card, portfolio, addCardToPortfolio, setPendingChatPrompt, setActiveScan } = useGlobalState();
  const { t } = useLanguage();
  
  if (!card) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#F8F6F0] mb-4">{t('results.noCard.title')}</h2>
        <p className="text-sm text-gray-400 mb-8">{t('results.noCard.desc')}</p>
        <button onClick={() => onNavigate('scanner')} className="px-6 py-3 rounded-full font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #00F5FF, #FF00E5)', color: '#0A0F1C' }}>
          {t('results.noCard.btn')}
        </button>
      </div>
    );
  }

  const isAdded = portfolio.some((c) => c.id === card.id);
  const gainLoss = card.currentValue - card.purchasePrice;
  const gainLossPct = ((gainLoss / card.purchasePrice) * 100).toFixed(1);

  const recColors: Record<string, string> = { buy: '#00E676', hold: '#FFB800', sell: '#FF4444' };
  const recColor = recColors[card.recommendation];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => { setActiveScan(null); onNavigate('scanner'); }} className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'rgba(248,246,240,0.5)' }}>
          {t('results.header.scanNew')}
        </button>
        <span style={{ color: 'rgba(248,246,240,0.2)' }}>/</span>
        <span className="text-sm font-medium text-[#F8F6F0]">{t('results.header.title')}</span>
      </div>

      {card.isMockFallback && (
        <div className="mb-6 px-4 py-3 rounded-lg flex items-center gap-3" style={{ background: 'rgba(255, 184, 0, 0.1)', border: '1px solid rgba(255, 184, 0, 0.3)' }}>
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-medium" style={{ color: '#FFB800' }}>
            {t('results.demoData')}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Card display */}
        <div className="lg:col-span-2">
          {/* PSA Slab */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{
              background: 'linear-gradient(145deg, rgba(20,30,50,0.98), rgba(10,15,28,0.99))',
              border: '2px solid rgba(0,245,255,0.4)',
              boxShadow: '0 0 50px rgba(0,245,255,0.2), 0 30px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* PSA Header */}
            {card.grade !== 'Ungraded' && (
              <div className="h-10 px-3 flex items-center justify-between border-b border-white/10" style={{ background: 'linear-gradient(to right, #ccc, #e5e5e5)' }}>
                <div className="text-[9px] font-black tracking-widest text-[#111]">{card.grader?.toUpperCase() || 'PSA'}</div>
                <div className="text-[8px] font-black text-[#111]">
                  {card.grade === '10' ? t('results.psa.gemMt') : `${t('results.psa.mint')} ${card.grade}`}
                </div>
              </div>
            )}
            
            <div className={`flex flex-col items-center ${card.grade !== 'Ungraded' ? 'p-3 pt-4' : 'p-0 h-full'}`}>
              <div className="rounded-xl holo-card flex items-center justify-center mb-3 overflow-hidden relative w-full max-w-[220px]" style={{ aspectRatio: '2.5/3.5', background: 'linear-gradient(145deg, #1A2235, #0A0F1C)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
                {card.image ? (
                  <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-2" style={{ color: '#00F5FF' }}>
                      <span className="text-xl">📷</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white">{t('dashboard.recentScans.noImage')}</span>
                  </div>
                )}
              </div>

              {/* Card info */}
              <div className="text-center">
                <div className="text-base font-bold text-[#F8F6F0]">{card.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(248,246,240,0.5)' }}>{card.set} · {card.year} · {card.rarity}</div>
                <div className="text-[10px] mt-1 font-mono" style={{ color: 'rgba(0,245,255,0.6)' }}>{t('results.psa.cert')} {card.certNumber}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                addCardToPortfolio(card);
              }}
              disabled={isAdded}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-80 disabled:hover:scale-100"
              style={{
                background: isAdded ? 'rgba(0,230,118,0.15)' : 'linear-gradient(135deg, #00F5FF, #FF00E5)',
                color: isAdded ? '#00E676' : '#0A0F1C',
                border: isAdded ? '1px solid rgba(0,230,118,0.4)' : 'none',
              }}
            >
              {isAdded ? t('results.actions.added') : t('results.actions.add')}
            </button>
            <button
              onClick={() => {
                setPendingChatPrompt(`Tell me about my ${card.name} ${card.grader} ${card.grade}`);
                onNavigate('chat');
              }}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
              style={{ background: 'rgba(255,0,229,0.1)', border: '1px solid rgba(255,0,229,0.3)', color: '#FF00E5' }}
            >
              {t('results.actions.askAi')}
            </button>
            <button
              className="w-full py-3 rounded-xl font-semibold text-sm"
              style={{ background: 'rgba(248,246,240,0.04)', border: '1px solid rgba(248,246,240,0.12)', color: 'rgba(248,246,240,0.6)' }}
            >
              {t('results.actions.share')}
            </button>
            {card.onChainUrl && (
              <a
                href={card.onChainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-semibold text-sm block text-center transition-all hover:scale-105"
                style={{ background: 'rgba(243, 186, 47, 0.1)', border: '1px solid rgba(243, 186, 47, 0.3)', color: '#F3BA2F' }}
              >
                {t('results.actions.viewBsc')}
              </a>
            )}
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="lg:col-span-3 space-y-4">
          {/* Current Value */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,245,255,0.2)' }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{t('results.metrics.currentValue')}</div>
                <div className="text-5xl font-black text-[#F8F6F0]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  ${card.currentValue.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{t('results.metrics.confidence')}</div>
                <div className="text-2xl font-black text-[#00F5FF]">{card.confidence}%</div>
              </div>
            </div>
            <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div className="text-xs" style={{ color: 'rgba(248,246,240,0.45)' }}>{t('results.metrics.change30d')}</div>
                <div className="text-sm font-bold" style={{ color: card.changePercent30d >= 0 ? '#00E676' : '#FF4444' }}>
                  {card.changePercent30d >= 0 ? '+' : ''}{card.changePercent30d}% (${Math.abs(card.change30d).toLocaleString()})
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: 'rgba(248,246,240,0.45)' }}>{t('results.metrics.pnl')}</div>
                <div className="text-sm font-bold" style={{ color: gainLoss >= 0 ? '#00E676' : '#FF4444' }}>
                  {gainLoss >= 0 ? '+' : ''}${gainLoss.toLocaleString()} ({gainLossPct}%)
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: 'rgba(248,246,240,0.45)' }}>{t('results.metrics.popReport')}</div>
                <div className="text-sm font-bold text-[#F8F6F0]">{card.population} {card.grade !== 'Ungraded' ? `(PSA ${card.grade})` : ''}</div>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-sm font-bold text-[#F8F6F0] mb-4">{t('results.metrics.priceHistory')}</div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={card.priceHistory}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(248,246,240,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#00F5FF" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{t('results.metrics.rarity')}</div>
              <div className="text-sm font-bold text-[#F8F6F0]">{card.rarity}</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{t('results.metrics.liquidityScore')}</div>
              <div className="text-sm font-bold text-[#00F5FF]">{card.liquidityScore}/100</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{t('results.metrics.popHigher')}</div>
              <div className="text-sm font-bold text-[#F8F6F0]">{card.popHigher === 0 ? t('results.metrics.noneApex') : card.popHigher}</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{t('results.metrics.grade')}</div>
              <div className="text-sm font-bold text-[#F8F6F0]">{card.grader} {card.grade}</div>
            </div>
          </div>

          {/* Renaiss Ecosystem Section */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: '#00F5FF', fontSize: 18 }}>◉</span>
              <span className="text-sm font-bold text-[#F8F6F0]">{t('results.renaiss.title')}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(0,245,255,0.2)', color: '#00F5FF' }}>{t('results.renaiss.beta')}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{t('results.renaiss.signal')}</div>
                <div className="text-sm font-bold capitalize" style={{ color: card.renaisssSignal === 'bullish' ? '#00E676' : '#FF4444' }}>
                  {card.renaisssSignal === 'bullish' ? '↑ ' : '↓ '}{t(`dashboard.stats.${card.renaisssSignal}`)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{t('results.renaiss.liquidity')}</div>
                <div className="text-sm font-bold text-[#00F5FF]">{t('results.renaiss.veryHigh')}</div>
              </div>
              <div className="text-center">
                <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{t('results.renaiss.onChain')}</div>
                <div className="text-sm font-bold text-[#FF00E5]">{t('results.renaiss.active')}</div>
              </div>
            </div>
            <div className="text-[10px] p-2 rounded-lg" style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.2)', color: 'rgba(255,184,0,0.75)' }}>
              {t('results.renaiss.disclaimer')}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="rounded-2xl p-5" style={{ background: `${recColor}0D`, border: `1px solid ${recColor}40` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 20 }}>✦</span>
                <span className="text-sm font-bold text-[#F8F6F0]">{t('results.aiRec.title')}</span>
              </div>
              <span className="px-4 py-1.5 rounded-full text-sm font-black uppercase" style={{ background: recColor, color: '#0A0F1C' }}>
                {t(`dashboard.stats.${card.recommendation.toLowerCase()}`)}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(248,246,240,0.7)' }}>
              {card.recommendation === 'hold'
                ? `${t('results.aiRec.hold1')}${card.grade !== 'Ungraded' ? `PSA ${card.grade} ` : ''}${t('results.aiRec.hold2')}${card.population}${t('results.aiRec.hold3')}${card.popHigher === 0 ? '0' : card.popHigher}${t('results.aiRec.hold4')}${card.name}${t('results.aiRec.hold5')}${card.changePercent30d >= 0 ? '+' : ''}${card.changePercent30d}${t('results.aiRec.hold6')}`
                : card.recommendation === 'buy' ? t('results.aiRec.buy') : t('results.aiRec.sell')
              }
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${card.confidence}%`, background: `linear-gradient(90deg, ${recColor}, ${recColor}88)` }} />
              </div>
              <span className="text-xs font-bold" style={{ color: recColor }}>{card.confidence}% {t('results.aiRec.confidenceText')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
