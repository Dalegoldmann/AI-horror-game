/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { INITIAL_NODE_ID, STORY_NODES, StoryNode, StoryOption } from './story/storyData';
import { TopBar } from './components/TopBar';
import { StoryView } from './components/StoryView';
import { LogModal, BreathHistoryItem } from './components/LogModal';
import { CodexModal } from './components/CodexModal';
import { soundManager } from './audio/soundManager';

const STORAGE_ENDINGS_KEY = 'ten_breaths_endings_v1';
const STORAGE_RELICS_KEY = 'ten_breaths_relics_v1';

export default function App() {
  const [currentNodeId, setCurrentNodeId] = useState<string>(INITIAL_NODE_ID);
  const [currentNode, setCurrentNode] = useState<StoryNode>(STORY_NODES[INITIAL_NODE_ID]);
  const [breathHistory, setBreathHistory] = useState<BreathHistoryItem[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [tension, setTension] = useState<number>(1);

  // Modals
  const [isLogOpen, setIsLogOpen] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);

  // Unlocked achievements & relics
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ENDINGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [unlockedRelics, setUnlockedRelics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RELICS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep node updated
  useEffect(() => {
    const node = STORY_NODES[currentNodeId] || STORY_NODES[INITIAL_NODE_ID];
    setCurrentNode(node);

    // Save discovered relics
    if (node.relicDiscovered && !unlockedRelics.includes(node.relicDiscovered)) {
      const updated = [...unlockedRelics, node.relicDiscovered];
      setUnlockedRelics(updated);
      try {
        localStorage.setItem(STORAGE_RELICS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }

    // Save reached endings (excluding fatal loss states)
    if (node.isEnding && !node.isLoss && node.endingTitle && !unlockedEndings.includes(node.endingTitle)) {
      const updated = [...unlockedEndings, node.endingTitle];
      setUnlockedEndings(updated);
      try {
        localStorage.setItem(STORAGE_ENDINGS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }

    // Update tension level in audio synthesizer
    const calculatedTension = node.isLoss
      ? 10
      : Math.max(1, Math.min(10, node.breath + (node.isEnding ? 2 : 0)));
    soundManager.setTension(calculatedTension);
    setTension(calculatedTension);
  }, [currentNodeId, unlockedRelics, unlockedEndings]);

  // Restart handler
  const handleRestart = useCallback(() => {
    soundManager.playMechanicalClick();
    setCurrentNodeId(INITIAL_NODE_ID);
    setBreathHistory([]);
    setTension(1);
    soundManager.setTension(1);
    setIsLogOpen(false);
    setIsCodexOpen(false);
  }, []);

  // Rewind handler (to recover from fatal loss)
  const handleRewind = useCallback(() => {
    if (breathHistory.length === 0) {
      handleRestart();
      return;
    }
    soundManager.playMechanicalClick();
    const lastItem = breathHistory[breathHistory.length - 1];
    const newHistory = breathHistory.slice(0, breathHistory.length - 1);
    setBreathHistory(newHistory);
    setCurrentNodeId(lastItem.node.id);
  }, [breathHistory, handleRestart]);

  // Mute audio handler
  const handleToggleMute = useCallback(() => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  }, []);

  // Option selection handler
  const handleSelectOption = useCallback(
    (option: StoryOption) => {
      // Record history
      setBreathHistory((prev) => [
        ...prev,
        {
          breathNumber: currentNode.breath,
          node: currentNode,
          chosenOptionLabel: option.label,
        },
      ]);

      // Jump to next node
      const nextId = option.nextNodeId;
      if (nextId === 'start') {
        handleRestart();
      } else if (STORY_NODES[nextId]) {
        setCurrentNodeId(nextId);
      } else {
        // Fallback if missing
        setCurrentNodeId(INITIAL_NODE_ID);
      }
    },
    [currentNode, handleRestart]
  );

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcut interference if user is in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        setIsLogOpen(false);
        setIsCodexOpen(false);
        return;
      }

      // If a modal is open, don't trigger game choices
      if (isLogOpen || isCodexOpen) return;

      // Special key handling on LOSS screen
      if (currentNode.isLoss) {
        if (e.key === '1') {
          e.preventDefault();
          handleRewind();
        } else if (e.key === '2' || e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          handleRestart();
        } else if (e.key === '3' || e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          setIsLogOpen(true);
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          handleToggleMute();
        }
        return;
      }

      // Number keys 1-4 for standard gameplay
      if (['1', '2', '3', '4'].includes(e.key)) {
        const keyNum = parseInt(e.key, 10);
        const option = currentNode.options.find((opt) => opt.key === keyNum);
        if (option) {
          e.preventDefault();
          handleSelectOption(option);
        }
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestart();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setIsLogOpen(true);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsCodexOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentNode,
    isLogOpen,
    isCodexOpen,
    handleSelectOption,
    handleToggleMute,
    handleRestart,
    handleRewind,
  ]);

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-neutral-100 flex flex-col justify-between overflow-x-hidden selection:bg-neutral-800 selection:text-white">
      {/* Top subtle atmospheric vignette & gradient matching screenshot */}
      <div
        className="fixed inset-0 pointer-events-none vignette-overlay z-0"
        aria-hidden="true"
      />

      {/* Subtle background grid texture */}
      <div
        className="fixed inset-0 pointer-events-none subtle-grid opacity-20 z-0"
        aria-hidden="true"
      />

      {/* Top Navigation Bar with exact elements from screenshot */}
      <div className="relative z-10">
        <TopBar
          currentBreath={currentNode.breath}
          maxBreaths={10}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onRestart={handleRestart}
          onOpenLog={() => setIsLogOpen(true)}
          onOpenCodex={() => setIsCodexOpen(true)}
          tension={tension}
          isLoss={currentNode.isLoss}
        />
      </div>

      {/* Center Screen: Narrative + Choice Buttons */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <StoryView
          currentNode={currentNode}
          onSelectOption={handleSelectOption}
          onRestart={handleRestart}
          onRewind={handleRewind}
          onOpenLog={() => setIsLogOpen(true)}
        />
      </main>

      {/* Footer subtle brand / info */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-[11px] font-mono text-neutral-600 select-none">
        <span>TEN BREATHS // SUBTERRANEAN VOID</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCodexOpen(true)}
            className="hover:text-neutral-400 transition-colors cursor-pointer"
          >
            Endings ({unlockedEndings.length}/5)
          </button>
          <span>·</span>
          <button
            onClick={() => setIsLogOpen(true)}
            className="hover:text-neutral-400 transition-colors cursor-pointer"
          >
            Transcript
          </button>
        </div>
      </footer>

      {/* Modals */}
      <LogModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        history={breathHistory}
        currentNode={currentNode}
      />

      <CodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        unlockedEndings={unlockedEndings}
        unlockedRelics={unlockedRelics}
      />
    </div>
  );
}
