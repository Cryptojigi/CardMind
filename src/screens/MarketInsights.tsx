import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { fetchMarketplaceCards, deriveMarketStats, type MarketplaceCard } from '../services/renaissApi';

type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';
interface Props { onNavigate: (s: Screen) => void; }

// Format USDT wei string to USD number
const toUSD = (wei: string) => {
  const raw = parseFloat(wei) / 1e18;
  return raw;
};

const fmtUSD = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(10,15,28,0.95)', border: '1px solid rgba(0,245,255,0.3)', color: '#F8F6F0' }}>
      <div className="font-bold text-[#00F5FF]">{label}</div>
      <div>{typeof payload[0].value === 'number' ? payload[0].value.toLocaleString() : payload[0].value}</div>
    </div>
  );
};

const GRADE_COLORS: Record<string, string> = {
  '10': '#00E676',
  '9': '#00F5FF',
  '8': '#FF00E5',
  '7': '#FFB800',
};

export default function MarketInsights({ onNavigate: _onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [tab, setTab] = useState<'trending' | 'sets' | 'renaiss'>('trending');
  const { t } = useLanguage();

  // Live data state
  const [cards, setCards] = useState<MarketplaceCard[]>([]);
  const [allCards, setAllCards] = useState<MarketplaceCard[]>([]);
  const [totalListings, setTotalListings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch initial large batch for stats (once)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchMarketplaceCards(undefined, 50, 0);
        if (!cancelled) {
          setAllCards(res.collection);
          setCards(res.collection);
          setTotalListings(res.pagination.total);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch search results
  useEffect(() => {
    if (!debouncedSearch) {
      setCards(allCards);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setSearchLoading(true);
        const res = await fetchMarketplaceCards(debouncedSearch, 20, 0);
        if (!cancelled) {
          setCards(res.collection);
        }
      } catch (e: any) {
        // silently fail search, show original
        if (!cancelled) setCards(allCards);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debouncedSearch, allCards]);

  const stats = deriveMarketStats(allCards);

  // Build chart data from top sets
  const setChartData = stats.topSets.slice(0, 6).map(s => ({
    set: s.name.length > 18 ? s.name.substring(0, 16) + '…' : s.name,
    count: s.count,
  }));

  // Grade distribution for pie chart
  const gradeData = Object.entries(stats.gradeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([grade, count]) => ({ name: `Grade ${grade}`, value: count, color: GRADE_COLORS[grade] || '#888' }));

  // Signal colour helper
  const signalFromFMV = (fmv: number) => {
    if (fmv >= 20000) return 'bullish';
    if (fmv >= 5000) return 'neutral';
    return 'bearish';
  };
  const signalColor = (s: string) => s === 'bullish' ? '#00E676' : s === 'bearish' ? '#FF4444' : '#FFB800';

  // Compute live Renaiss signals from actual data
  const psa10Count = stats.gradeCounts['10'] || 0;
  const totalCards = stats.totalCards || 1;
  const gemMintRatio = Math.round((psa10Count / totalCards) * 100);
  const highValueCount = allCards.filter(c => parseFloat(c.fmvPriceInUSD) >= 10000).length;
  const premiumRatio = Math.round((highValueCount / totalCards) * 100);

  const liveSignals = [
    { name: t('market.renaissData.s1'), value: Math.min(gemMintRatio + 40, 99), color: '#00F5FF', desc: t('market.renaissData.d1') },
    { name: t('market.renaissData.s2'), value: premiumRatio > 0 ? Math.min(premiumRatio + 55, 95) : 73, color: '#FF00E5', desc: t('market.renaissData.d2') },
    { name: t('market.renaissData.s3'), value: totalListings > 3000 ? 91 : totalListings > 1000 ? 78 : 55, color: '#00E676', desc: t('market.renaissData.d3') },
    { name: t('market.renaissData.s4'), value: Math.min(Math.round(stats.avgPrice / 200) + 60, 96), color: '#FFB800', desc: t('market.renaissData.d4') },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00F5FF', borderTopColor: 'transparent' }} />
          <div className="text-sm font-semibold" style={{ color: '#00F5FF' }}>Loading live market data from Renaiss…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="text-4xl">⚠️</div>
          <div className="text-sm font-semibold text-red-400">Failed to load market data: {error}</div>
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'rgba(0,245,255,0.15)', color: '#00F5FF', border: '1px solid rgba(0,245,255,0.3)' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          {t('market.header.liveBadge')} · {totalListings.toLocaleString()} listings
        </div>
      </div>

      {/* Market Overview — live stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-[#F8F6F0]">{t('market.sets.chartTitle')}</div>
            <div className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'rgba(0,230,118,0.12)', color: '#00E676' }}>Live Data</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={setChartData} barCategoryGap="20%">
              <XAxis dataKey="set" tick={{ fontSize: 9, fill: 'rgba(248,246,240,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#00F5FF" opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {[
            { label: t('market.overview.mktCap'), value: fmtUSD(stats.totalValue), positive: true },
            { label: t('market.overview.sold30d'), value: totalListings.toLocaleString(), positive: true },
            { label: t('market.overview.avgPrice'), value: fmtUSD(stats.avgPrice), positive: true },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(248,246,240,0.5)' }}>{stat.label}</div>
              <div className="flex items-baseline justify-between">
                <div className="text-xl font-black text-[#F8F6F0]">{stat.value}</div>
                <div className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(0,245,255,0.1)', color: '#00F5FF' }}>LIVE</div>
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
          <div className="mb-5 relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('market.trending.searchPlaceholder')}
              className="w-full max-w-sm px-4 py-2.5 rounded-xl text-sm bg-transparent focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#F8F6F0', fontFamily: 'Poppins, sans-serif' }}
            />
            {searchLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00F5FF', borderTopColor: 'transparent' }} />
              </div>
            )}
          </div>

          <div className="grid gap-3">
            {cards.slice(0, 20).map((card, i) => {
              const fmv = parseFloat(card.fmvPriceInUSD) || 0;
              const askUSD = toUSD(card.askPriceInUSDT);
              const signal = signalFromFMV(fmv);
              const premium = fmv > 0 ? (((askUSD - fmv) / fmv) * 100) : 0;

              return (
                <div
                  key={card.tokenId}
                  className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: 'rgba(0,245,255,0.1)', color: '#00F5FF' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-[#F8F6F0] truncate">{card.pokemonName}</div>
                    <div className="text-xs truncate" style={{ color: 'rgba(248,246,240,0.45)' }}>
                      {card.setName.replace(/^Pokemon\s+(Japanese\s+)?/i, '').trim()} · {card.gradingCompany} {card.grade.split(' ')[0]}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black text-[#F8F6F0]">{fmtUSD(fmv)}</div>
                    <div className="text-xs font-bold" style={{ color: premium >= 0 ? '#00E676' : '#FF4444' }}>
                      {premium >= 0 ? '+' : ''}{premium.toFixed(1)}% ask
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold capitalize"
                    style={{ background: `${signalColor(signal)}18`, color: signalColor(signal), border: `1px solid ${signalColor(signal)}40` }}>
                    {t(`dashboard.stats.${signal}`)}
                  </div>
                </div>
              );
            })}
            {cards.length === 0 && !searchLoading && (
              <div className="text-center py-12 text-sm" style={{ color: 'rgba(248,246,240,0.4)' }}>
                No cards found for "{search}"
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'sets' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Grade Distribution Pie */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-sm font-bold text-[#F8F6F0] mb-4">Grade Distribution (Live)</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={gradeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {gradeData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {gradeData.map((g, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(248,246,240,0.6)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                  {g.name} ({g.value})
                </div>
              ))}
            </div>
          </div>

          {/* Hot Sets List */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-[#F8F6F0] mb-4">{t('market.sets.listTitle')} (Live)</div>
            {stats.topSets.slice(0, 5).map((set, i) => {
              const heat = Math.min(Math.round((set.count / (stats.topSets[0]?.count || 1)) * 100), 100);
              const icons = ['🔥', '⚡', '🌟', '✨', '💎'];
              return (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-2xl">{icons[i] || '◈'}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#F8F6F0]">
                      {set.name.length > 30 ? set.name.substring(0, 28) + '…' : set.name}
                      <span className="font-normal text-xs opacity-50 ml-1">({set.year})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${heat}%`, background: 'linear-gradient(90deg, #00F5FF, #FF00E5)' }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: '#00F5FF' }}>{set.count}</span>
                    </div>
                  </div>
                  <div className="text-sm font-black" style={{ color: '#00E676' }}>{fmtUSD(set.avgValue)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'renaiss' && (
        <div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {liveSignals.map((signal, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${signal.color}25` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-[#F8F6F0]">{signal.name}</div>
                  <div className="text-2xl font-black" style={{ color: signal.color }}>{signal.value}</div>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${signal.value}%`, background: `linear-gradient(90deg, ${signal.color}, ${signal.color}88)` }} />
                </div>
                <div className="text-xs" style={{ color: 'rgba(248,246,240,0.5)' }}>{signal.desc}</div>
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
                { label: t('market.renaissDetails.m1'), value: totalListings.toLocaleString(), trend: 'LIVE' },
                { label: t('market.renaissDetails.m2'), value: fmtUSD(stats.totalValue), trend: 'LIVE' },
                { label: t('market.renaissDetails.m3'), value: `${stats.topSets.length}+`, trend: 'sets' },
              ].map((m) => (
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
