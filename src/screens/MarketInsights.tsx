import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { trendingCards } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';
interface Props { onNavigate: (s: Screen) => void; }

const marketData = [
  { set: 'Base Set', vol: 4.2 }, { set: 'Neo Gen', vol: 2.8 }, { set: 'EX Era', vol: 1.9 },
  { set: 'Gold Stars', vol: 3.1 }, { set: 'VMAX', vol: 1.4 }, { set: 'Promos', vol: 0.9 },
];

const marketTrend = [
  { date: 'Jan', index: 100 }, { date: 'Feb', index: 108 }, { date: 'Mar', index: 105 },
  { date: 'Apr', index: 118 }, { date: 'May', index: 127 }, { date: 'Jun', index: 131 },
  { date: 'Jul', index: 144 },
];

const renaisssSignals = [
  { name: 'market.renaissData.s1', value: 87, color: '#00F5FF', desc: 'market.renaissData.d1' },
  { name: 'market.renaissData.s2', value: 73, color: '#FF00E5', desc: 'market.renaissData.d2' },
  { name: 'market.renaissData.s3', value: 91, color: '#00E676', desc: 'market.renaissData.d3' },
  { name: 'market.renaissData.s4', value: 82, color: '#FFB800', desc: 'market.renaissData.d4' },
];

const hotSets = [
  { name: 'Base Set', year: '1999', heat: 98, icon: '🔥', trend: '+22%' },
  { name: 'Neo Genesis', year: '2000', heat: 85, icon: '⚡', trend: '+14%' },
  { name: 'EX Deoxys', year: '2005', heat: 79, icon: '🌟', trend: '+18%' },
  { name: 'Shining Fates', year: '2021', heat: 71, icon: '✨', trend: '+9%' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(10,15,28,0.95)', border: '1px solid rgba(0,245,255,0.3)', color: '#F8F6F0' }}>
      <div className="font-bold text-[#00F5FF]">{label}</div>
      <div>{payload[0].value}{payload[0].name === 'index' ? ' pts' : 'M'}</div>
    </div>
  );
};

