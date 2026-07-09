export function ScanDocumentIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glassmorphism background */}
      <rect x="8" y="12" width="48" height="40" rx="6" fill="url(#scan-glass-bg)" fillOpacity="0.2" />
      <rect x="8" y="12" width="48" height="40" rx="6" stroke="url(#scan-glass-stroke)" strokeWidth="2" />
      
      {/* Document lines */}
      <line x1="16" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="32" x2="48" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="40" x2="36" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* AI scan beam */}
      <line x1="8" y1="20" x2="56" y2="20" stroke="url(#scan-beam-gradient)" strokeWidth="3" opacity="0.8">
        <animate attributeName="y1" values="20;44;20" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="20;44;20" dur="2s" repeatCount="indefinite" />
      </line>
      
      <defs>
        <linearGradient id="scan-glass-bg" x1="8" y1="12" x2="56" y2="52">
          <stop stopColor="#16A8B8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#1A365D" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="scan-glass-stroke" x1="8" y1="12" x2="56" y2="52">
          <stop stopColor="#16A8B8" />
          <stop offset="1" stopColor="#1A365D" />
        </linearGradient>
        <linearGradient id="scan-beam-gradient" x1="0" y1="0" x2="100" y2="0">
          <stop stopColor="#16A8B8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#16A8B8" />
          <stop offset="1" stopColor="#16A8B8" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DualCurrencyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glassmorphism circles */}
      <circle cx="24" cy="28" r="16" fill="url(#currency-glass-bg)" fillOpacity="0.2" />
      <circle cx="24" cy="28" r="16" stroke="url(#currency-glass-stroke)" strokeWidth="2" />
      
      <circle cx="40" cy="36" r="16" fill="url(#currency-glass-bg)" fillOpacity="0.2" />
      <circle cx="40" cy="36" r="16" stroke="url(#currency-glass-stroke)" strokeWidth="2" />
      
      {/* USD symbol */}
      <text x="24" y="34" fontSize="18" fontWeight="bold" fill="currentColor" textAnchor="middle">$</text>
      
      {/* Local currency symbol (Bs.) */}
      <text x="40" y="42" fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">Bs</text>
      
      {/* Exchange arrows */}
      <path d="M 28 20 L 36 24 L 28 28" stroke="#16A8B8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animateTransform attributeName="transform" type="translate" values="0,0; 2,0; 0,0" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <defs>
        <linearGradient id="currency-glass-bg" x1="0" y1="0" x2="64" y2="64">
          <stop stopColor="#16A8B8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#1A365D" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="currency-glass-stroke" x1="0" y1="0" x2="64" y2="64">
          <stop stopColor="#16A8B8" />
          <stop offset="1" stopColor="#1A365D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WhatsAppAIIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glassmorphism bubble */}
      <path 
        d="M 16 44 L 12 52 L 20 48 C 24 50 28 51 32 51 C 44 51 54 41 54 29 C 54 17 44 7 32 7 C 20 7 10 17 10 29 C 10 35 12 40 16 44 Z" 
        fill="url(#whatsapp-glass-bg)" 
        fillOpacity="0.2" 
      />
      <path 
        d="M 16 44 L 12 52 L 20 48 C 24 50 28 51 32 51 C 44 51 54 41 54 29 C 54 17 44 7 32 7 C 20 7 10 17 10 29 C 10 35 12 40 16 44 Z" 
        stroke="url(#whatsapp-glass-stroke)" 
        strokeWidth="2" 
      />
      
      {/* AI spark */}
      <circle cx="32" cy="29" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 32 21 L 32 15 M 32 37 L 32 43 M 24 29 L 18 29 M 40 29 L 46 29" stroke="#16A8B8" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </path>
      
      {/* Message dots */}
      <circle cx="28" cy="29" r="2" fill="currentColor">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" begin="0s" />
      </circle>
      <circle cx="32" cy="29" r="2" fill="currentColor">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" begin="0.3s" />
      </circle>
      <circle cx="36" cy="29" r="2" fill="currentColor">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" begin="0.6s" />
      </circle>
      
      <defs>
        <linearGradient id="whatsapp-glass-bg" x1="10" y1="7" x2="54" y2="52">
          <stop stopColor="#16A8B8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#1A365D" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="whatsapp-glass-stroke" x1="10" y1="7" x2="54" y2="52">
          <stop stopColor="#16A8B8" />
          <stop offset="1" stopColor="#1A365D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BuildingManagementIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glassmorphism building */}
      <rect x="20" y="12" width="24" height="44" rx="2" fill="url(#building-glass-bg)" fillOpacity="0.2" />
      <rect x="20" y="12" width="24" height="44" rx="2" stroke="url(#building-glass-stroke)" strokeWidth="2" />

      {/* Windows */}
      <rect x="24" y="18" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="30" y="18" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="36" y="18" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />

      <rect x="24" y="26" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="30" y="26" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="36" y="26" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />

      <rect x="24" y="34" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="30" y="34" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="36" y="34" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />

      <rect x="24" y="42" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="30" y="42" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="36" y="42" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />

      {/* Door */}
      <rect x="28" y="48" width="8" height="8" rx="1" fill="currentColor" />

      {/* AI connection nodes */}
      <circle cx="16" cy="32" r="3" fill="#16A8B8" opacity="0.8">
        <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="48" cy="32" r="3" fill="#16A8B8" opacity="0.8">
        <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <line x1="16" y1="32" x2="20" y2="32" stroke="#16A8B8" strokeWidth="2" opacity="0.6" />
      <line x1="44" y1="32" x2="48" y2="32" stroke="#16A8B8" strokeWidth="2" opacity="0.6" />

      <defs>
        <linearGradient id="building-glass-bg" x1="20" y1="12" x2="44" y2="56">
          <stop stopColor="#16A8B8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#1A365D" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="building-glass-stroke" x1="20" y1="12" x2="44" y2="56">
          <stop stopColor="#16A8B8" />
          <stop offset="1" stopColor="#1A365D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function OmnichannelIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glassmorphism central hub */}
      <circle cx="32" cy="32" r="12" fill="url(#omni-glass-bg)" fillOpacity="0.2" />
      <circle cx="32" cy="32" r="12" stroke="url(#omni-glass-stroke)" strokeWidth="2" />

      {/* SMS/Phone icon */}
      <circle cx="16" cy="16" r="6" fill="url(#omni-glass-bg)" fillOpacity="0.3" stroke="#16A8B8" strokeWidth="1.5" />
      <rect x="13" y="14" width="6" height="4" rx="1" fill="currentColor" opacity="0.7" />

      {/* Email icon */}
      <circle cx="48" cy="16" r="6" fill="url(#omni-glass-bg)" fillOpacity="0.3" stroke="#16A8B8" strokeWidth="1.5" />
      <path d="M 45 14 L 48 16 L 51 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="45" y="14" width="6" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* Mobile App icon */}
      <circle cx="48" cy="48" r="6" fill="url(#omni-glass-bg)" fillOpacity="0.3" stroke="#16A8B8" strokeWidth="1.5" />
      <rect x="46" y="45" width="4" height="6" rx="0.5" fill="currentColor" opacity="0.7" />

      {/* Web Portal icon */}
      <circle cx="16" cy="48" r="6" fill="url(#omni-glass-bg)" fillOpacity="0.3" stroke="#16A8B8" strokeWidth="1.5" />
      <circle cx="16" cy="48" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* Connection lines */}
      <line x1="20" y1="20" x2="26" y2="26" stroke="#16A8B8" strokeWidth="2" opacity="0.6" strokeDasharray="2,2">
        <animate attributeName="strokeDashoffset" values="0;-4" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="44" y1="20" x2="38" y2="26" stroke="#16A8B8" strokeWidth="2" opacity="0.6" strokeDasharray="2,2">
        <animate attributeName="strokeDashoffset" values="0;-4" dur="1s" repeatCount="indefinite" begin="0.25s" />
      </line>
      <line x1="44" y1="44" x2="38" y2="38" stroke="#16A8B8" strokeWidth="2" opacity="0.6" strokeDasharray="2,2">
        <animate attributeName="strokeDashoffset" values="0;-4" dur="1s" repeatCount="indefinite" begin="0.5s" />
      </line>
      <line x1="20" y1="44" x2="26" y2="38" stroke="#16A8B8" strokeWidth="2" opacity="0.6" strokeDasharray="2,2">
        <animate attributeName="strokeDashoffset" values="0;-4" dur="1s" repeatCount="indefinite" begin="0.75s" />
      </line>

      {/* AI Core */}
      <circle cx="32" cy="32" r="4" fill="#16A8B8" opacity="0.8">
        <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
      </circle>

      <defs>
        <linearGradient id="omni-glass-bg" x1="0" y1="0" x2="64" y2="64">
          <stop stopColor="#16A8B8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#1A365D" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="omni-glass-stroke" x1="0" y1="0" x2="64" y2="64">
          <stop stopColor="#16A8B8" />
          <stop offset="1" stopColor="#1A365D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FinancialComplianceIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glassmorphism shield */}
      <path
        d="M 32 8 L 48 14 L 48 30 C 48 42 40 52 32 56 C 24 52 16 42 16 30 L 16 14 L 32 8 Z"
        fill="url(#compliance-glass-bg)"
        fillOpacity="0.2"
      />
      <path
        d="M 32 8 L 48 14 L 48 30 C 48 42 40 52 32 56 C 24 52 16 42 16 30 L 16 14 L 32 8 Z"
        stroke="url(#compliance-glass-stroke)"
        strokeWidth="2"
      />

      {/* Dollar symbol */}
      <line x1="32" y1="22" x2="32" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 28 26 C 28 24 30 22 32 22 C 34 22 36 24 36 26 C 36 28 34 30 32 30 C 30 30 28 32 28 34 C 28 36 30 38 32 38 C 34 38 36 36 36 34"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Checkmark badge */}
      <circle cx="44" cy="24" r="6" fill="#16A8B8" opacity="0.9" />
      <path d="M 41 24 L 43 26 L 47 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Audit trail dots */}
      <circle cx="24" cy="48" r="2" fill="#16A8B8" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="48" r="2" fill="#16A8B8" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <circle cx="40" cy="48" r="2" fill="#16A8B8" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>

      <defs>
        <linearGradient id="compliance-glass-bg" x1="16" y1="8" x2="48" y2="56">
          <stop stopColor="#16A8B8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#1A365D" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="compliance-glass-stroke" x1="16" y1="8" x2="48" y2="56">
          <stop stopColor="#16A8B8" />
          <stop offset="1" stopColor="#1A365D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function VendorManagementIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glassmorphism clipboard */}
      <rect x="18" y="10" width="28" height="44" rx="3" fill="url(#vendor-glass-bg)" fillOpacity="0.2" />
      <rect x="18" y="10" width="28" height="44" rx="3" stroke="url(#vendor-glass-stroke)" strokeWidth="2" />

      {/* Clipboard top */}
      <rect x="28" y="8" width="8" height="6" rx="2" fill="currentColor" opacity="0.7" />

      {/* Checklist items */}
      <g opacity="0.8">
        <circle cx="24" cy="22" r="2" stroke="#16A8B8" strokeWidth="2" fill="white" />
        <path d="M 23 22 L 24 23 L 25.5 21" stroke="#16A8B8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <line x1="30" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g opacity="0.8">
        <circle cx="24" cy="32" r="2" stroke="#16A8B8" strokeWidth="2" fill="white" />
        <path d="M 23 32 L 24 33 L 25.5 31" stroke="#16A8B8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <line x1="30" y1="32" x2="40" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g opacity="0.5">
        <circle cx="24" cy="42" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="30" y1="42" x2="40" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Warning triangle for violations */}
      <circle cx="48" cy="44" r="8" fill="#FF6B6B" opacity="0.9" />
      <path d="M 48 40 L 48 44" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="48" cy="47" r="1" fill="white" />

      {/* AI sparkle */}
      <path d="M 12 18 L 14 22 L 10 22 L 12 18 Z M 12 16 L 12 20 M 10 18 L 14 18" stroke="#16A8B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </path>

      <defs>
        <linearGradient id="vendor-glass-bg" x1="18" y1="10" x2="46" y2="54">
          <stop stopColor="#16A8B8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#1A365D" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="vendor-glass-stroke" x1="18" y1="10" x2="46" y2="54">
          <stop stopColor="#16A8B8" />
          <stop offset="1" stopColor="#1A365D" />
        </linearGradient>
      </defs>
    </svg>
  );
}
