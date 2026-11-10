import React from 'react';
import { X, Trophy, Shield, Key } from 'lucide-react';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedEndings: string[];
  unlockedRelics: string[];
}

interface EndingDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
}

const ALL_ENDINGS: EndingDefinition[] = [
  {
    id: 'ENDING I: THE LIGHT OF DAWN',
    title: 'Ending I: The Light of Dawn',
    category: 'SURVIVAL',
    description: 'Broke through the upper storm hatch using the brass key as the sun broke the horizon.',
  },
  {
    id: 'ENDING II: THE TENTH INHALATION',
    title: 'Ending II: The Tenth Inhalation',
    category: 'TRANSFORMATION',
    description: 'Shared your tenth breath with the chained titan, ascending into the night as rider and beast.',
  },
  {
    id: 'ENDING III: THE ANCIENT COMPACT',
    title: 'Ending III: The Ancient Compact',
    category: 'SURVIVAL',
    description: 'Freed the guardian from centuries of iron and parted ways in mutual respect under alpine fog.',
  },
  {
    id: 'ENDING IV: THE MOONLIT TORRENT',
    title: 'Ending IV: The Moonlit Torrent',
    category: 'ESCAPE',
    description: 'Rode the runaway ore cart off the precipice and survived the icy plunge into the river.',
  },
  {
    id: 'ENDING V: THE MIRACLE AT SECTOR 7',
    title: 'Ending V: The Miracle at Sector 7',
    category: 'RESCUE',
    description: 'Activated the auxiliary ventilation purge and signaled the surface recovery team with a flare.',
  },
];

const ALL_RELICS = [
  {
    name: 'Ornate Brass Clockwork Key',
    lore: 'A clover-toothed key found in the lining of your coat. Fits the subterranean drainage gate.',
  },
  {
    name: 'Ancient Iron Collar Link',
    lore: 'A hand-forged link cleaved from the neck of the subterranean entity.',
  },
  {
    name: 'Bioluminescent Lichen Jar',
    lore: 'Cast-off subterranean flora that emits a cold emerald phosphorescence in utter blackness.',
  },
  {
    name: 'Cranial Survey Plate',
    lore: 'A surgically bolted nickel-silver plate in your skull, proof of the Sector 7 cave-in.',
  },
];

export const CodexModal: React.FC<CodexModalProps> = ({
  isOpen,
  onClose,
  unlockedEndings,
  unlockedRelics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0b0b0b] border border-neutral-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm uppercase tracking-wider text-neutral-200 font-semibold">
              Endings & Relics Codex
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 font-mono text-xs sm:text-sm">
          {/* Section 1: Endings */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-neutral-800/80 pb-2">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-red-500" />
                Destinies Discovered ({unlockedEndings.length} / {ALL_ENDINGS.length})
              </span>
              <span className="text-[11px] text-neutral-500">
                {Math.round((unlockedEndings.length / ALL_ENDINGS.length) * 100)}% Complete
              </span>
            </div>

            <div className="grid gap-3">
              {ALL_ENDINGS.map((ending) => {
                const isUnlocked = unlockedEndings.includes(ending.id);
                return (
                  <div
                    key={ending.id}
                    className={`p-3.5 rounded border transition-colors ${
                      isUnlocked
                        ? 'border-neutral-700 bg-neutral-900/60'
                        : 'border-neutral-900 bg-neutral-950/40 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-semibold ${
                          isUnlocked ? 'text-neutral-100' : 'text-neutral-600'
                        }`}
                      >
                        {isUnlocked ? ending.title : '??? [LOCKED DESTINY]'}
                      </span>
                      {isUnlocked && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                          {ending.category}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      {isUnlocked
                        ? ending.description
                        : 'Survive or alter your choices across all ten breaths to discover this fate.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Relics */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-neutral-800/80 pb-2">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                Relics Recovered ({unlockedRelics.length} / {ALL_RELICS.length})
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {ALL_RELICS.map((relic) => {
                const isUnlocked = unlockedRelics.includes(relic.name);
                return (
                  <div
                    key={relic.name}
                    className={`p-3 rounded border text-xs ${
                      isUnlocked
                        ? 'border-amber-900/40 bg-amber-950/15 text-amber-200'
                        : 'border-neutral-900 bg-neutral-950/40 text-neutral-600'
                    }`}
                  >
                    <div className="font-semibold mb-1 flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isUnlocked ? 'bg-amber-400' : 'bg-neutral-700'
                        }`}
                      />
                      <span>{isUnlocked ? relic.name : 'Unknown Relic'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-neutral-400">
                      {isUnlocked ? relic.lore : 'Hidden deep in subterranean crags.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Codex saved automatically in local memory</span>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white underline cursor-pointer"
          >
            Close Codex
          </button>
        </div>
      </div>
    </div>
  );
};
