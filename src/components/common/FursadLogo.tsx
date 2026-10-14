import React, { useId } from 'react';

export interface FursadLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  layout?: 'horizontal' | 'vertical';
  textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  theme?: 'dark' | 'light' | 'auto';
  variant?: 'gradient' | 'white' | 'dark' | 'outline' | string;
  badge?: string;
  className?: string;
  withCard?: boolean; // Renders with clean white rounded card exactly as the user's uploaded image
}

/**
 * Fursad Ai "Rising Star" Emblem Component
 * Exact vector recreation of the uploaded brand asset:
 * - Royal Blue curved "F" silhouette
 * - Golden-yellow joyous rising figure
 * - Radiant upward arc reaching the 3D faceted golden star
 */
export const FursadEmblem: React.FC<{ className?: string; sizePx?: number }> = ({ 
  className = "w-8 h-8",
  sizePx
}) => {
  const id = useId().replace(/:/g, '');

  return (
    <svg 
      viewBox="0 0 500 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      style={sizePx ? { width: sizePx, height: sizePx } : undefined}
    >
      <defs>
        {/* Royal Blue F Gradient */}
        <linearGradient id={`bf-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#081e4f" />
          <stop offset="35%" stopColor="#0e3a94" />
          <stop offset="70%" stopColor="#1a54cc" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Top Bar 3D Surface Highlight */}
        <linearGradient id={`hl-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1443a6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9" />
        </linearGradient>

        {/* Golden Figure Gradient */}
        <linearGradient id={`gf-${id}`} x1="0%" y1="100%" x2="90%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="65%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>

        {/* Head Radial Gradient */}
        <radialGradient id={`gh-${id}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#fbbf24" />
          <stop offset="85%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>

        {/* Star Glow */}
        <filter id={`sg-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Bottom Dark Blue Accent Curve (depth shadow under the F tail) */}
      <path
        d="M135 365 C175 360 235 330 280 290 C268 310 215 350 135 365 Z"
        fill="#061536"
        opacity="0.95"
      />

      {/* 1. Main Blue "F" Silhouette */}
      <path 
        d="M135 365
           C126 305 125 235 138 178
           C150 120 185 88 230 88
           L355 88
           C366 88 373 96 373 106
           L373 128
           C373 138 366 146 355 146
           L245 146
           C215 146 198 165 198 196
           L198 215
           L348 215
           C358 215 366 223 366 233
           L366 256
           C366 266 358 274 348 274
           L265 274
           C290 260 320 238 335 210
           C295 245 245 285 195 316
           C165 336 145 354 135 365 Z"
        fill={`url(#bf-${id})`}
      />

      {/* Top Bar 3D Surface Highlight */}
      <path
        d="M230 88 L355 88 C366 88 373 96 373 106 L373 114 C360 100 335 96 280 96 L230 96 C210 96 190 100 175 108 C188 96 208 88 230 88 Z"
        fill={`url(#hl-${id})`}
      />

      {/* 2. Dynamic Golden Rising Figure & Ascending Arc */}
      <path
        d="M135 365
           C160 354 205 312 240 262
           C245 252 240 236 225 231
           C212 226 200 227 192 231
           C202 221 216 217 232 219
           C248 221 258 233 268 246
           C285 221 315 176 355 131
           C375 109 388 99 395 96
           C392 109 376 139 355 171
           C325 216 285 266 245 299
           C195 340 155 360 135 365 Z"
        fill={`url(#gf-${id})`}
      />

      {/* Golden Figure Head (Circle in joyous rising pose) */}
      <circle 
        cx="275" 
        cy="190" 
        r="28" 
        fill={`url(#gh-${id})`} 
      />
      {/* Head soft highlight reflection */}
      <circle
        cx="268"
        cy="183"
        r="9"
        fill="#ffffff"
        opacity="0.5"
      />

      {/* 3. 3D Faceted Golden Star (Rising Star at Apex) */}
      <g transform="translate(400, 72) rotate(-8)" filter={`url(#sg-${id})`}>
        {/* Facet 0 (Top Point) */}
        <polygon points="0,0 0,-42 -10,-13.8" fill="#fef08a" />
        <polygon points="0,0 0,-42 10,-13.8" fill="#f59e0b" />

        {/* Facet 1 (Right Point) */}
        <polygon points="0,0 39.9,-13 10,-13.8" fill="#fde047" />
        <polygon points="0,0 39.9,-13 16.2,5.3" fill="#d97706" />

        {/* Facet 2 (Bottom-Right Point) */}
        <polygon points="0,0 24.7,34 16.2,5.3" fill="#fbbf24" />
        <polygon points="0,0 24.7,34 0,17" fill="#b45309" />

        {/* Facet 3 (Bottom-Left Point) */}
        <polygon points="0,0 -24.7,34 0,17" fill="#f59e0b" />
        <polygon points="0,0 -24.7,34 -16.2,5.3" fill="#b45309" />

        {/* Facet 4 (Left Point) */}
        <polygon points="0,0 -39.9,-13 -16.2,5.3" fill="#fde047" />
        <polygon points="0,0 -39.9,-13 -10,-13.8" fill="#d97706" />

        {/* Center gleaming core point */}
        <circle cx="-1" cy="-2" r="3.5" fill="#ffffff" opacity="0.9" />
      </g>
    </svg>
  );
};

export const FursadLogo: React.FC<FursadLogoProps> = ({
  size = 'md',
  showText = true,
  layout = 'horizontal',
  textSize,
  theme = 'auto',
  variant,
  badge,
  className = '',
  withCard = false
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  const textSizes = {
    xs: 'text-xs font-semibold',
    sm: 'text-sm font-bold',
    base: 'text-base font-bold',
    lg: 'text-lg sm:text-xl font-black',
    xl: 'text-xl sm:text-2xl font-black',
    '2xl': 'text-2xl sm:text-3xl font-black',
    '3xl': 'text-3xl sm:text-4xl font-black'
  };

  const defaultTextSize = textSize || (
    size === 'xs' ? 'xs' :
    size === 'sm' ? 'sm' :
    size === 'md' ? 'lg' :
    size === 'lg' ? 'xl' :
    size === 'xl' ? '2xl' : '3xl'
  );

  // Layout: Vertical is exact match for the square uploaded image badge
  const isVertical = layout === 'vertical';

  const content = (
    <div 
      className={`inline-flex ${
        isVertical ? 'flex-col items-center text-center gap-3' : 'items-center gap-3'
      } select-none transition-transform duration-200 ${className}`}
    >
      {/* Emblem */}
      <div className="relative group shrink-0">
        <FursadEmblem className={`${iconSizes[size]} transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_16px_rgba(26,84,204,0.35)]`} />
      </div>

      {/* Wordmark: FURSAD AI */}
      {showText && (
        <div className={`flex items-baseline gap-1.5 leading-none font-sans font-black tracking-tight ${textSizes[defaultTextSize]}`}>
          {/* FURSAD word */}
          <span 
            className={
              theme === 'light' 
                ? 'text-[#0a2569]' 
                : 'text-white'
            }
            style={{ letterSpacing: '-0.02em' }}
          >
            FURSAD
          </span>

          {/* AI word with golden warmth */}
          <span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.45)]"
            style={{ letterSpacing: '-0.02em' }}
          >
            AI
          </span>

          {badge && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider align-middle">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (withCard) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
