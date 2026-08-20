export function Logo({ className = "h-10 w-auto", variant = 'light' }: { className?: string, variant?: 'light' | 'dark' }) {
  const baseColor = variant === 'dark' ? '#FFFFFF' : '#0D1B3D';
  
  return (
    <svg viewBox="0 0 350 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E0E0E0" />
          <stop offset="60%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
        <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B87333" />
          <stop offset="50%" stopColor="#E3A869" />
          <stop offset="100%" stopColor="#9A5C22" />
        </linearGradient>
        
        {/* Drop shadow for 3D effect */}
        <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
        </filter>
        <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feOffset dx="-2" dy="-2"/>
          <feComposite operator="out" in2="SourceAlpha"/>
          <feComposite operator="in" in2="SourceGraphic"/>
          <feBlend mode="multiply" in2="SourceGraphic"/>
        </filter>
      </defs>
      
      <g filter="url(#dropShadow)">
        {/* B */}
        <path d="M 15 15 H 65 C 95 15 110 23 110 43 C 110 55 100 64 85 67 C 105 70 120 82 120 105 C 120 125 100 135 65 135 H 15 V 15 Z M 42 38 V 64 H 65 C 75 64 80 58 80 51 C 80 44 75 38 65 38 H 42 Z M 42 86 V 112 H 70 C 85 112 90 105 90 99 C 90 92 85 86 70 86 H 42 Z" fill={baseColor} filter="url(#innerShadow)"/>

        {/* T (Silver) */}
        {/* M 135 15 H 185 L 170 40 H 155 V 135 H 130 V 40 H 120 Z */}
        <path d="M 135 15 H 185 L 170 40 H 155 V 135 H 130 V 40 H 120 Z" fill="url(#silverGradient)" filter="url(#innerShadow)"/>

        {/* T (Blue) */}
        {/* M 200 15 H 250 L 235 40 H 220 V 135 H 195 V 40 H 185 Z */}
        <path d="M 200 15 H 250 L 235 40 H 220 V 135 H 195 V 40 H 185 Z" fill={baseColor} filter="url(#innerShadow)"/>
        
        {/* Arrow (Copper) */}
        <path d="M 250 15 H 290 V 0 L 340 27.5 L 290 55 V 40 H 235 Z" fill="url(#copperGradient)" filter="url(#innerShadow)"/>
      </g>
    </svg>
  );
}
