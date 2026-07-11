import { useState, useRef, useEffect } from 'react';
import { chatHistory, smartPrompts, mockCards, Card } from '../data/mockData';
import { useGlobalState } from '../context/GlobalStateContext';
import { askGemini } from '../services/geminiApi';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';

type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';
interface Props { onNavigate: (s: Screen) => void; }

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agents?: string[];
  loading?: boolean;
}

const agentSteps: Record<string, string[]> = {
  charizard: ['Pulling market data for Charizard PSA 10...', 'Analyzing 90-day price trend...', 'Fetching Renaiss ecosystem signals...', 'Generating recommendation...'],
  portfolio: ['Loading portfolio data...', 'Calculating performance metrics...', 'Analyzing Renaiss signals across holdings...', 'Identifying opportunities...'],
  market: ['Scanning market for hot opportunities...', 'Analyzing PSA population data...', 'Cross-referencing Renaiss liquidity scores...', 'Ranking opportunities...'],
  default: ['Processing your query...', 'Pulling relevant market data...', 'Generating AI response...'],
};

const aiResponses: Record<string, string> = {
  "What's the outlook for my Charizard PSA 10?": `**Charizard Base Set PSA 10 — Bullish Outlook** 🐉

Your Charizard PSA 10 (Cert #12345678) is performing exceptionally well. Here's my analysis:

**Current Position:** $24,500 (+35.9% since purchase)
**30-Day Trend:** +5.2% — strong consistent upward momentum

**Key Factors Supporting Hold:**
• PSA 10 population sits at only 121 copies — extremely scarce for such an iconic card
• Zero higher-grade copies exist (apex grade)
• Renaiss ecosystem showing sustained bullish signals with high on-chain activity
• Base Set Charizard continues to drive cultural demand beyond typical card markets

**My Recommendation:** HOLD with conviction. The scarcity fundamentals are exceptional. I'd only consider selling if you need liquidity, as replacing this specific grade would likely cost you a premium.

*Confidence: 87% | Powered by Renaiss Index API (Beta)*`,

  "Which cards in my portfolio should I consider selling?": `**Portfolio Sell Analysis** 📊

After analyzing your 5-card portfolio against current market conditions and Renaiss signals, here's what I'd consider:

**Consider Trimming: None (All Hold/Buy)**
Your portfolio is in excellent shape. No immediate sell signals.

**Watch Closely:**
• **Umbreon PSA 10** — Minor 30d dip (-2.8%). Neutral Renaiss signal. Not urgent, but monitor for continuation below $5,800.

**Strong Holds:**
• Charizard PSA 10 — Apex scarcity, hold
• Rayquaza Gold Star PSA 10 — Highest momentum in portfolio (+8.9%), Renaiss bullish
• Lugia PSA 9 — High liquidity, bullish signal

**Action Item:** Consider rebalancing to reduce Charizard concentration (currently 54% of portfolio) rather than selling outright.

*Renaiss signals refreshed in real-time | Beta data*`,

  "What are the hottest PSA 10 opportunities right now?": `**🔥 Top PSA 10 Opportunities (July 2026)**

Based on Renaiss market data and AI analysis:

**1. Rayquaza Gold Star EX Deoxys PSA 10** — $3,800
Momentum: +8.9% | Pop: 58 | Signal: ↑ BULLISH
*Extremely low population, Gold Star rarity premium building*

**2. Espeon Neo Discovery PSA 10** — $2,100
Momentum: +4.2% | Pop: 94 | Signal: ↑ BULLISH
*Fan-favorite Eeveelution, consistent appreciation*

**3. Scizor Neo Discovery PSA 10** — $1,680
Momentum: +11.2% | Pop: 71 | Signal: ↑ BULLISH
*Undervalued relative to population, strong Renaiss activity*

**4. Mewtwo Base Set PSA 10** — $3,200
Momentum: +9.8% | Pop: 89 | Signal: ↑ BULLISH
*Classic status, high institutional interest*

*AI confidence varies by card. Not financial advice. Renaiss data in Beta.*`,
};

