import Logo from '../components/Logo';
import Typewriter from 'typewriter-effect';
import { useLanguage } from '../context/LanguageContext';

type Screen = 'landing' | 'dashboard' | 'scanner' | 'results' | 'portfolio' | 'chat' | 'market';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const cards = [
  {
    name: 'Charizard',
    set: 'Base Set 1999',
    grade: 10,
    value: '$24,500',
    bg: 'linear-gradient(145deg, #FF6B35 0%, #FF4500 40%, #1A0A00 100%)',
    glow: 'rgba(255,107,53,0.5)',
    float: 'animate-float',
    rotate: '-8deg',
    z: 30,
    x: '45%',
    y: '8%',
  },
  {
    name: 'Lugia',
    set: 'Neo Genesis',
    grade: 9,
    value: '$8,900',
    bg: 'linear-gradient(145deg, #4FC3F7 0%, #0288D1 40%, #001F3F 100%)',
    glow: 'rgba(79,195,247,0.5)',
    float: 'animate-float2',
    rotate: '6deg',
    z: 20,
    x: 'calc(100% - 170px)',
    y: '30%',
  },
  {
    name: 'Umbreon',
    set: 'Neo Discovery',
    grade: 10,
    value: '$6,200',
    bg: 'linear-gradient(145deg, #7C4DFF 0%, #3D1F8E 40%, #0A0520 100%)',
    glow: 'rgba(124,77,255,0.5)',
    float: 'animate-float3',
    rotate: '-4deg',
    z: 10,
    x: '20%',
    y: '52%',
  },
];