export default function MarketInsights({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'trending' | 'sets' | 'renaiss'>('trending');
  const { t } = useLanguage();

  const filtered = trendingCards.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.set.toLowerCase().includes(search.toLowerCase())
  );

  const signalColor = (s: string) => s === 'bullish' ? '#00E676' : s === 'bearish' ? '#FF4444' : '#FFB800';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#00F5FF' }}>{t('market.header.subtitle')}</div>
          <h1 className="text-3xl md:text-4xl font-black text-[#F8F6F0]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('market.header.title1')}<span className="gradient-text">{t('market.header.title2')}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.25)', color: '#00F5FF' }}>
          <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
          {t('market.header.liveBadge')}
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-[#F8F6F0]">{t('market.overview.indexTitle')}</div>
            <div className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'rgba(0,230,118,0.12)', color: '#00E676' }}>{t('market.overview.ytd')}</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={marketTrend}>
              <defs>
                <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(248,246,240,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="index" stroke="#00F5FF" strokeWidth={2} fill="url(#mktGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {[
            { label: t('market.overview.mktCap'), value: '$2.4B', change: '+8.2%', positive: true },
            { label: t('market.overview.sold30d'), value: '14,821', change: '+31%', positive: true },
            { label: t('market.overview.avgPrice'), value: '$892', change: '+5.6%', positive: true },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{stat.label}</div>
              <div className="flex items-baseline justify-between">
                <div className="text-xl font-black text-[#F8F6F0]">{stat.value}</div>
                <div className="text-xs font-bold" style={{ color: stat.positive ? '#00E676' : '#FF4444' }}>{stat.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['trending', 'sets', 'renaiss'] as const).map((tValue) => (
          <button key={tValue} onClick={() => setTab(tValue)}
            className="px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all"
            style={{
              background: tab === tValue ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${tab === tValue ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: tab === tValue ? '#00F5FF' : 'rgba(248,246,240,0.6)',
            }}>
            {t(`market.tabs.${tValue}`)}
          </button>
        ))}
      </div>

      {tab === 'trending' && (
        <div>
          {/* Search */}
          <div className="mb-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('market.trending.searchPlaceholder')}
              className="w-full max-w-sm px-4 py-2.5 rounded-xl text-sm bg-transparent focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#F8F6F0', fontFamily: 'Poppins, sans-serif' }}
            />
          </div>

          <div className="grid gap-3">
            {filtered.map((card, i) => (
              <div
                key={i}
                onClick={() => onNavigate('results')}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: 'rgba(0,245,255,0.1)', color: '#00F5FF' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[#F8F6F0]">{card.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(248,246,240,0.45)' }}>{card.set} · PSA 10</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-[#F8F6F0]">{card.value}</div>
                  <div className="text-xs font-bold" style={{ color: card.change.startsWith('+') ? '#00E676' : '#FF4444' }}>{card.change}</div>
                </div>
                <div className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold capitalize"
                  style={{ background: `${signalColor(card.signal)}18`, color: signalColor(card.signal), border: `1px solid ${signalColor(card.signal)}40` }}>
                  {t(`dashboard.stats.${card.signal}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'sets' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Volume Chart */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-sm font-bold text-[#F8F6F0] mb-4">{t('market.sets.chartTitle')}</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={marketData} barCategoryGap="30%">
                <XAxis dataKey="set" tick={{ fontSize: 9, fill: 'rgba(248,246,240,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="vol" radius={[4, 4, 0, 0]} fill="#00F5FF" opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hot Sets List */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-[#F8F6F0] mb-4">{t('market.sets.listTitle')}</div>
            {hotSets.map((set, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-2xl">{set.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#F8F6F0]">{set.name} <span className="font-normal text-xs opacity-50">({set.year})</span></div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-full rounded-full" style={{ width: `${set.heat}%`, background: 'linear-gradient(90deg, #00F5FF, #FF00E5)' }} />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: '#00F5FF' }}>{set.heat}</span>
                  </div>
                </div>
                <div className="text-sm font-black" style={{ color: '#00E676' }}>{set.trend}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'renaiss' && (
        <div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {renaisssSignals.map((signal, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${signal.color}25` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-[#F8F6F0]">{t(signal.name)}</div>
                  <div className="text-2xl font-black" style={{ color: signal.color }}>{signal.value}</div>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${signal.value}%`, background: `linear-gradient(90deg, ${signal.color}, ${signal.color}88)` }} />
                </div>
                <div className="text-xs" style={{ color: 'rgba(248,246,240,0.5)' }}>{t(signal.desc)}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.2)' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">◉</span>
              <div>
                <div className="text-sm font-bold text-[#F8F6F0]">{t('market.renaissDetails.title')}</div>
                <div className="text-xs font-semibold" style={{ color: '#00F5FF' }}>{t('market.renaissDetails.subtitle')}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(248,246,240,0.65)' }}>
              {t('market.renaissDetails.desc')}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t('market.renaissDetails.m1'), value: '12,840', trend: '+18%' },
                { label: t('market.renaissDetails.m2'), value: '$4.2M', trend: '+31%' },
                { label: t('market.renaissDetails.m3'), value: '142 days', trend: '+8d' },
              ].map((m, idx) => (
                <div key={m.label} className="text-center">
                  <div className="text-lg font-black text-[#F8F6F0]">{m.value}</div>
                  <div className="text-[10px] mb-0.5" style={{ color: 'rgba(248,246,240,0.45)' }}>{m.label}</div>
                  <div className="text-[10px] font-bold" style={{ color: '#00E676' }}>{m.trend}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl text-[11px]" style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.2)', color: 'rgba(255,184,0,0.75)' }}>
            {t('market.renaissDetails.disclaimer')}
          </div>
        </div>
      )}
    </div>
  );
}