const getResponse = (query: string, portfolio: Card[], activeScan: Card | null): string => {
  if (activeScan && query.includes(activeScan.name)) {
    return `**${activeScan.name} ${activeScan.grader} ${activeScan.grade} — Analysis** ✦\n\nI've analyzed your ${activeScan.name} (Cert #${activeScan.certNumber}).\n\n**Current Value:** $${activeScan.currentValue.toLocaleString()}\n**30-Day Trend:** ${activeScan.changePercent30d > 0 ? '+' : ''}${activeScan.changePercent30d}%\n\n**Renaiss Signal:** ${activeScan.renaisssSignal.toUpperCase()}\nThe Renaiss ecosystem indicates a ${activeScan.renaisssSignal} sentiment. With a population of ${activeScan.population}, I recommend a strong **${activeScan.recommendation.toUpperCase()}**.\n\n*Confidence: ${activeScan.confidence}% | Powered by Renaiss Index API (Public)*`;
  }
  
  if (query.toLowerCase().includes('portfolio') || query.toLowerCase().includes('selling')) {
    const total = portfolio.reduce((sum, c) => sum + c.currentValue, 0);
    if (total === 0) return `Your portfolio is currently empty. Try scanning a card to get portfolio analysis!`;
    return `**Portfolio Analysis** 📊\n\nAfter analyzing your portfolio (Total Value: $${total.toLocaleString()}) against current market conditions and Renaiss signals, here's my advice:\n\n**Overall Health:** Excellent. Most of your assets are showing strong momentum.\n\n**Action Item:** Continue holding your key assets. The market data and Renaiss ecosystem signals align positively for your current holdings.\n\n*Renaiss signals refreshed in real-time | Public data*`;
  }

  for (const key of Object.keys(aiResponses)) {
    if (query.includes(key.substring(0, 15))) return aiResponses[key];
  }
  return `**CardMind AI Analysis** ✦\n\nI've processed your query using our multi-agent system across market data, portfolio context, and Renaiss ecosystem signals.\n\nBased on current market conditions for PSA-graded Pokémon cards:\n\n• **Market Sentiment:** Generally bullish with strong collector demand in vintage sets (Base Set, Neo series, EX era Gold Stars)\n• **Renaiss Signals:** Elevated on-chain activity suggests institutional and collector interest is converging\n\nWould you like me to dig deeper into any specific card or market segment? I can pull detailed Renaiss ecosystem data, population reports, or price trend analysis.\n\n*Powered by Renaiss Index API (Public) — For informational purposes only*`;
};

const getAgentSteps = (query: string): string[] => {
  if (query.toLowerCase().includes('charizard')) return agentSteps.charizard;
  if (query.toLowerCase().includes('portfolio') || query.toLowerCase().includes('selling')) return agentSteps.portfolio;
  if (query.toLowerCase().includes('opportunit') || query.toLowerCase().includes('hot')) return agentSteps.market;
  return agentSteps.default;
};

