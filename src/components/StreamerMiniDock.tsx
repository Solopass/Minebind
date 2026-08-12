import React, { useState } from 'react';
import { GameProfile, InputPlatform, ThemeConfig, CustomVariant } from '../types';
import { 
  Monitor, Search, Gamepad2, X, Maximize2, Pin, Sparkles, 
  Layers, Zap, Flame, Shield, ChevronRight
} from 'lucide-react';

interface StreamerMiniDockProps {
  profiles: GameProfile[];
  activeProfile: GameProfile;
  activeVariant: CustomVariant | null;
  platform: InputPlatform;
  activeTheme: ThemeConfig;
  onSelectProfile: (id: string) => void;
  onSelectPlatform: (platform: InputPlatform) => void;
  onClose: () => void;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

export const StreamerMiniDock: React.FC<StreamerMiniDockProps> = ({
  profiles,
  activeProfile,
  activeVariant,
  platform,
  activeTheme,
  onSelectProfile,
  onSelectPlatform,
  onClose,
  getButtonBgClass
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedCategory, setPinnedCategory] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Filter items by query
  const allItems = activeProfile.categories.flatMap(cat => 
    cat.items.map(item => ({
      ...item,
      categoryName: cat.name
    }))
  );

  const filteredItems = allItems.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const bindingVal = activeVariant?.customBindings[item.id] || item.platformKeys?.[platform] || item.keys;
    return (
      item.description.toLowerCase().includes(q) ||
      bindingVal.toLowerCase().includes(q) ||
      item.categoryName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-xl rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col h-[85vh] ${activeTheme.cardBg}`}>
        
        {/* Streamer Mini Dock Top Header Bar */}
        <div className="p-4 bg-black/60 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Monitor className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Streamer Mini-Dock
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded uppercase">
                  Second Screen Mode
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate max-w-[220px]">
                {activeProfile.name} • {platform.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
              title="Close Streamer Dock"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Game & Platform Selector Controls */}
        <div className="p-3 bg-black/40 border-b border-current border-opacity-10 space-y-2">
          <div className="flex gap-2">
            {/* Game Picker Select */}
            <select
              value={activeProfile.id}
              onChange={(e) => onSelectProfile(e.target.value)}
              className="flex-1 p-2 rounded-xl bg-zinc-900 border border-current border-opacity-20 text-xs font-bold text-amber-300 outline-none"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.categories.length} Cats)
                </option>
              ))}
            </select>

            {/* Platform Buttons */}
            <div className="flex gap-1 p-1 bg-black/40 rounded-xl border border-current border-opacity-10">
              {(['pc', 'xbox', 'playstation', 'switch'] as InputPlatform[]).map(p => (
                <button
                  key={p}
                  onClick={() => onSelectPlatform(p)}
                  className={`px-2 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                    platform === p
                      ? 'bg-amber-400 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {p === 'playstation' ? 'PS' : p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search Field */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter control bindings... (e.g. Crouch, Roll, Jump, Super)"
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/50 border border-current border-opacity-20 text-xs font-mono text-white placeholder-zinc-500 outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Compact Keybindings Grid Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          
          {/* Active Variant Highlight Banner if remapped */}
          {activeVariant && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center justify-between font-mono">
              <span>Remapped Layout: <strong>{activeVariant.name}</strong></span>
              <span className="text-[9px] bg-amber-400 text-black font-bold px-1.5 py-0.5 rounded">Active</span>
            </div>
          )}

          {/* Keybinding Items */}
          <div className="grid grid-cols-1 gap-2">
            {filteredItems.map((item) => {
              const bindVal = activeVariant?.customBindings[item.id] || item.platformKeys?.[platform] || item.keys;
              const isRemapped = Boolean(activeVariant?.customBindings[item.id]);

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isRemapped
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-black/30 border-current border-opacity-10 hover:border-opacity-20'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 block truncate">
                      {item.categoryName}
                    </span>
                    <span className="text-xs font-bold text-white block truncate">
                      {item.description}
                    </span>
                  </div>

                  {/* High Contrast Keycap Badge */}
                  <kbd className={`px-3 py-1.5 text-xs font-mono font-black rounded-xl uppercase shadow-md flex-shrink-0 whitespace-nowrap ${
                    isRemapped
                      ? 'bg-amber-400 text-black border border-amber-500'
                      : activeTheme.keycap
                  }`}>
                    {bindVal}
                  </kbd>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-8 text-center text-xs text-zinc-500">
                No matching controls found for "{searchQuery}".
              </div>
            )}
          </div>

          {/* Combos Quick Bar */}
          {activeProfile.combos && activeProfile.combos.length > 0 && (
            <div className="pt-3 border-t border-current border-opacity-10 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center">
                <Flame className="w-3 h-3 mr-1" /> Key Mechanic Combos
              </div>
              <div className="space-y-1.5">
                {activeProfile.combos.map(c => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-black/40 border border-current border-opacity-10 flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200">{c.name}</span>
                    <div className="flex gap-1">
                      {c.sequence.map((k, idx) => (
                        <kbd key={idx} className="px-1.5 py-0.5 text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
