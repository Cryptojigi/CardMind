import { useState, useRef } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { scanCardImage, scanCardByCert, scanCardByTokenId } from '../services/renaissApi';

type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';
interface Props { onNavigate: (s: Screen) => void; }

type ScanState = 'idle' | 'processing' | 'done';

const agents = [
  { name: 'Card ID Agent', task: 'Identifying card name, set, and variant...', done: false },
  { name: 'Grade Verifier', task: 'Reading PSA certification number...', done: false },
  { name: 'Market Agent', task: 'Pulling real-time price data...', done: false },
  { name: 'Renaiss Agent', task: 'Fetching ecosystem signals...', done: false },
  { name: 'Valuation Agent', task: 'Generating confidence-weighted valuation...', done: false },
];

export default function CardScanner({ onNavigate }: Props) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [dragging, setDragging] = useState(false);
  const [agentProgress, setAgentProgress] = useState(0);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { setActiveScan, addRecentScan, setIsUsingMockData } = useGlobalState();

  const startScan = async (file?: File, certId?: string) => {
    setScanState('processing');
    setAgentProgress(0);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    
    // Visual progress
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < agents.length) {
        setAgentProgress(step);
      }
    }, 600);

    try {
      let result;
      if (file) {
        result = await scanCardImage(file);
      } else if (certId) {
        result = await scanCardByCert(certId);
      } else if (tokenId) {
        const input = tokenId.trim();
        if (input.length > 15 || input.toLowerCase().startsWith('0x')) {
          result = await scanCardByTokenId(input);
        } else {
          result = await scanCardByCert(input);
        }
      } else {
        // Fallback for sample cards
        result = await scanCardByCert('PSA151238633');
      }

      clearInterval(interval);
      setAgentProgress(agents.length);
      setScanState('done');
      
      // Fallback to uploaded image preview if API returns no image
      if (!result.image && previewUrl) {
        result.image = previewUrl;
      }

      setIsUsingMockData(!!result.isMockFallback);

      setTimeout(() => {
        setActiveScan(result);
        addRecentScan(result);
        onNavigate('results');
      }, 800);
    } catch (err: any) {
      clearInterval(interval);
      console.error('Scan error:', err);
      alert('Error during scan: ' + err.message);
      setScanState('idle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#00F5FF' }}>Card Scanner</div>
        <h1 className="text-3xl md:text-4xl font-black text-[#F8F6F0]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Scan Your <span className="gradient-text">Graded Card</span>
        </h1>
        <p className="mt-2 text-base" style={{ color: 'rgba(248,246,240,0.55)' }}>
          Upload a photo of your PSA-graded Pokémon card slab for instant AI-powered valuation.
        </p>
      </div>

      {scanState === 'idle' && (
        <>
          {/* Dropzone */}
          <div
            className={`relative rounded-3xl transition-all duration-300 cursor-pointer mb-6`}
            style={{
              border: `2px dashed ${dragging ? '#00F5FF' : 'rgba(0,245,255,0.25)'}`,
              background: dragging ? 'rgba(0,245,255,0.05)' : 'rgba(255,255,255,0.02)',
              boxShadow: dragging ? '0 0 40px rgba(0,245,255,0.2)' : 'none',
              padding: '60px 40px',
              textAlign: 'center',
            }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); startScan(); }}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => startScan(e.target.files?.[0])} />

            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ background: 'rgba(0,245,255,0.1)', border: '2px solid rgba(0,245,255,0.3)' }}>
              <span className="text-4xl">⊙</span>
              <div className="absolute inset-0 rounded-full animate-pulse-neon" />
            </div>

            <h3 className="text-xl font-bold text-[#F8F6F0] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Drop your card image here
            </h3>
            <p className="text-sm mb-2" style={{ color: 'rgba(248,246,240,0.5)' }}>
              or click to browse files
            </p>
            <p className="text-xs" style={{ color: 'rgba(248,246,240,0.35)' }}>
              Supports JPG, PNG, WEBP — PSA slab photos work best
            </p>
          </div>

          {/* Action buttons */}
          {!showTokenInput ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-3 p-5 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.25)', color: '#00F5FF' }}
              >
                <span className="text-2xl">📁</span>
                <div className="text-left">
                  <div className="text-sm font-bold">Upload File</div>
                  <div className="text-xs opacity-60">JPG / PNG</div>
                </div>
              </button>
              <button
                onClick={() => setShowTokenInput(true)}
                className="flex items-center justify-center gap-3 p-5 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(248,246,240,0.04)', border: '1px solid rgba(248,246,240,0.15)', color: '#F8F6F0' }}
              >
                <span className="text-2xl">🔑</span>
                <div className="text-left">
                  <div className="text-sm font-bold">Token ID / PSA Cert Number</div>
                  <div className="text-xs opacity-60">Enter manually</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="mb-8 p-6 rounded-2xl" style={{ background: 'rgba(248,246,240,0.04)', border: '1px solid rgba(248,246,240,0.15)' }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[#F8F6F0]">Enter Token ID or PSA Cert</div>
                  <button onClick={() => setShowTokenInput(false)} className="text-xs opacity-60 hover:opacity-100" style={{ color: '#F8F6F0' }}>Cancel</button>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    placeholder="e.g. 969156... or 12345678"
                    className="flex-1 bg-transparent border rounded-lg px-4 py-2 text-sm text-[#F8F6F0] outline-none focus:border-[#00F5FF] transition-colors"
                    style={{ borderColor: 'rgba(248,246,240,0.2)' }}
                  />
                  <button
                    onClick={() => {
                      if (tokenId.trim()) {
                        startScan();
                      }
                    }}
                    disabled={!tokenId.trim()}
                    className="px-6 py-2 rounded-lg font-bold transition-all duration-300 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #00F5FF, #FF00E5)', color: '#0A0F1C' }}
                  >
                    Scan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sample cards to scan */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-sm font-bold text-[#F8F6F0] mb-4">Try with a sample card:</div>
            <div className="flex flex-wrap gap-3">
              {['Charizard PSA 10 Base Set', 'Lugia PSA 9 Neo Genesis', 'Rayquaza PSA 10 EX Deoxys'].map((name) => (
                <button
                  key={name}
                  onClick={() => startScan()}
                  className="px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
                  style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.25)', color: '#00F5FF' }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Processing state */}
      {(scanState === 'processing' || scanState === 'done') && (
        <div className="rounded-3xl p-8 md:p-12" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,245,255,0.2)' }}>
          {/* Scan visual */}
          <div className="relative mx-auto mb-8 rounded-2xl overflow-hidden" style={{ width: 200, height: 280, background: 'linear-gradient(145deg, rgba(0,245,255,0.1), rgba(255,0,229,0.1))', border: '2px solid rgba(0,245,255,0.4)' }}>
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover" alt="Scan Preview" />
            ) : (
              <div className="flex items-center justify-center h-full text-6xl opacity-50">🔍</div>
            )}
            {scanState === 'processing' && <div className="scan-line" />}
            {scanState === 'done' && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(0,230,118,0.15)', border: '2px solid #00E676' }}>
                <div className="text-4xl">✓</div>
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-center mb-2 text-[#F8F6F0]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {scanState === 'done' ? '✓ Analysis Complete!' : 'Analyzing with AI agents...'}
          </h3>
          <p className="text-sm text-center mb-8" style={{ color: 'rgba(248,246,240,0.5)' }}>
            {scanState === 'done' ? 'Redirecting to results...' : 'Our specialized agents are working together to value your card'}
          </p>

          {/* Agent progress */}
          <div className="space-y-3 max-w-md mx-auto">
            {agents.map((agent, i) => {
              const isActive = i === agentProgress - 1 && scanState === 'processing';
              const isDone = i < agentProgress;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-500"
                  style={{
                    background: isDone ? 'rgba(0,230,118,0.08)' : isActive ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isDone ? 'rgba(0,230,118,0.3)' : isActive ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    opacity: !isDone && !isActive && agentProgress > 0 ? 0.5 : 1,
                  }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: isDone ? 'rgba(0,230,118,0.2)' : isActive ? 'rgba(0,245,255,0.2)' : 'rgba(255,255,255,0.05)' }}>
                    {isDone ? '✓' : isActive ? '⟳' : '○'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold" style={{ color: isDone ? '#00E676' : isActive ? '#00F5FF' : 'rgba(248,246,240,0.5)' }}>
                      {agent.name}
                    </div>
                    <div className="text-[10px] truncate" style={{ color: 'rgba(248,246,240,0.4)' }}>{agent.task}</div>
                  </div>
                  {isActive && (
                    <div className="flex gap-1">
                      {[0,1,2].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] typing-dot" style={{ animationDelay: `${d * 0.2}s` }} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Renaiss note */}
      <div className="mt-6 p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.15)' }}>
        <span style={{ color: '#00F5FF', fontSize: 18 }}>◉</span>
        <div>
          <div className="text-xs font-bold text-[#F8F6F0] mb-0.5">Powered by Renaiss Index API (Public)</div>
          <div className="text-[11px]" style={{ color: 'rgba(248,246,240,0.45)' }}>
            Valuations incorporate real-time Renaiss ecosystem signals, on-chain marketplace activity, and liquidity depth data. For informational purposes only.
          </div>
        </div>
      </div>
    </div>
  );
}
