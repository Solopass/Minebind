import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameProfile, InputPlatform, SrsCardData, UserStreak, ThemeConfig, ControlItem } from '../types';
import { BrainCircuit, Zap, Flame, Clock, CheckCircle2, ListTodo, Volume2, VolumeX, RefreshCw } from 'lucide-react';

interface PracticeTrainerProps {
  activeProfile: GameProfile;
  platform: InputPlatform;
  srsData: Record<string, SrsCardData>;
  onUpdateSrs: (cardId: string, updated: SrsCardData) => void;
  streakData: UserStreak;
  onUpdateStreak: () => void;
  activeTheme: ThemeConfig;
  isMuted: boolean;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

export const PracticeTrainer: React.FC<PracticeTrainerProps> = ({
  activeProfile,
  platform,
  srsData,
  onUpdateSrs,
  streakData,
  onUpdateStreak,
  activeTheme,
  isMuted,
  getButtonBgClass
}) => {
  const [trainingMode, setTrainingMode] = useState<'srs' | 'execution'>('srs');
  const [cramMode, setCramMode] = useState(false);
  const [cardQueue, setCardQueue] = useState<(ControlItem & { category: string })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [liveBuffer, setLiveBuffer] = useState<string[]>([]);
  const [executionSuccess, setExecutionSuccess] = useState(false);
  const bufferTimeoutRef = useRef<any>(null);

  // Initialize Card Queue
  useEffect(() => {
    const items: (ControlItem & { category: string })[] = [];
    activeProfile.categories.forEach(cat => {
      cat.items.forEach(item => {
        items.push({ ...item, category: cat.name });
      });
    });

    if (items.length === 0) return;

    const now = Date.now();
    let queue = [];

    if (cramMode) {
      queue = [...items].sort(() => Math.random() - 0.5);
    } else {
      queue = items.filter(item => {
        const id = `${activeProfile.id}-${item.id}`;
        const card = srsData[id];
        return !card || card.nextReviewDate <= now;
      }).sort(() => Math.random() - 0.5);

      // Fallback if no cards due today
      if (queue.length === 0 && items.length > 0) {
        queue = [...items].sort(() => Math.random() - 0.5).slice(0, 10);
      }
    }

    setCardQueue(queue);
    setCurrentIndex(0);
    setIsFlipped(false);
    setLiveBuffer([]);
  }, [activeProfile, cramMode, srsData]);

  const currentCard = cardQueue[currentIndex];

  const handleScore = (score: number) => {
    if (!currentCard) return;

    onUpdateStreak();

    if (!cramMode) {
      const cardId = `${activeProfile.id}-${currentCard.id}`;
      const existing = srsData[cardId] || { repetition: 0, interval: 1, easeFactor: 2.5, nextReviewDate: Date.now() };

      let { repetition, interval, easeFactor } = existing;

      if (score >= 2) {
        if (repetition === 0) interval = 1;
        else if (repetition === 1) interval = 3;
        else interval = Math.round(interval * easeFactor);
        repetition += 1;
      } else {
        repetition = 0;
        interval = 1;
      }

      easeFactor = Math.max(1.3, easeFactor + (0.1 - (3 - score) * 0.15));
      const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000;

      onUpdateSrs(cardId, { repetition, interval, easeFactor, nextReviewDate });
    }

    if (currentIndex < cardQueue.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
      setLiveBuffer([]);
    } else {
      setCardQueue([]);
    }
  };

  // Keyboard live physical listener for Execution Mode
  useEffect(() => {
    if (trainingMode !== 'execution' || !currentCard || isFlipped) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const keyName = e.key.toLowerCase();
      if (['control', 'shift', 'alt', 'meta'].includes(keyName)) return;

      e.preventDefault();

      let formattedKey = keyName;
      if (keyName === ' ') formattedKey = 'space';
      else if (keyName === 'arrowup') formattedKey = 'up';
      else if (keyName === 'arrowdown') formattedKey = 'down';
      else if (keyName === 'arrowleft') formattedKey = 'left';
      else if (keyName === 'arrowright') formattedKey = 'right';

      if (e.shiftKey && formattedKey !== 'shift') formattedKey = `shift+${formattedKey}`;
      if (e.ctrlKey && formattedKey !== 'ctrl') formattedKey = `ctrl+${formattedKey}`;

      const targetKeys = (currentCard.platformKeys?.[platform] || currentCard.keys).toLowerCase();
      const nextBuffer = [...liveBuffer, formattedKey].slice(-6);

      if (targetKeys.includes(formattedKey) || targetKeys.split(/\s+/).some(t => nextBuffer.join(' ').includes(t))) {
        setLiveBuffer([]);
        setExecutionSuccess(true);
        setIsFlipped(true);
        setTimeout(() => {
          setExecutionSuccess(false);
          handleScore(3);
        }, 800);
      } else {
        setLiveBuffer(nextBuffer);
      }

      clearTimeout(bufferTimeoutRef.current);
      bufferTimeoutRef.current = setTimeout(() => {
        setLiveBuffer([]);
      }, 2500);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trainingMode, currentCard, isFlipped, platform, liveBuffer]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header & Modes */}
      <div className="text-center space-y-4">
        <h2 className={`text-3xl font-black flex items-center justify-center ${activeTheme.textMain}`}>
          <BrainCircuit className={`w-8 h-8 mr-3 ${activeTheme.accent}`} /> Game Control & Combo Trainer
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="inline-flex p-1 rounded-xl bg-black/10 dark:bg-white/10 border border-current border-opacity-10">
            <button
              onClick={() => setTrainingMode('srs')}
              className={`px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                trainingMode === 'srs' ? getButtonBgClass(activeTheme) : activeTheme.textMuted
              }`}
            >
              SRS Recall Mode
            </button>
            <button
              onClick={() => setTrainingMode('execution')}
              className={`px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center ${
                trainingMode === 'execution' ? getButtonBgClass(activeTheme) : activeTheme.textMuted
              }`}
            >
              <Zap className="w-4 h-4 mr-1.5" /> Physical Execution
            </button>
          </div>

          <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${activeTheme.textMuted}`}>
            <input
              type="checkbox"
              checked={cramMode}
              onChange={(e) => setCramMode(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            Cram Mode (Practice All Cards)
          </label>
        </div>
      </div>

      {/* Main Flashcard Container */}
      {cardQueue.length > 0 && currentCard ? (
        <div
          className={`relative p-8 sm:p-12 rounded-3xl border shadow-2xl transition-all duration-300 min-h-[380px] flex flex-col items-center justify-between text-center ${
            executionSuccess
              ? 'bg-emerald-500/20 border-emerald-500 ring-4 ring-emerald-500/30'
              : `${activeTheme.cardBg} border-current border-opacity-20`
          }`}
        >
          {/* Top Info Bar */}
          <div className="w-full flex items-center justify-between text-xs font-bold">
            <span className={`px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 ${activeTheme.textMuted}`}>
              <ListTodo className="w-3.5 h-3.5 mr-1 inline" /> Card {currentIndex + 1} of {cardQueue.length}
            </span>

            <span className={`px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center`}>
              <Flame className="w-3.5 h-3.5 mr-1" /> {streakData.count} Day Streak
            </span>
          </div>

          {/* Prompt Question */}
          <div className="my-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 block mb-2">
              [{currentCard.category}]
            </span>
            <h3 className={`text-2xl sm:text-4xl font-black max-w-xl mx-auto leading-snug ${activeTheme.textMain}`}>
              How do you perform <span className={activeTheme.accent}>{currentCard.description}</span> in {activeProfile.name}?
            </h3>
          </div>

          {/* Answer Keycap Box */}
          {isFlipped ? (
            <div className="my-6 animate-in zoom-in-95 duration-200">
              <div className="inline-block px-6 py-4 rounded-2xl bg-black/20 dark:bg-white/10 border border-current border-opacity-20 shadow-inner">
                <kbd className="text-xl sm:text-2xl font-mono font-black tracking-widest text-emerald-400">
                  {currentCard.platformKeys?.[platform] || currentCard.keys}
                </kbd>
              </div>
              {currentCard.notes && (
                <p className="mt-3 text-xs italic text-zinc-400 max-w-md mx-auto">
                  Note: {currentCard.notes}
                </p>
              )}
            </div>
          ) : trainingMode === 'execution' ? (
            <div className="my-4">
              <p className="text-xs font-bold uppercase text-zinc-400 mb-2">
                Press the exact key combination on your keyboard or controller now:
              </p>
              <div className="flex gap-2 justify-center min-h-[36px]">
                {liveBuffer.length > 0 ? (
                  liveBuffer.map((b, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-indigo-500/20 border border-indigo-500/40 text-xs font-mono font-bold text-indigo-300 animate-pulse">
                      {b}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-zinc-500">Waiting for key inputs...</span>
                )}
              </div>
            </div>
          ) : null}

          {/* Controls Bottom */}
          <div className="w-full pt-4">
            {!isFlipped ? (
              <button
                onClick={() => setIsFlipped(true)}
                className={`w-full max-w-md py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-lg ${getButtonBgClass(activeTheme)}`}
              >
                Reveal Control Binding (Space)
              </button>
            ) : (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                  Rate your recall accuracy:
                </span>
                <div className="flex justify-center gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => handleScore(1)}
                    className="flex-1 py-3 rounded-xl font-bold text-xs uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-all"
                  >
                    Hard (Review Soon)
                  </button>
                  <button
                    onClick={() => handleScore(2)}
                    className="flex-1 py-3 rounded-xl font-bold text-xs uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => handleScore(3)}
                    className="flex-1 py-3 rounded-xl font-bold text-xs uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
                  >
                    Easy (Mastered)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`p-12 rounded-3xl border border-current border-opacity-10 text-center shadow-xl ${activeTheme.cardBg}`}>
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className={`text-2xl font-black mb-2 ${activeTheme.textMain}`}>
            Session Complete!
          </h3>
          <p className={`text-sm mb-6 ${activeTheme.textMuted}`}>
            You've reviewed all active control bindings for {activeProfile.name}.
          </p>
          <button
            onClick={() => setCramMode(true)}
            className={`px-6 py-3 rounded-xl font-bold text-sm uppercase ${getButtonBgClass(activeTheme)}`}
          >
            <RefreshCw className="w-4 h-4 mr-2 inline" /> Practice Unlimited Cram Mode
          </button>
        </div>
      )}
    </div>
  );
};
