import React, { useState, useEffect, useRef } from 'react';
import { GameProfile, ThemeConfig } from '../types';
import { Search, Gamepad2, X } from 'lucide-react';

interface CommandPaletteProps {
  profiles: GameProfile[];
  onSelectResult: (profileId: string, searchQuery: string) => void;
  onClose: () => void;
  activeTheme: ThemeConfig;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  profiles,
  onSelectResult,
  onClose,
  activeTheme
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results = profiles.flatMap(p => {
    const matched: { profileId: string; profileName: string; category: string; description: string; keys: string }[] = [];
    if (!query.trim()) return matched;

    const q = query.toLowerCase();
    p.categories.forEach(cat => {
      cat.items.forEach(item => {
        if (
          item.description.toLowerCase().includes(q) ||
          item.keys.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q)
        ) {
          matched.push({
            profileId: p.id,
            profileName: p.name,
            category: cat.name,
            description: item.description,
            keys: item.keys
          });
        }
      });
    });
    return matched;
  }).slice(0, 10);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-20 sm:pt-28 bg-black/60 backdrop-blur-sm animate-in fade-in p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl shadow-2xl border border-current border-opacity-20 overflow-hidden flex flex-col ${activeTheme.cardBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-5 py-4 border-b border-current border-opacity-10 bg-black/10 dark:bg-white/5">
          <Search className={`w-5 h-5 mr-3 ${activeTheme.textMuted}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all game controls & combos... (e.g. 'Parry', 'Sprint', 'Stratagem', 'Hadoken')"
            className={`flex-1 bg-transparent border-none focus:outline-none text-base font-bold ${activeTheme.textMain}`}
          />
          <kbd className={`text-xs px-2 py-1 rounded border border-current border-opacity-20 font-mono ${activeTheme.textMuted}`}>
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className={`p-8 text-center text-xs font-semibold uppercase tracking-wider ${activeTheme.textMuted}`}>
              Type to search game controls across all profiles...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((res, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectResult(res.profileId, res.description);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 text-left transition-colors"
                >
                  <div>
                    <span className={`font-bold text-sm block ${activeTheme.textMain}`}>
                      {res.description}
                    </span>
                    <span className={`text-xs font-semibold flex items-center mt-0.5 ${activeTheme.textMuted}`}>
                      <Gamepad2 className="w-3.5 h-3.5 mr-1.5 opacity-60 text-indigo-400" />
                      {res.profileName} <span className="mx-1.5 opacity-30">•</span> {res.category}
                    </span>
                  </div>
                  <kbd className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${activeTheme.keycap}`}>
                    {res.keys}
                  </kbd>
                </button>
              ))}
            </div>
          ) : (
            <div className={`p-8 text-center text-xs font-semibold uppercase tracking-wider ${activeTheme.textMuted}`}>
              No controls matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
