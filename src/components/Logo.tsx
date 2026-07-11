interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 36, text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 52, text: 'text-3xl', gap: 'gap-3' },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      <img 
        src="/logo.png" 
        alt="CardMind Logo" 
        style={{ 
          width: s.icon, 
          height: s.icon, 
          objectFit: 'contain',
          transform: 'scale(2.2)', // Zooms in to remove transparent padding
          marginRight: size === 'lg' ? '-4px' : size === 'md' ? '-2px' : '0px', // Pulls the text closer
          filter: 'brightness(1.3) contrast(1.2) drop-shadow(0 0 6px rgba(0,245,255,0.4))' // Makes it bolder and glow
        }} 
      />
      {showText && (
        <span
          className={`font-bold ${s.text} tracking-tight`}
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <span className="text-[#F8F6F0]">Card</span>
          <span style={{ color: '#00F5FF', textShadow: '0 0 20px rgba(0,245,255,0.6)' }}>Mind</span>
          <span className="text-[#F8F6F0]"> AI</span>
        </span>
      )}
    </div>
  );
}
