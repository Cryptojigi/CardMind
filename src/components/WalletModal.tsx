import { useGlobalState } from '../context/GlobalStateContext';

const WALLETS = [
  { name: 'MetaMask', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg', deepLink: 'https://metamask.app.link/dapp/' },
  { name: 'OKX Wallet', icon: 'https://cdn.worldvectorlogo.com/logos/okx-1.svg', deepLink: 'okx://wallet/dapp/url?dappUrl=' },
  { name: 'Binance Wallet', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.svg', deepLink: '' },
  { name: 'Trust Wallet', icon: 'https://trustwallet.com/assets/images/media/assets/TWT.png', deepLink: 'https://link.trustwallet.com/open_url?coin_id=60&url=' },
  { name: 'TokenPocket', icon: 'https://tp-statics.tokenpocket.pro/logo/tokenpocket.png', deepLink: 'tpoutside://open?url=' },
];

export default function WalletModal() {
  const { isWalletModalOpen, setIsWalletModalOpen, connectWallet } = useGlobalState();

  if (!isWalletModalOpen) return null;

  const handleWalletClick = (wallet: typeof WALLETS[0]) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // In-app wallet browser usually injects window.ethereum
    const hasEthereum = typeof window !== 'undefined' && !!(window as any).ethereum;

    if (isMobile && !hasEthereum && wallet.deepLink) {
       // user is on mobile browser (like Safari/Chrome) and clicks a wallet
       const dappUrl = window.location.href;
       const encodeUrl = encodeURIComponent(dappUrl);
       let link = wallet.deepLink;
       if (link.includes('=')) {
          link += encodeUrl;
       } else {
          // Some deep links like MetaMask take the host or full url without the query param format
          link += window.location.host; 
       }
       window.location.href = link;
       setIsWalletModalOpen(false);
       return;
    }
    
    // Otherwise rely on injected provider
    setIsWalletModalOpen(false);
    connectWallet();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsWalletModalOpen(false)}></div>
      <div 
        className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-up"
        style={{ background: '#13151A', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#F8F6F0]">Connect Wallet</h2>
          <button onClick={() => setIsWalletModalOpen(false)} className="text-[#F8F6F0] opacity-50 hover:opacity-100 text-xl font-bold leading-none mt-[-4px]">✕</button>
        </div>

        <div className="flex flex-col gap-3">
          {WALLETS.map(wallet => (
            <button
              key={wallet.name}
              onClick={() => handleWalletClick(wallet)}
              className="flex items-center justify-between w-full p-4 rounded-xl transition-all duration-200 hover:bg-[#252830]"
              style={{ background: '#1C1F26', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-4 text-[#F8F6F0] font-semibold text-sm">
                <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden bg-white/10">
                  <img src={wallet.icon} alt={wallet.name} className="w-6 h-6 object-contain" />
                </div>
                {wallet.name}
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 text-center text-xs text-[#F8F6F0] opacity-50">
          By Connecting Your Wallet, You Agree To CardMind's <br/> <button className="font-bold hover:underline mt-1">Terms Of Service</button>
        </div>
      </div>
    </div>
  )
}
