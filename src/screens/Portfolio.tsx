import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGlobalState } from '../context/GlobalStateContext';
import { useLanguage } from '../context/LanguageContext';

type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';
interface Props { onNavigate: (s: Screen) => void; }

const performanceData = [
  { date: 'Jan', value: 29800 }, { date: 'Feb', value: 32100 }, { date: 'Mar', value: 31400 },
  { date: 'Apr', value: 36200 }, { date: 'May', value: 39800 }, { date: 'Jun', value: 41300 },
  { date: 'Jul', value: 45240 },
];

const COLORS = ['#FF6B35', '#4FC3F7', '#7C4DFF', '#00E676', '#FFB800', '#FF00E5', '#00F5FF'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(10,15,28,0.95)', border: '1px solid rgba(0,245,255,0.3)', color: '#F8F6F0' }}>
      <div className="font-bold text-[#00F5FF]">{label}</div>
      <div>${payload[0].value.toLocaleString()}</div>
    </div>
  );
};

const signalColor = (s: string) => s === 'bullish' ? '#00E676' : s === 'bearish' ? '#FF4444' : '#FFB800';
const recBg = (r: string) => r === 'buy' ? 'rgba(0,230,118,0.12)' : r === 'sell' ? 'rgba(255,68,68,0.12)' : 'rgba(255,184,0,0.12)';
const recColor = (r: string) => r === 'buy' ? '#00E676' : r === 'sell' ? '#FF4444' : '#FFB800';

