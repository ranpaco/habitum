export function AIDataGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <svg className="absolute w-full h-full" preserveAspectRatio="none">
        <defs>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Gradient for lines */}
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A8B8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#1A365D" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#16A8B8" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Animated connection lines */}
        <path
          d="M 0 200 Q 200 150 400 200 T 800 200"
          stroke="url(#line-gradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          opacity="0.6"
        >
          <animate
            attributeName="d"
            values="M 0 200 Q 200 150 400 200 T 800 200;
                    M 0 200 Q 200 250 400 200 T 800 200;
                    M 0 200 Q 200 150 400 200 T 800 200"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>
        
        <path
          d="M 100 400 Q 300 350 500 400 T 900 400"
          stroke="url(#line-gradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          opacity="0.5"
        >
          <animate
            attributeName="d"
            values="M 100 400 Q 300 350 500 400 T 900 400;
                    M 100 400 Q 300 450 500 400 T 900 400;
                    M 100 400 Q 300 350 500 400 T 900 400"
            dur="10s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Floating nodes */}
        <g filter="url(#glow)">
          <circle cx="20%" cy="30%" r="4" fill="#16A8B8">
            <animate attributeName="cy" values="30%;32%;30%" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="40%" cy="50%" r="5" fill="#1A365D">
            <animate attributeName="cy" values="50%;48%;50%" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="60%" cy="35%" r="3" fill="#16A8B8">
            <animate attributeName="cy" values="35%;37%;35%" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;1;0.7" dur="5s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="80%" cy="55%" r="4" fill="#1A365D">
            <animate attributeName="cy" values="55%;53%;55%" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="30%" cy="70%" r="3" fill="#16A8B8">
            <animate attributeName="cy" values="70%;72%;70%" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.5" dur="4.5s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="70%" cy="75%" r="5" fill="#1A365D">
            <animate attributeName="cy" values="75%;73%;75%" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}

export function AIDataGlowMinimal() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <svg className="absolute w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id="glow-radial">
            <stop offset="0%" stopColor="#16A8B8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#16A8B8" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Subtle floating orbs */}
        <circle cx="15%" cy="20%" r="100" fill="url(#glow-radial)">
          <animate attributeName="r" values="100;120;100" dur="6s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="85%" cy="60%" r="80" fill="url(#glow-radial)">
          <animate attributeName="r" values="80;100;80" dur="7s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="50%" cy="80%" r="90" fill="url(#glow-radial)">
          <animate attributeName="r" values="90;110;90" dur="8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
