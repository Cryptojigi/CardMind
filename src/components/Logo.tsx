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
  // Determine the visual size. The original image has transparent padding.
  // We'll make the actual image element larger and use negative margins to pull it tight.
  const scale = 1.8;
  const imgSize = s.icon * scale;
  // Calculate the amount of extra space the scaled image takes up
  const overflow = (imgSize - s.icon) / 2;

  return (
    <div className="flex items-center">
      <div 
        style={{ 
          width: s.icon, 
          height: s.icon, 
          position: 'relative',
          flexShrink: 0,
          marginRight: size === 'lg' ? 24 : size === 'md' ? 14 : 10 // Space between logo and text
        }}
      >
        <img 
          src="/logo.png" 
          alt="CardMind Logo" 
          style={{ 
            position: 'absolute',
            top: -overflow,
            left: -overflow,
            width: imgSize, 
            height: imgSize, 
            maxWidth: 'none',
            objectFit: 'contain',
            filter: 'brightness(1.3) contrast(1.2) drop-shadow(0 0 6px rgba(0,245,255,0.4))'
          }} 
        />
      </div>
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
