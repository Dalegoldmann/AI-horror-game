import React from 'react';
import { Volume2, VolumeX, RotateCcw, BookOpen, Trophy } from 'lucide-react';

interface TopBarProps {
  currentBreath: number;
  maxBreaths?: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  onOpenLog: () => void;
  onOpenCodex: () => void;
  tension: number;
  isLoss?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentBreath,
  maxBreaths = 10,
  isMuted,
  onToggleMute,
  onRestart,
  onOpenLog,
  onOpenCodex,
  tension,
  isLoss = false,
}) => {
  // Tension alters pulse speed
  const isPanic = tension >= 2 || currentBreath >= 8;

  return (
    <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-4 flex items-center justify-between text-xs sm:text-sm font-mono tracking-wider select-none z-20">
      {/* Left: Breath indicator */}
      <div className="flex items-center gap-2.5 sm:gap-3 text-neutral-400">
        <span
          className={`w-2 h-2 rounded-full inline-block shrink-0 ${
            isLoss
              ? 'bg-red-700 opacity-60'
              : isPanic
              ? 'bg-red-600 animate-breath-panic'
              : 'bg-red-600 animate-breath'
          }`}
          style={{
            boxShadow: isLoss
              ? 'none'
              : isPanic
              ? '0 0 10px rgba(220, 38, 38, 0.9), 0 0 18px rgba(239, 68, 68, 0.6)'
              : '0 0 6px rgba(220, 38, 38, 0.7)',
          }}
          aria-hidden="true"
        />
        <div className="flex items-center gap-1 uppercase tracking-widest text-neutral-300">
          <span>BREATH NO.</span>
          <span
            className={`font-bold text-sm sm:text-base ml-0.5 ${
              isLoss ? 'text-red-500 line-through' : 'text-white'
            }`}
          >
            {currentBreath}
          </span>
          <span className="text-neutral-500">/{maxBreaths}</span>
          {isLoss && (
            <span className="text-[10px] text-red-500 font-bold ml-1 tracking-normal uppercase hidden sm:inline">
              [EXTINGUISHED]
            </span>
          )}
        </div>
      </div>

      {/* Right: Audio control, Log/Codex, Restart */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Log / History */}
        <button
          onClick={onOpenLog}
          title="Review Breaths Taken [L]"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="uppercase">LOG</span>
        </button>

        {/* Endings Codex */}
        <button
          onClick={onOpenCodex}
          title="Endings Unlocked [C]"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span className="uppercase">ENDINGS</span>
        </button>

        {/* Static Audio Toggle (matching screenshot: STATIC: MUTED / ACTIVE) */}
        <button
          onClick={onToggleMute}
          title="Toggle Subterranean Ambient Audio [M]"
          className={`flex items-center gap-2 px-3 py-1 rounded border text-xs tracking-wider transition-colors cursor-pointer ${
            isMuted
              ? 'border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200 bg-neutral-950/60'
              : 'border-neutral-600 text-neutral-100 bg-neutral-900/90 shadow-[0_0_12px_rgba(255,255,255,0.06)]'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-3 h-3 text-neutral-500" />
          ) : (
            <Volume2 className="w-3 h-3 text-red-500 animate-pulse" />
          )}
          <span className="uppercase font-medium">
            STATIC: {isMuted ? 'MUTED' : 'ACTIVE'}
          </span>
        </button>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          title="Restart from Breath 1 [R]"
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer px-1 py-1"
        >
          <RotateCcw className="w-3 h-3 hidden sm:inline" />
          <span className="uppercase tracking-widest text-xs font-medium">RESTART</span>
        </button>
      </div>
    </header>
  );
};
