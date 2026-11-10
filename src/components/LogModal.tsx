import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { StoryNode } from '../story/storyData';

export interface BreathHistoryItem {
  breathNumber: number;
  node: StoryNode;
  chosenOptionLabel?: string;
}

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: BreathHistoryItem[];
  currentNode: StoryNode;
}

export const LogModal: React.FC<LogModalProps> = ({
  isOpen,
  onClose,
  history,
  currentNode,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyTranscript = () => {
    const transcript = [
      ...history.map(
        (h) =>
          `[BREATH ${h.breathNumber}/10]\n${h.node.text}\n> Choice: ${h.chosenOptionLabel || 'Initial wake'}\n`
      ),
      `[BREATH ${currentNode.breath}/10 CURRENT]\n${currentNode.text}`,
    ].join('\n---\n\n');

    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0b0b0b] border border-neutral-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-sm uppercase tracking-wider text-neutral-200 font-semibold">
              Breath Log // Run Transcript
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTranscript}
              className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 border border-neutral-800 rounded hover:border-neutral-600 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Log</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs sm:text-sm">
          {history.map((item, index) => (
            <div
              key={index}
              className="border-l-2 border-neutral-800 pl-4 py-1 space-y-2 hover:border-neutral-600 transition-colors"
            >
              <div className="text-[11px] text-neutral-500 uppercase tracking-widest">
                BREATH NO. {item.breathNumber} OF 10
              </div>
              <p className="text-neutral-300 leading-relaxed">{item.node.text}</p>
              {item.chosenOptionLabel && (
                <div className="text-amber-400/90 text-xs italic bg-neutral-900/60 p-2 rounded border border-neutral-800/60">
                  You chose: &ldquo;{item.chosenOptionLabel}&rdquo;
                </div>
              )}
            </div>
          ))}

          {/* Current breath */}
          <div
            className={`border-l-2 pl-4 py-1 space-y-2 ${
              currentNode.isLoss
                ? 'border-red-600 bg-red-950/15'
                : 'border-red-800/80'
            }`}
          >
            <div className="text-[11px] text-red-500 uppercase tracking-widest font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {currentNode.isLoss ? 'MORTALITY INCIDENT' : 'CURRENT'} // BREATH NO. {currentNode.breath} OF 10
              </span>
              {currentNode.lossCause && (
                <span className="text-[10px] text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/50">
                  {currentNode.lossCause}
                </span>
              )}
            </div>
            <p className="text-white leading-relaxed">{currentNode.text}</p>
            {currentNode.lossAnalysis && (
              <p className="text-neutral-400 text-xs italic bg-neutral-900/60 p-2.5 rounded border border-neutral-800">
                <span className="text-red-400 font-semibold not-italic">Autopsy: </span>
                {currentNode.lossAnalysis}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800/80 bg-neutral-950 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Press ESC to return to darkness</span>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white underline cursor-pointer"
          >
            Close Log
          </button>
        </div>
      </div>
    </div>
  );
};
