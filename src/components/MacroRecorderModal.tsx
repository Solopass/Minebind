import React, { useState, useEffect } from 'react';
import { GameProfile, ThemeConfig } from '../types';
import { Circle, StopCircle, X, Check, Gamepad2 } from 'lucide-react';

interface MacroRecorderModalProps {
  activeProfile: GameProfile;
  onSaveMacro: (description: string, sequenceString: string) => void;
  onClose: () => void;
  activeTheme: ThemeConfig;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

export const MacroRecorderModal: React.FC<MacroRecorderModalProps> = ({
  activeProfile,
  onSaveMacro,
  onClose,
  activeTheme,
  getButtonBgClass
}) => {
  const [recordName, setRecordName] = useState('');
  const [recordedKeys, setRecordedKeys] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isListening) {
        e.preventDefault();
        const keyName = e.key.toLowerCase();
        if (['control', 'shift', 'alt', 'meta'].includes(keyName)) return;

        let key = keyName;
        if (key === ' ') key = 'space';
        else if (key === 'arrowup') key = 'up';
        else if (key === 'arrowdown') key = 'down';
        else if (key === 'arrowleft') key = 'left';
        else if (key === 'arrowright') key = 'right';

        if (e.shiftKey && key !== 'shift') key = `Shift+${key}`;
        if (e.ctrlKey && key !== 'ctrl') key = `Ctrl+${key}`;

        setRecordedKeys(prev => [...prev, key]);
      } else {
        if (e.key === 'Escape') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, onClose]);

  const handleSave = () => {
    if (!recordName.trim() || recordedKeys.length === 0) return;
    const seqStr = recordedKeys.join(' ');
    onSaveMacro(recordName.trim(), seqStr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
      <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl border border-current border-opacity-10 ${activeTheme.cardBg}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold flex items-center ${activeTheme.textMain}`}>
            <Circle className="w-5 h-5 mr-2.5 text-rose-500 fill-rose-500 animate-pulse" />
            Record Custom Combo / Macro
          </h3>
          <button onClick={onClose} className={`p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 ${activeTheme.textMuted}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className={`text-xs mb-6 ${activeTheme.textMuted}`}>
          Record live keyboard or controller button sequences (e.g. Stratagem codes, Street Fighter Hadoken, or Apex Slide-Jump).
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${activeTheme.textMuted}`}>
              Action / Skill Name
            </label>
            <input
              type="text"
              value={recordName}
              onChange={(e) => setRecordName(e.target.value)}
              placeholder="e.g. Eagle 500kg Strike, Hadoken, Fast Build Wall..."
              className={`w-full px-4 py-3 rounded-xl border bg-black/5 dark:bg-white/5 border-current border-opacity-20 focus:outline-none font-bold text-sm ${activeTheme.textMain}`}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`block text-xs font-bold uppercase tracking-wider ${activeTheme.textMuted}`}>
                Physical Inputs Stream
              </label>
              {isListening && (
                <button
                  onClick={() => setIsListening(false)}
                  className="text-xs font-bold text-rose-400 flex items-center bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20"
                >
                  <StopCircle className="w-3.5 h-3.5 mr-1" /> Stop Listening
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setIsListening(true);
                setRecordedKeys([]);
              }}
              className={`w-full flex flex-wrap items-center justify-center gap-2 p-6 border-2 border-dashed rounded-2xl transition-all font-mono text-sm font-bold min-h-[90px] ${
                isListening
                  ? 'border-rose-500 text-rose-400 bg-rose-500/10 ring-4 ring-rose-500/20'
                  : `border-current border-opacity-20 ${activeTheme.textMuted} hover:bg-black/5 dark:hover:bg-white/5`
              }`}
            >
              {recordedKeys.length > 0 ? (
                recordedKeys.map((k, i) => (
                  <kbd key={i} className={`px-2.5 py-1 text-xs rounded uppercase font-mono font-black ${activeTheme.keycap}`}>
                    {k}
                  </kbd>
                ))
              ) : isListening ? (
                'Listening... Press keys on your keyboard!'
              ) : (
                'Click here to start recording inputs'
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase border border-current border-opacity-20 ${activeTheme.textMuted}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!recordName.trim() || recordedKeys.length === 0}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase ${
              !recordName.trim() || recordedKeys.length === 0
                ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-400'
                : getButtonBgClass(activeTheme)
            }`}
          >
            Save Combo to {activeProfile.name}
          </button>
        </div>
      </div>
    </div>
  );
};