export default function AIChat({ onNavigate }: Props) {
  const { portfolio, activeScan, pendingChatPrompt, setPendingChatPrompt } = useGlobalState();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([...chatHistory]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (pendingChatPrompt) {
      setInput(pendingChatPrompt);
      setPendingChatPrompt(null);
    }
  }, [pendingChatPrompt, setPendingChatPrompt]);

  const sendMessage = async (text?: string) => {
    const query = text || input.trim();
    if (!query || isThinking) return;
    setInput('');

    const userMsg: Message = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Show thinking animation while Gemini processes
    const steps = getAgentSteps(query);
    const stepPromise = (async () => {
      for (const step of steps) {
        setThinkingStep(step);
        await new Promise(r => setTimeout(r, 600));
      }
    })();

    // Call real Gemini API in parallel with thinking animation
    let responseText: string;
    try {
      const historyForGemini = messages.map(m => ({ role: m.role, content: m.content }));
      const [geminiResponse] = await Promise.all([
        askGemini(query, portfolio, activeScan, historyForGemini, language),
        stepPromise,
      ]);
      responseText = geminiResponse;
    } catch (err) {
      console.warn('Gemini API failed, using fallback:', err);
      await stepPromise;
      responseText = getResponse(query, portfolio, activeScan);
    }

    setIsThinking(false);
    const aiMsg: Message = {
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agents: ['Market Agent', 'Portfolio Agent', 'Renaiss Agent'],
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} className="font-bold text-[#F8F6F0] mb-1" dangerouslySetInnerHTML={{ __html: boldProcessed }} />;
      }
      if (line.startsWith('•')) {
        return <div key={i} className="text-sm ml-3 mb-1" style={{ color: 'rgba(248,246,240,0.8)' }} dangerouslySetInnerHTML={{ __html: boldProcessed }} />;
      }
      if (line.startsWith('*') && line.endsWith('*')) {
        return <div key={i} className="text-[11px] mt-2 italic" style={{ color: 'rgba(248,246,240,0.45)' }}>{line.replace(/\*/g, '')}</div>;
      }
      if (line === '') return <div key={i} className="h-2" />;
      return <div key={i} className="text-sm mb-1" style={{ color: 'rgba(248,246,240,0.8)' }} dangerouslySetInnerHTML={{ __html: boldProcessed }} />;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex flex-col" style={{ height: 'calc(100vh - 68px)' }}>
      {/* Compact Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-xl font-black text-[#F8F6F0]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <span className="text-xs font-bold tracking-widest uppercase mr-2" style={{ color: '#FF00E5' }}>{t('chat.header.ai')}</span>
            {t('chat.header.title1')}<span className="gradient-text">{t('chat.header.title2')}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.25)', color: '#00F5FF' }}>
          <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
          {t('chat.header.activeAgents')}
        </div>
      </div>

      {/* Smart Prompts */}
      {messages.length <= 1 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-1.5">
            {smartPrompts.slice(0, 4).map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all hover:scale-105"
                style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', color: 'rgba(0,245,255,0.9)' }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,245,255,0.3) transparent' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-1" style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.3), rgba(255,0,229,0.3))', border: '1px solid rgba(0,245,255,0.4)' }}>
                <span className="text-xs">✦</span>
              </div>
            )}
            <div className="max-w-[90%] md:max-w-[85%]">
              {msg.role === 'assistant' && msg.agents && (
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  {msg.agents.map(a => (
                    <span key={a} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', color: 'rgba(0,245,255,0.8)' }}>
                      {a}
                    </span>
                  ))}
                </div>
              )}
              <div
                className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={{
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(255,0,229,0.1))'
                    : 'rgba(255,255,255,0.04)',
                  border: msg.role === 'user'
                    ? '1px solid rgba(0,245,255,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderBottomRightRadius: msg.role === 'user' ? 4 : undefined,
                  borderBottomLeftRadius: msg.role === 'assistant' ? 4 : undefined,
                }}
              >
                {msg.role === 'assistant' ? renderContent(msg.content) : (
                  <span style={{ color: '#F8F6F0' }}>{msg.content}</span>
                )}
              </div>
              <div className="text-[10px] mt-1 px-1" style={{ color: 'rgba(248,246,240,0.3)', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking state */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3" style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.3), rgba(255,0,229,0.3))', border: '1px solid rgba(0,245,255,0.4)' }}>
              <span className="text-xs">✦</span>
            </div>
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderBottomLeftRadius: 4 }}>
              <div className="text-xs mb-2" style={{ color: '#00F5FF' }}>{thinkingStep}</div>
              <div className="flex gap-1.5">
                {[0,1,2].map(d => <div key={d} className="w-2 h-2 rounded-full bg-[#00F5FF] typing-dot" style={{ animationDelay: `${d * 0.2}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Context card reference */}
      <div className="mt-2 mb-1 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <span className="text-[9px] font-semibold flex-shrink-0" style={{ color: 'rgba(248,246,240,0.35)' }}>{t('chat.contextLabel')}</span>
        {(portfolio.length > 0 ? portfolio : mockCards).slice(0, 3).map(card => (
          <button key={card.id}
            onClick={() => sendMessage(`${t('chat.contextPrompt')}${card.name} ${card.grader} ${card.grade}`)}
            className="flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(248,246,240,0.5)' }}>
            {card.name} {card.grader}{card.grade}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
            placeholder={t('chat.input.placeholder')}
            className="w-full bg-transparent px-4 py-2.5 text-sm focus:outline-none"
            style={{ color: '#F8F6F0', fontFamily: 'Poppins, sans-serif' }}
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isThinking}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all duration-300 hover:scale-105 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #00F5FF, #FF00E5)', color: '#0A0F1C' }}
        >
          ↑
        </button>
      </div>

      <div className="mt-1 mb-1 text-[9px] text-center" style={{ color: 'rgba(248,246,240,0.3)' }}>
        {t('chat.disclaimer')}
      </div>
    </div>
  );
}