export default function Portfolio({ onNavigate }: Props) {
  const { portfolio, setActiveScan, recentScans, addCardToPortfolio, isWalletConnected, connectWallet } = useGlobalState();
  const { t } = useLanguage();
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTab, setAddTab] = useState<'scanned' | 'wallet'>('scanned');

  const filtered = filter === 'all' ? portfolio : portfolio.filter(c => c.recommendation.toLowerCase() === filter.toLowerCase());

  // Dynamic calculations
  const stats = useMemo(() => {
    const totalValue = portfolio.reduce((sum, c) => sum + c.currentValue, 0);
    const totalCost = portfolio.reduce((sum, c) => sum + c.purchasePrice, 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(1) : '0.0';
    return { totalValue, totalCost, totalGain, totalGainPercent };
  }, [portfolio]);

  const pieData = useMemo(() => {
    const grouped: Record<string, number> = {};
    portfolio.forEach(c => {
      grouped[c.name] = (grouped[c.name] || 0) + c.currentValue;
    });
    return Object.entries(grouped)
      .map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [portfolio]);

  const handleCardClick = (card: any) => {
    setActiveScan(card);
    onNavigate('results');
  };

  const unscannedRecent = recentScans.filter(r => !portfolio.find(p => p.id === r.id));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#00F5FF' }}>{t('portfolio.header.subtitle')}</div>
          <h1 className="text-3xl md:text-4xl font-black text-[#F8F6F0]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('portfolio.header.title1')}<span className="gradient-text">{t('portfolio.header.title2')}</span>
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-full font-semibold text-sm self-start"
          style={{ background: 'linear-gradient(135deg, #00F5FF, #FF00E5)', color: '#0A0F1C' }}
        >
          {t('portfolio.header.addBtn')}
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-xl rounded-2xl p-6" style={{ background: 'rgba(10,15,28,0.95)', border: '1px solid rgba(0,245,255,0.2)' }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#F8F6F0]">{t('portfolio.addModal.title')}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#F8F6F0] opacity-50 hover:opacity-100">✕</button>
            </div>
            
            <div className="flex gap-4 mb-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <button onClick={() => setAddTab('scanned')} className={`pb-2 text-sm font-semibold transition-colors ${addTab === 'scanned' ? 'text-[#00F5FF] border-b-2 border-[#00F5FF]' : 'text-[#F8F6F0] opacity-50 hover:opacity-100'}`}>{t('portfolio.addModal.tabScans')}</button>
              <button onClick={() => setAddTab('wallet')} className={`pb-2 text-sm font-semibold transition-colors ${addTab === 'wallet' ? 'text-[#FF00E5] border-b-2 border-[#FF00E5]' : 'text-[#F8F6F0] opacity-50 hover:opacity-100'}`}>{t('portfolio.addModal.tabWallet')}</button>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2">
              {addTab === 'scanned' ? (
                unscannedRecent.length > 0 ? (
                  <div className="space-y-3">
                    {unscannedRecent.map(card => (
                      <div key={card.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div>
                          <div className="text-sm font-bold text-[#F8F6F0]">{card.name}</div>
                          <div className="text-[10px]" style={{ color: 'rgba(248,246,240,0.5)' }}>{card.grader} {card.grade}</div>
                        </div>
                        <button onClick={() => addCardToPortfolio(card)} className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105" style={{ background: 'rgba(0,245,255,0.1)', color: '#00F5FF', border: '1px solid rgba(0,245,255,0.3)' }}>{t('portfolio.addModal.btnAdd')}</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 opacity-50 text-sm">{t('portfolio.addModal.noScans')}</div>
                )
              ) : (
                !isWalletConnected ? (
                  <div className="text-center py-8">
                    <div className="mb-4 text-sm opacity-60">{t('portfolio.addModal.walletConnectText')}</div>
                    <button onClick={() => { connectWallet(); setAddTab('wallet'); }} className="px-6 py-2 rounded-full text-sm font-bold transition-all hover:scale-105" style={{ background: 'rgba(255,0,229,0.1)', color: '#FF00E5', border: '1px solid rgba(255,0,229,0.3)' }}>{t('portfolio.addModal.walletConnectBtn')}</button>
                  </div>
                ) : (
                  <div className="text-center py-8 opacity-50 text-sm">{t('portfolio.addModal.walletSyncedEmpty')}</div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('portfolio.stats.totalValue'), value: `$${stats.totalValue.toLocaleString()}`, color: '#00F5FF', icon: '◈' },
          { label: t('portfolio.stats.totalCost'), value: `$${stats.totalCost.toLocaleString()}`, color: 'rgba(248,246,240,0.7)', icon: '⬡' },
          { label: t('portfolio.stats.totalGain'), value: `${stats.totalGain >= 0 ? '+' : '-'}$${Math.abs(stats.totalGain).toLocaleString()}`, color: stats.totalGain >= 0 ? '#00E676' : '#FF4444', icon: '▲' },
          { label: t('portfolio.stats.roi'), value: `${stats.totalGain >= 0 ? '+' : ''}${stats.totalGainPercent}%`, color: '#FF00E5', icon: '◉' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-xl font-bold mb-0.5" style={{ color: stat.color }}>{stat.icon}</div>
            <div className="text-2xl font-black" style={{ color: stat.color, fontFamily: 'Poppins, sans-serif' }}>{stat.value}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: 'rgba(248,246,240,0.45)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* Performance Chart */}
        <div className="md:col-span-2 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-sm font-bold text-[#F8F6F0] mb-4">{t('portfolio.charts.perfTitle')}</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={performanceData}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#00F5FF" />
                  <stop offset="1" stopColor="#FF00E5" />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(248,246,240,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="url(#lineGrad)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Diversification */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-sm font-bold text-[#F8F6F0] mb-3">{t('portfolio.charts.divTitle')}</div>
          <div className="flex justify-center mb-3">
            <PieChart width={130} height={130}>
              <Pie data={pieData} cx={65} cy={65} innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-1.5">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span style={{ color: 'rgba(248,246,240,0.7)' }}>{d.name}</span>
                </div>
                <span className="font-semibold" style={{ color: d.color }}>{stats.totalValue > 0 ? ((d.value / stats.totalValue) * 100).toFixed(0) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: 'linear-gradient(135deg, rgba(255,0,229,0.06), rgba(0,245,255,0.06))', border: '1px solid rgba(255,0,229,0.2)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">✦</span>
          <span className="text-sm font-bold text-[#F8F6F0]">{t('portfolio.aiInsights.title')}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,0,229,0.2)', color: '#FF00E5' }}>{t('portfolio.aiInsights.badge')}</span>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { insight: t('portfolio.aiInsights.i1'), type: 'warning', icon: '⚠' },
            { insight: t('portfolio.aiInsights.i2'), type: 'positive', icon: '🚀' },
            { insight: t('portfolio.aiInsights.i3'), type: 'positive', icon: '✓' },
          ].map((item, i) => (
            <div key={i} className="text-xs p-3 rounded-xl" style={{
              background: item.type === 'positive' ? 'rgba(0,230,118,0.08)' : 'rgba(255,184,0,0.08)',
              border: `1px solid ${item.type === 'positive' ? 'rgba(0,230,118,0.2)' : 'rgba(255,184,0,0.2)'}`,
            }}>
              <span className="mr-1">{item.icon}</span>
              <span style={{ color: 'rgba(248,246,240,0.7)' }}>{item.insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Table/Grid */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex gap-2">
            {['all', 'buy', 'hold', 'sell'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                style={{
                  background: filter === f ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${filter === f ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: filter === f ? '#00F5FF' : 'rgba(248,246,240,0.6)',
                }}
              >
                {t(`portfolio.filters.${f}`)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(['grid', 'table'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: view === v ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${view === v ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: view === v ? '#00F5FF' : 'rgba(248,246,240,0.5)',
                }}
              >
                {v === 'grid' ? '⬡' : '≡'}
              </button>
            ))}
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filtered.map((card) => (
              <div key={card.id} onClick={() => handleCardClick(card)}
                className="rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="rounded-xl mb-3 flex items-center justify-center text-3xl relative overflow-hidden"
                  style={{ height: 90, background: 'linear-gradient(145deg, rgba(0,245,255,0.1), rgba(255,0,229,0.1))', border: '1px solid rgba(0,245,255,0.15)' }}>
                  {card.image ? (
                    <img src={card.image} alt={card.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-sm font-bold text-gray-500">{t('portfolio.grid.noImage')}</span>
                  )}
                  {card.grade && card.grade !== 'Ungraded' && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black" style={{ background: 'rgba(0,245,255,0.9)', color: '#0A0F1C' }}>
                      PSA {card.grade}
                    </div>
                  )}
                </div>
                <div className="text-xs font-bold text-[#F8F6F0] truncate">{card.name}</div>
                <div className="text-[9px] mb-1.5" style={{ color: 'rgba(248,246,240,0.45)' }}>{card.set}</div>
                <div className="text-sm font-black" style={{ color: '#00F5FF' }}>${card.currentValue.toLocaleString()}</div>
                <div className="text-[10px] mt-0.5 font-semibold" style={{ color: card.changePercent30d >= 0 ? '#00E676' : '#FF4444' }}>
                  {card.changePercent30d >= 0 ? '▲' : '▼'} {Math.abs(card.changePercent30d)}%
                </div>
                <div className="mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-center uppercase"
                  style={{ background: recBg(card.recommendation.toLowerCase()), color: recColor(card.recommendation.toLowerCase()) }}>
                  {t(`dashboard.stats.${card.recommendation.toLowerCase()}`)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    t('portfolio.table.card'), 
                    t('portfolio.table.grade'), 
                    t('portfolio.table.currentValue'), 
                    t('portfolio.table.change30d'), 
                    t('portfolio.table.pnl'), 
                    t('portfolio.table.renaiss'), 
                    t('portfolio.table.signal')
                  ].map((h, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'rgba(248,246,240,0.5)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((card, i) => (
                  <tr key={card.id} onClick={() => handleCardClick(card)}
                    className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#F8F6F0] text-xs">{card.name}</div>
                      <div className="text-[10px]" style={{ color: 'rgba(248,246,240,0.45)' }}>{card.set}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-[#00F5FF]">{card.grader} {card.grade}</td>
                    <td className="px-4 py-3 text-xs font-black text-[#F8F6F0]">${card.currentValue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: card.changePercent30d >= 0 ? '#00E676' : '#FF4444' }}>
                      {card.changePercent30d >= 0 ? '+' : ''}{card.changePercent30d}%
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: (card.currentValue - card.purchasePrice) >= 0 ? '#00E676' : '#FF4444' }}>
                      +${(card.currentValue - card.purchasePrice).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs capitalize font-semibold" style={{ color: signalColor(card.renaisssSignal) }}>
                      {t(`dashboard.stats.${card.renaisssSignal}`)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: recBg(card.recommendation.toLowerCase()), color: recColor(card.recommendation.toLowerCase()) }}>
                        {t(`dashboard.stats.${card.recommendation.toLowerCase()}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.15)' }}>
        <span style={{ color: '#00F5FF', fontSize: 16 }}>◉</span>
        <div className="text-[11px]" style={{ color: 'rgba(248,246,240,0.45)' }}>
          <strong className="text-[#F8F6F0]">{t('portfolio.disclaimer.strong')}</strong>{t('portfolio.disclaimer.text')}
        </div>
      </div>
    </div>
  );
}
