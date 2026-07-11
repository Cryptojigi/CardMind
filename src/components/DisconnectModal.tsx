import { useGlobalState } from '../context/GlobalStateContext';

export default function DisconnectModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { disconnectWallet } = useGlobalState();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div 
        className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-up text-center"
        style={{ background: '#13151A', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: 'rgba(255,50,50,0.1)' }}>
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-[#F8F6F0] mb-2">Disconnect Wallet</h2>
        <p className="text-sm text-[#F8F6F0] opacity-60 mb-6">Are you sure you want to disconnect your wallet from CardMind?</p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold text-[#F8F6F0] transition-colors hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Cancel
          </button>
          <button 
            onClick={() => { disconnectWallet(); onClose(); }}
            className="flex-1 py-3 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
            style={{ background: '#FF3366', color: '#FFF' }}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