export default function LandingPage({ onNavigate }: Props) {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('landing.howItWorks.step1Title'),
      desc: t('landing.howItWorks.step1Desc'),
      icon: '⊙',
    },
    {
      num: '02',
      title: t('landing.howItWorks.step2Title'),
      desc: t('landing.howItWorks.step2Desc'),
      icon: '◈',
    },
    {
      num: '03',
      title: t('landing.howItWorks.step3Title'),
      desc: t('landing.howItWorks.step3Desc'),
      icon: '✦',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0A0F1C' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00F5FF 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #FF00E5 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #00F5FF 0%, transparent 70%)', filter: 'blur(100px)', transform: 'translate(-50%, -50%)' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-8 md:pt-32 md:pb-12">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="z-10 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)', color: '#00F5FF' }}>
                <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse inline-block" />
                {t('landing.poweredBy')}
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-4" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
                <span className="text-[#F8F6F0]">{t('landing.theAIBrain')}</span>
                <br />
                <span className="gradient-text">{t('landing.forYour')}</span>
                <span className="text-[#F8F6F0]">
                  <Typewriter
                    options={{
                      strings: [t('landing.typewriter.cardCollection'), t('landing.typewriter.pokemonCards'), t('landing.typewriter.tradingCards')],
                      autoStart: true,
                      loop: true,
                      delay: 50,
                      deleteSpeed: 30,
                    }}
                  />
                </span>
              </h1>

              <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-xl" style={{ color: 'rgba(248,246,240,0.65)', fontFamily: 'Poppins, sans-serif' }}>
                {t('landing.subtitle')}
              </p>

              <div className="flex gap-3 sm:gap-4 w-full">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex-1 px-4 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #00F5FF, #FF00E5)',
                    color: '#0A0F1C',
                    boxShadow: '0 0 40px rgba(0,245,255,0.5), 0 8px 32px rgba(0,0,0,0.4)',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {t('landing.launchApp')}
                </button>
                <button
                  onClick={() => onNavigate('scanner')}
                  className="flex-1 px-4 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
                  style={{
                    background: 'rgba(248,246,240,0.06)',
                    border: '1px solid rgba(248,246,240,0.2)',
                    color: '#F8F6F0',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {t('landing.scanCard')}
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-[#00F5FF]">12,400+</div>
                  <div className="text-xs text-[#F8F6F0] opacity-50 font-medium">{t('landing.stats.cardsValued')}</div>
                </div>
                <div className="w-px h-10 bg-white opacity-10" />
                <div className="text-center">
                  <div className="text-2xl font-black text-[#FF00E5]">$48M+</div>
                  <div className="text-xs text-[#F8F6F0] opacity-50 font-medium">{t('landing.stats.portfolioTracked')}</div>
                </div>
                <div className="w-px h-10 bg-white opacity-10" />
                <div className="text-center">
                  <div className="text-2xl font-black text-[#F8F6F0]">94%</div>
                  <div className="text-xs text-[#F8F6F0] opacity-50 font-medium">{t('landing.stats.accuracyRate')}</div>
                </div>
              </div>
            </div>

            {/* Right: Floating Cards */}
            <div className="relative hidden lg:block" style={{ height: 600 }}>
              {cards.map((card, i) => (
                <div
                  key={i}
                  className={`absolute ${card.float} cursor-pointer hover:scale-105 transition-transform duration-300`}
                  style={{ left: card.x, top: card.y, zIndex: card.z, transform: `rotate(${card.rotate})` }}
                >
                  {/* Slab outer */}
                  <div
                    className="rounded-xl p-3"
                    style={{
                      width: 160,
                      background: 'linear-gradient(145deg, rgba(20,30,50,0.98), rgba(10,15,28,0.99))',
                      border: `2px solid ${card.glow.replace('0.5', '0.6')}`,
                      boxShadow: `0 0 40px ${card.glow}, 0 30px 80px rgba(0,0,0,0.7)`,
                    }}
                  >
                    {/* PSA Label */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black tracking-widest text-[#F8F6F0]">PSA</span>
                      <span className="text-[10px] font-black text-[#00F5FF]">GEM MT {card.grade}</span>
                    </div>
                    {/* Card visual */}
                    <div
                      className="rounded-lg holo-card"
                      style={{
                        height: 120,
                        background: card.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 40,
                      }}
                    >
                      {i === 0 ? '🐉' : i === 1 ? '🌊' : '🌙'}
                    </div>
                    {/* Card info */}
                    <div className="mt-2">
                      <div className="text-[10px] font-bold text-[#F8F6F0]">{card.name}</div>
                      <div className="text-[8px] text-[#F8F6F0] opacity-50">{card.set}</div>
                      <div className="text-[11px] font-black mt-1" style={{ color: '#00F5FF' }}>{card.value}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Decorative rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10" style={{ border: '1px solid #00F5FF' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-5" style={{ border: '1px solid #FF00E5' }} />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative py-8 md:py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-[#F8F6F0]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('landing.howItWorks.title1')}<span className="gradient-text">{t('landing.howItWorks.title2')}</span>{t('landing.howItWorks.title3')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 group"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="text-6xl font-black mb-4 opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: '#00F5FF', fontFamily: 'Poppins, sans-serif' }}>{step.num}</div>
                <div className="text-3xl mb-4" style={{ color: '#00F5FF' }}>{step.icon}</div>
                <h3 className="text-xl font-bold text-[#F8F6F0] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>{step.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: 'rgba(248,246,240,0.55)' }}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-[#00F5FF] opacity-30 text-2xl z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="rounded-3xl p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(0,245,255,0.08), rgba(255,0,229,0.08))',
              border: '1px solid rgba(0,245,255,0.2)',
              boxShadow: '0 0 80px rgba(0,245,255,0.08)',
            }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-[#F8F6F0] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('landing.cta.title1')} <span className="gradient-text">{t('landing.cta.title2')}</span>
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'rgba(248,246,240,0.6)' }}>
              {t('landing.cta.desc')}
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 animate-pulse-neon"
              style={{
                background: 'linear-gradient(135deg, #00F5FF, #FF00E5)',
                color: '#0A0F1C',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {t('landing.cta.btn')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer / About Section */}
      <footer id="about" className="py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div className="text-center">
            <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(0,245,255,0.7)' }}>
              {t('landing.footer.poweredBy')}
            </div>
            <div className="text-[10px]" style={{ color: 'rgba(248,246,240,0.3)' }}>
              {t('landing.footer.disclaimer')}
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-4">
              <a href="https://x.com/CardMindAI" target="_blank" rel="noreferrer" className="text-[#F8F6F0] opacity-60 hover:opacity-100 hover:text-[#00F5FF] transition-all">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://github.com/Cryptojigi/CardMind" target="_blank" rel="noreferrer" className="text-[#F8F6F0] opacity-60 hover:opacity-100 hover:text-[#00F5FF] transition-all">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            </div>
            <div className="text-xs" style={{ color: 'rgba(248,246,240,0.3)' }}>
              {t('landing.footer.copyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
