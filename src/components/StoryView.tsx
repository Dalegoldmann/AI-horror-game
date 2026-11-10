import React, { useEffect, useState } from 'react';
import { StoryNode, StoryOption } from '../story/storyData';
import { soundManager } from '../audio/soundManager';
import { Skull, AlertTriangle, RotateCcw, Undo2, BookOpen } from 'lucide-react';

interface StoryViewProps {
  currentNode: StoryNode;
  onSelectOption: (option: StoryOption) => void;
  onRestart: () => void;
  onRewind: () => void;
  onOpenLog: () => void;
  typewriterEnabled?: boolean;
}

export const StoryView: React.FC<StoryViewProps> = ({
  currentNode,
  onSelectOption,
  onRestart,
  onRewind,
  onOpenLog,
  typewriterEnabled = false,
}) => {
  const [displayedText, setDisplayedText] = useState(currentNode.text);
  const [isTyping, setIsTyping] = useState(false);
  const [activeHoverKey, setActiveHoverKey] = useState<number | null>(null);

  // Play fatal sound on loss
  useEffect(() => {
    if (currentNode.isLoss) {
      soundManager.playFatalDeath();
    }
  }, [currentNode.id, currentNode.isLoss]);

  // Typewriter effect (optional, fast & atmospheric)
  useEffect(() => {
    if (!typewriterEnabled) {
      setDisplayedText(currentNode.text);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const fullText = currentNode.text;
    const timer = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 12);

    return () => clearInterval(timer);
  }, [currentNode.id, currentNode.text, typewriterEnabled]);

  const handleOptionClick = (option: StoryOption) => {
    if (option.soundEffect === 'thump' || currentNode.isEnding) {
      soundManager.playDeepThump();
    } else {
      soundManager.playMechanicalClick();
    }
    onSelectOption(option);
  };

  const handleMouseEnter = (key: number) => {
    setActiveHoverKey(key);
    soundManager.playHoverTone();
  };

  const handleMouseLeave = () => {
    setActiveHoverKey(null);
  };

  // If this is a FATAL LOSS screen:
  if (currentNode.isLoss) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center min-h-[70vh]">
        {/* Terminal Header for Loss */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-500 font-mono mb-2">
            <Skull className="w-4 h-4 text-red-500 animate-pulse" />
            <span>TERMINAL FAILURE // BREATH {currentNode.breath} EXTINGUISHED</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono tracking-tight text-red-100 mb-2">
            {currentNode.endingTitle || 'FATAL TERMINATION IN TOTAL OBSIDIAN'}
          </h1>

          {/* Cause of death kicker */}
          {currentNode.lossCause && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded bg-red-950/40 border border-red-900/60 text-red-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="font-semibold uppercase">Cause of Demise:</span>
              <span className="text-red-200">{currentNode.lossCause}</span>
            </div>
          )}

          <div className="w-16 h-[2px] bg-red-600 mt-4 mb-6" />
        </div>

        {/* Narrative Description of What Happens */}
        <div className="mb-6">
          <p className="font-mono text-base sm:text-lg md:text-[20px] leading-[1.75] sm:leading-[1.85] text-neutral-100 tracking-normal antialiased">
            {displayedText}
          </p>

          <div className="w-16 h-[1px] bg-red-900/60 mt-8 mb-6" />
        </div>

        {/* Tactical Post-Mortem Autopsy Box */}
        {currentNode.lossAnalysis && (
          <div className="mb-8 p-4 rounded border border-red-900/50 bg-[#0e0505] text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-red-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Post-Mortem Autopsy & Survival Analysis
              </span>
              <span className="text-neutral-500 text-[10px]">
                BREATHS ENDURED: {currentNode.breath}/10
              </span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              {currentNode.lossAnalysis}
            </p>
          </div>
        )}

        {/* Action Controls to Rewind or Restart */}
        <div className="flex flex-col gap-3 w-full">
          {/* Rewind Option */}
          <button
            onClick={() => {
              soundManager.playMechanicalClick();
              onRewind();
            }}
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
            className={`w-full text-left rounded-md border px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-150 relative overflow-hidden group cursor-pointer active:scale-[0.99] select-none ${
              activeHoverKey === 1
                ? 'border-amber-500/80 bg-[#161208] shadow-[0_0_15px_rgba(245,158,11,0.06)]'
                : 'border-neutral-800 bg-[#0d0d0d]'
            }`}
          >
            <div
              className="absolute inset-0 scanlines-texture pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
              aria-hidden="true"
            />
            <div className="relative z-10 flex items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm md:text-base">
              <span
                className={`shrink-0 tracking-wider font-mono ${
                  activeHoverKey === 1 ? 'text-amber-400 font-bold' : 'text-neutral-500'
                }`}
              >
                [1]
              </span>
              <span className="flex items-center gap-2 text-neutral-200 group-hover:text-white">
                <Undo2 className="w-4 h-4 text-amber-500 inline" />
                <span>Rewind to previous breath (Reconsider your choice)</span>
              </span>
            </div>
          </button>

          {/* Restart from Breath 1 */}
          <button
            onClick={() => {
              soundManager.playMechanicalClick();
              onRestart();
            }}
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave}
            className={`w-full text-left rounded-md border px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-150 relative overflow-hidden group cursor-pointer active:scale-[0.99] select-none ${
              activeHoverKey === 2
                ? 'border-neutral-500 bg-[#121212]'
                : 'border-neutral-800 bg-[#0a0a0a]'
            }`}
          >
            <div
              className="absolute inset-0 scanlines-texture pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
              aria-hidden="true"
            />
            <div className="relative z-10 flex items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm md:text-base">
              <span
                className={`shrink-0 tracking-wider font-mono ${
                  activeHoverKey === 2 ? 'text-amber-400 font-bold' : 'text-neutral-500'
                }`}
              >
                [2]
              </span>
              <span className="flex items-center gap-2 text-neutral-200 group-hover:text-white">
                <RotateCcw className="w-4 h-4 text-neutral-400 inline" />
                <span>Awaken on the flagstones (Restart from Breath 1)</span>
              </span>
            </div>
          </button>

          {/* Review Transcript in Log */}
          <button
            onClick={() => {
              soundManager.playMechanicalClick();
              onOpenLog();
            }}
            onMouseEnter={() => handleMouseEnter(3)}
            onMouseLeave={handleMouseLeave}
            className={`w-full text-left rounded-md border px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-150 relative overflow-hidden group cursor-pointer active:scale-[0.99] select-none ${
              activeHoverKey === 3
                ? 'border-neutral-500 bg-[#121212]'
                : 'border-neutral-800 bg-[#0a0a0a]'
            }`}
          >
            <div
              className="absolute inset-0 scanlines-texture pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
              aria-hidden="true"
            />
            <div className="relative z-10 flex items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm md:text-base">
              <span
                className={`shrink-0 tracking-wider font-mono ${
                  activeHoverKey === 3 ? 'text-amber-400 font-bold' : 'text-neutral-500'
                }`}
              >
                [3]
              </span>
              <span className="flex items-center gap-2 text-neutral-200 group-hover:text-white">
                <BookOpen className="w-4 h-4 text-neutral-400 inline" />
                <span>Review full mortality transcript in Log</span>
              </span>
            </div>
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-8 pt-4 flex items-center justify-between text-[11px] font-mono text-neutral-600 select-none">
          <span className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">1</kbd>
            <span>Rewind</span>
            <span className="mx-1">·</span>
            <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">2</kbd>
            <span>Restart</span>
            <span className="mx-1">·</span>
            <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">3</kbd>
            <span>Log</span>
          </span>
        </div>
      </div>
    );
  }

  // STANDARD IN-GAME / VICTORY VIEW
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center min-h-[70vh]">
      {/* Relic discovery banner if found */}
      {currentNode.relicDiscovered && (
        <div className="mb-6 p-3 rounded border border-amber-900/40 bg-amber-950/20 text-amber-300 text-xs sm:text-sm font-mono flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="uppercase text-amber-500 font-bold">Relic Uncovered:</span>
            <span>{currentNode.relicDiscovered}</span>
          </span>
          <span className="text-[10px] text-amber-600 uppercase tracking-widest hidden sm:inline">
            Logged to Codex
          </span>
        </div>
      )}

      {/* Ending Header (Victory / Transformation) */}
      {currentNode.isEnding && currentNode.endingTitle && (
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-emerald-500 font-mono mb-2">
            TERMINAL STATUS // FINAL INHALATION
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono tracking-tight text-white mb-2">
            {currentNode.endingTitle}
          </h1>
          <div className="w-16 h-[2px] bg-emerald-600/80 mb-6" />
        </div>
      )}

      {/* Main Narrative Passage */}
      <div className="mb-8 sm:mb-12">
        <p className="font-mono text-base sm:text-lg md:text-[21px] leading-[1.75] sm:leading-[1.85] text-neutral-100 tracking-normal antialiased selection:bg-neutral-800">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-5 ml-1 bg-neutral-400 animate-pulse align-middle" />
          )}
        </p>

        {/* Short divider line exactly like in the user screenshot */}
        <div className="w-16 h-[1px] bg-neutral-700/80 mt-8 sm:mt-12 mb-4" />
      </div>

      {/* Interactive Options Cards */}
      <div className="flex flex-col gap-3 sm:gap-4 w-full">
        {currentNode.options.map((option) => {
          const isHovered = activeHoverKey === option.key;
          return (
            <button
              key={option.key}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => handleMouseEnter(option.key)}
              onMouseLeave={handleMouseLeave}
              className={`w-full text-left rounded-md border px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-150 relative overflow-hidden group cursor-pointer active:scale-[0.99] select-none ${
                isHovered
                  ? 'border-neutral-500 bg-[#121212] shadow-[0_0_15px_rgba(255,255,255,0.03)]'
                  : 'border-neutral-800/90 bg-[#0a0a0a]'
              }`}
            >
              {/* Scanline raster overlay */}
              <div
                className="absolute inset-0 scanlines-texture pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
                aria-hidden="true"
              />

              {/* Button text row */}
              <div className="relative z-10 flex items-start sm:items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm md:text-base leading-relaxed">
                {/* [1], [2], [3], [4] key bracket */}
                <span
                  className={`shrink-0 font-mono tracking-wider transition-colors duration-150 ${
                    isHovered
                      ? 'text-amber-400 font-semibold'
                      : 'text-neutral-500'
                  }`}
                >
                  [{option.key}]
                </span>

                {/* Option prose label */}
                <span
                  className={`transition-colors duration-150 ${
                    isHovered ? 'text-white' : 'text-neutral-200'
                  }`}
                >
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helpful keyboard hint */}
      <div className="mt-8 sm:mt-10 pt-4 flex items-center justify-between text-[11px] font-mono text-neutral-600 select-none">
        <span className="flex items-center gap-2">
          <span>Keys:</span>
          <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">
            1-4
          </kbd>
          <span className="hidden sm:inline">Choose</span>
          <span className="mx-1">·</span>
          <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">
            M
          </kbd>
          <span className="hidden sm:inline">Static</span>
          <span className="mx-1">·</span>
          <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">
            R
          </kbd>
          <span className="hidden sm:inline">Restart</span>
        </span>

        {currentNode.isEnding && (
          <button
            onClick={onRestart}
            className="text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Start New Run
          </button>
        )}
      </div>
    </div>
  );
};
