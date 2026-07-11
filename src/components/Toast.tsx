import { useGlobalState } from '../context/GlobalStateContext';
import { useEffect } from 'react';

export default function Toast() {
  const { toastMessage, toastType, hideToast } = useGlobalState();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, hideToast]);

  if (!toastMessage) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center justify-between p-4 rounded-xl shadow-2xl animate-fade-up"
      style={{ 
        background: 'rgba(10, 15, 28, 0.95)', 
        border: `1px solid ${toastType === 'error' ? '#FF4444' : toastType === 'success' ? '#00E676' : '#00F5FF'}`,
        color: '#F8F6F0',
        backdropFilter: 'blur(10px)',
        minWidth: '320px',
        maxWidth: '90vw'
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none mt-0.5" style={{ color: toastType === 'error' ? '#FF4444' : toastType === 'success' ? '#00E676' : '#00F5FF' }}>
          {toastType === 'error' ? '⚠' : toastType === 'success' ? '✓' : 'ℹ'}
        </span>
        <span className="text-sm font-medium leading-relaxed">{toastMessage}</span>
      </div>
      <button onClick={hideToast} className="ml-4 opacity-50 hover:opacity-100 text-lg leading-none" style={{ color: '#F8F6F0' }}>×</button>
    </div>
  );
}
