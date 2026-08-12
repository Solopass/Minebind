import { useState, useMemo } from 'react';
import { GameProfile, ProPreset, ThemeConfig, InputPlatform } from '../types';
import { PRO_PRESETS } from '../data/proPresets';
import { 
  Trophy, Sparkles, Check, Copy, ArrowRight, ShieldCheck, 
  Gamepad2, Sliders, ExternalLink, RefreshCw, Zap, CheckCircle2 
} from 'lucide-react';

interface ProPresetsGalleryProps {
  profiles: GameProfile[];
  activeProfileId: string;
  activeTheme: ThemeConfig;
  platform: InputPlatform;
  getButtonBgClass: (theme: ThemeConfig) => string;
  onApplyProPreset: (preset: ProPreset) => void;
  appliedPresetId?: string | null;
}

export function ProPresetsGallery({
  profiles,
  activeProfileId,
  activeTheme,
  getButtonBgClass,
  onApplyProPreset,
  appliedPresetId
}: ProPresetsGalleryProps) {
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>(activeProfileId || 'all');
  const [comparingPreset, setComparingPreset] = useState<ProPreset | null>(null);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Filtered presets
  const filteredPresets = useMemo(() => {
    if (selectedGameFilter === 'all') return PRO_PRESETS;
    return PRO_PRESETS.filter(p => p.gameId === selectedGameFilter);
  }, [selectedGameFilter]);

  const activeGameProfile = useMemo(() => {
    return profiles.find(p => p.id === selectedGameFilter) || profiles.find(p => p.id === activeProfileId);
  }, [profiles, selectedGameFilter, activeProfileId]);

  const handleCopySettings = (presetId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(presetId);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Gallery Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border border-current border-opacity-10 shadow-2xl relative overflow-hidden ${activeTheme.cardBg}`}>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center`}>
              <Trophy className="w-3 h-3 mr-1" /> Pro Esports Presets
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Verified World Champions
            </span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-black ${activeTheme.textMain}`}>
            Esports Pro Keybindings & Settings
          </h1>

          <p className={`text-sm ${activeTheme.textMuted} leading-relaxed`}>
            Explore and apply competition-tested keybinds used by World Champions like Zen, TenZ, ImperialHal, Daigo, and Let Me Solo Her. Apply 1-click presets directly to your active controller layout.
          </p>
        </div>
      </div>

      {/* Game Filter Bar */}
      <div className={`p-4 rounded-2xl border border-current border-opacity-10 flex items-center justify-between gap-4 overflow-x-auto hide-scrollbar ${activeTheme.cardBg}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedGameFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedGameFilter === 'all'
                ? `${getButtonBgClass(activeTheme)} shadow-md`
                : `${activeTheme.textMuted} hover:${activeTheme.textMain} hover:bg-black/5 dark:hover:bg-white/5`
            }`}
          >
            All Esports Presets ({PRO_PRESETS.length})
          </button>

          {profiles.map(p => {
            const count = PRO_PRESETS.filter(pr => pr.gameId === p.id).length;
            if (count === 0) return null;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedGameFilter(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center ${
                  selectedGameFilter === p.id
                    ? `${getButtonBgClass(activeTheme)} shadow-md`
                    : `${activeTheme.textMuted} hover:${activeTheme.textMain} hover:bg-black/5 dark:hover:bg-white/5`
                }`}
              >
                {p.name}
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 dark:bg-white/20">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map(preset => {
          const isApplied = appliedPresetId === preset.id;

          return (
            <div
              key={preset.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden ${
                isApplied
                  ? `${activeTheme.cardBg} border-blue-500/60 ring-2 ring-blue-500/30`
                  : `${activeTheme.cardBg} border-current border-opacity-10 hover:border-opacity-30`
              }`}
            >
              {/* Top Banner */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {preset.gameName}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20 dark:bg-white/10 text-zinc-300">
                    {preset.platform}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`text-xl font-black ${activeTheme.textMain}`}>
                      {preset.proName}
                    </h3>
                    <p className="text-xs font-bold text-amber-400/90 mt-0.5">
                      {preset.team} • {preset.role}
                    </p>
                  </div>
                </div>

                <p className={`text-xs mt-3 leading-relaxed ${activeTheme.textMuted}`}>
                  {preset.description}
                </p>

                {/* Settings Note */}
                {preset.settingsNote && (
                  <div className="mt-4 p-3 rounded-xl bg-black/20 dark:bg-white/5 border border-current border-opacity-10 text-[11px] font-mono space-y-1">
                    <div className="flex items-center justify-between text-zinc-400 font-sans font-bold text-[10px] uppercase">
                      <span className="flex items-center"><Sliders className="w-3 h-3 mr-1 text-amber-400" /> Pro Settings</span>
                      <button
                        onClick={() => handleCopySettings(preset.id, preset.settingsNote!)}
                        className="hover:text-amber-300 flex items-center"
                      >
                        {copiedNoteId === preset.id ? (
                          <><Check className="w-3 h-3 mr-1 text-emerald-400" /> Copied</>
                        ) : (
                          <><Copy className="w-3 h-3 mr-1" /> Copy</>
                        )}
                      </button>
                    </div>
                    <p className="text-amber-200/90 leading-tight">
                      {preset.settingsNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Sample Bindings List Preview */}
              <div className="space-y-2 border-t border-current border-opacity-10 pt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                  Key Binds Highlight
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {Object.entries(preset.bindings).map(([itemId, rawBind]) => {
                    const bindVal = String(rawBind);
                    return (
                      <div key={itemId} className="flex items-center justify-between text-xs py-0.5 border-b border-current border-opacity-5">
                        <span className={`text-[11px] font-medium truncate max-w-[170px] ${activeTheme.textMuted}`}>
                          {bindVal.split('(')[1]?.replace(')', '') || bindVal}
                        </span>
                        <kbd className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase ${activeTheme.keycap}`}>
                          {bindVal.split('(')[0].trim()}
                        </kbd>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onApplyProPreset(preset)}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center shadow-lg transition-transform hover:scale-[1.02] ${
                    isApplied 
                      ? 'bg-emerald-500 text-black'
                      : getButtonBgClass(activeTheme)
                  }`}
                >
                  {isApplied ? (
                    <><Check className="w-4 h-4 mr-1.5" /> Preset Active</>
                  ) : (
                    <><Zap className="w-4 h-4 mr-1.5" /> Apply 1-Click Preset</>
                  )}
                </button>

                <button
                  onClick={() => setComparingPreset(preset)}
                  className={`px-3 py-2.5 rounded-xl border border-current border-opacity-20 text-xs font-black uppercase hover:bg-black/5 dark:hover:bg-white/5 ${activeTheme.textMain}`}
                  title="Compare Pro Binds vs Default"
                >
                  Compare
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Side-by-Side Compare Modal */}
      {comparingPreset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`max-w-2xl w-full rounded-3xl border border-current border-opacity-20 p-6 sm:p-8 shadow-2xl space-y-6 ${activeTheme.cardBg} max-h-[90vh] overflow-y-auto`}>
            
            <div className="flex items-start justify-between border-b border-current border-opacity-10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Esports Comparison
                </span>
                <h3 className={`text-2xl font-black ${activeTheme.textMain}`}>
                  {comparingPreset.proName} vs Standard Controls
                </h3>
                <p className={`text-xs ${activeTheme.textMuted} mt-0.5`}>
                  Game: {comparingPreset.gameName} ({comparingPreset.platform.toUpperCase()})
                </p>
              </div>

              <button
                onClick={() => setComparingPreset(null)}
                className="text-zinc-400 hover:text-white font-bold text-sm px-3 py-1 rounded-lg bg-black/20 dark:bg-white/10"
              >
                Close
              </button>
            </div>

            {/* Diff Table */}
            <div className="space-y-3">
              <div className="grid grid-cols-12 text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-current border-opacity-10 pb-2">
                <span className="col-span-5">Action</span>
                <span className="col-span-3">Default Key</span>
                <span className="col-span-4 text-amber-400">{comparingPreset.proName}'s Key</span>
              </div>

              {Object.entries(comparingPreset.bindings).map(([itemId, rawProBind]) => {
                const proBind = String(rawProBind);
                // Find item description in game profiles if possible
                let actionName = proBind.split('(')[1]?.replace(')', '') || 'Action';
                if (activeGameProfile) {
                  for (const cat of activeGameProfile.categories) {
                    const match = cat.items.find(i => i.id === itemId);
                    if (match) {
                      actionName = match.description;
                      break;
                    }
                  }
                }

                return (
                  <div key={itemId} className="grid grid-cols-12 items-center text-xs py-2 border-b border-current border-opacity-5">
                    <span className={`col-span-5 font-bold ${activeTheme.textMain}`}>
                      {actionName}
                    </span>
                    <span className="col-span-3 text-zinc-400 font-mono text-[11px]">
                      Default
                    </span>
                    <span className="col-span-4 font-mono font-black text-amber-400 text-xs">
                      {proBind.split('(')[0].trim()}
                    </span>
                  </div>
                );
              })}

            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-current border-opacity-10">
              <button
                onClick={() => {
                  onApplyProPreset(comparingPreset);
                  setComparingPreset(null);
                }}
                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase shadow-lg ${getButtonBgClass(activeTheme)}`}
              >
                Apply {comparingPreset.proName}'s Binds
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
