import { useState, useMemo } from 'react';
import { GameProfile, InputPlatform, ThemeConfig, CustomVariant } from '../types';
import { 
  Grid, AlertTriangle, CheckCircle2, Sliders, Shield, Sparkles, 
  Layers, ArrowRight, Zap, RefreshCw, Copy, Check 
} from 'lucide-react';

interface MuscleMemoryMatrixProps {
  profiles: GameProfile[];
  platform: InputPlatform;
  activeTheme: ThemeConfig;
  customVariants: CustomVariant[];
  getButtonBgClass: (theme: ThemeConfig) => string;
  onOpenRemapper?: (gameProfile: GameProfile) => void;
}

// Universal Control Intents for cross-game comparison
const UNIVERSAL_ACTIONS: Array<{
  id: string;
  label: string;
  category: string;
  description: string;
  // Regex keywords to fuzzy match controls in different games
  keywords: string[];
}> = [
  {
    id: 'move-forward',
    label: 'Move Forward',
    category: 'Movement',
    description: 'Basic forward locomotion',
    keywords: ['forward', 'move', 'accelerate', 'drive']
  },
  {
    id: 'jump',
    label: 'Jump / Dodge',
    category: 'Movement',
    description: 'Vertical leap or evasion dodge roll',
    keywords: ['jump', 'dodge', 'vault', 'roll', 'evade']
  },
  {
    id: 'crouch',
    label: 'Crouch / Slide',
    category: 'Movement',
    description: 'Stance drop or high-speed slide',
    keywords: ['crouch', 'slide', 'duck', 'brake']
  },
  {
    id: 'sprint',
    label: 'Sprint / Boost',
    category: 'Locomotion',
    description: 'High-speed movement or turbo burst',
    keywords: ['sprint', 'run', 'boost', 'dash']
  },
  {
    id: 'primary-fire',
    label: 'Primary Attack / Fire',
    category: 'Combat',
    description: 'Primary weapon discharge or light strike',
    keywords: ['fire', 'attack', 'light attack', 'shoot', 'primary', 'punch']
  },
  {
    id: 'aim-down-sights',
    label: 'Aim / Guard / Heavy',
    category: 'Combat',
    description: 'Precision ADS, shield guard, or heavy hit',
    keywords: ['aim', 'ads', 'zoom', 'guard', 'block', 'heavy attack', 'parry', 'kick']
  },
  {
    id: 'reload-interact',
    label: 'Reload / Interact / Use',
    category: 'Actions',
    description: 'Weapon magazine reload or world interaction',
    keywords: ['reload', 'interact', 'use', 'pickup', 'revive']
  },
  {
    id: 'melee-tactical',
    label: 'Melee / Tactical Ability',
    category: 'Abilities',
    description: 'Close-quarters strike or basic utility',
    keywords: ['melee', 'ability 1', 'tactical', 'skill', 'ashes of war', 'drive impact']
  },
  {
    id: 'ultimate-super',
    label: 'Ultimate / Signature',
    category: 'Abilities',
    description: 'High-impact ultimate or signature power',
    keywords: ['ultimate', 'super', 'signature', 'special', 'drive parry']
  },
  {
    id: 'ping-map',
    label: 'Ping / Map / Scoreboard',
    category: 'Utility',
    description: 'Tactical ping marker, map toggle, or scoreboard',
    keywords: ['ping', 'map', 'scoreboard', 'comm', 'wheel']
  }
];

export function MuscleMemoryMatrix({
  profiles,
  platform,
  activeTheme,
  customVariants,
  getButtonBgClass,
  onOpenRemapper
}: MuscleMemoryMatrixProps) {
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>(() => 
    profiles.slice(0, 4).map(p => p.id)
  );

  const selectedProfiles = useMemo(() => {
    return profiles.filter(p => selectedGameIds.includes(p.id));
  }, [profiles, selectedGameIds]);

  const toggleGameSelection = (gameId: string) => {
    setSelectedGameIds(prev => {
      if (prev.includes(gameId)) {
        if (prev.length <= 2) return prev; // Keep at least 2 games
        return prev.filter(id => id !== gameId);
      } else {
        if (prev.length >= 6) return prev; // Limit to 6 for readable grid
        return [...prev, gameId];
      }
    });
  };

  // Helper to extract the binding for a universal action in a specific game
  const getBindingForAction = (game: GameProfile, universalAction: typeof UNIVERSAL_ACTIONS[0]) => {
    // Check if game has an active custom variant
    const customVar = customVariants.find(v => v.gameId === game.id && v.platform === platform);

    const allItems = game.categories.flatMap(c => c.items);
    
    // Fuzzy match item description against keywords
    let matchedItem = allItems.find(item => {
      const descLower = item.description.toLowerCase();
      return universalAction.keywords.some(kw => descLower.includes(kw));
    });

    if (!matchedItem) return null;

    let bindVal = matchedItem.platformKeys?.[platform] || matchedItem.keys;
    if (customVar && customVar.customBindings[matchedItem.id]) {
      bindVal = customVar.customBindings[matchedItem.id];
    }

    return {
      itemId: matchedItem.id,
      itemDescription: matchedItem.description,
      bind: bindVal,
      isCustomized: Boolean(customVar && customVar.customBindings[matchedItem.id])
    };
  };

  // Detect cross-game inconsistencies
  const matrixAnalysis = useMemo(() => {
    const conflicts: Array<{ actionLabel: string; details: string }> = [];

    UNIVERSAL_ACTIONS.forEach(action => {
      const binds = selectedProfiles.map(game => {
        const res = getBindingForAction(game, action);
        return res ? res.bind.split('(')[0].trim().toUpperCase() : null;
      }).filter(Boolean);

      const uniqueBinds = new Set(binds);
      if (uniqueBinds.size > 1) {
        conflicts.push({
          actionLabel: action.label,
          details: `Bound differently across your selected games (${Array.from(uniqueBinds).join(' vs ')})`
        });
      }
    });

    return conflicts;
  }, [selectedProfiles, customVariants, platform]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border border-current border-opacity-10 shadow-2xl relative overflow-hidden ${activeTheme.cardBg}`}>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center">
              <Grid className="w-3 h-3 mr-1" /> Muscle Memory Alignment
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" /> {matrixAnalysis.length} Inconsistencies Detected
            </span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-black ${activeTheme.textMain}`}>
            Cross-Game Control Alignment Matrix
          </h1>

          <p className={`text-sm ${activeTheme.textMuted} leading-relaxed`}>
            Standardize your muscle memory across multiple titles (*Valorant, Apex Legends, Rocket League, Elden Ring, Street Fighter 6*). Identify conflicting keybindings and streamline your reflex motor skills across games.
          </p>
        </div>
      </div>

      {/* Game Selector Chips */}
      <div className={`p-4 rounded-2xl border border-current border-opacity-10 space-y-3 ${activeTheme.cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
            Compare Titles ({selectedGameIds.length}/6 active):
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">
            Platform: {platform.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {profiles.map(game => {
            const isSelected = selectedGameIds.includes(game.id);
            return (
              <button
                key={game.id}
                onClick={() => toggleGameSelection(game.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? `${getButtonBgClass(activeTheme)} shadow-md`
                    : `bg-black/10 dark:bg-white/5 border border-current border-opacity-10 text-zinc-400 hover:text-white`
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" />}
                <span>{game.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inconsistency Alert Box */}
      {matrixAnalysis.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <h4 className="font-bold text-xs uppercase tracking-wider">
              Muscle Memory Mismatch Alert
            </h4>
          </div>
          <p className="text-xs opacity-90 leading-relaxed">
            You have keybinding mismatches in {matrixAnalysis.length} common action types across your selected titles. Unified keybindings improve reaction times and prevent misinputs when switching between games.
          </p>
        </div>
      )}

      {/* Matrix Comparison Table */}
      <div className={`p-6 rounded-3xl border border-current border-opacity-10 shadow-2xl overflow-x-auto ${activeTheme.cardBg}`}>
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-current border-opacity-10 text-xs font-black uppercase tracking-wider text-zinc-400">
              <th className="py-3 px-4 w-1/4">Action / Intent</th>
              {selectedProfiles.map(game => (
                <th key={game.id} className="py-3 px-4 text-center">
                  <div className="font-black text-amber-400 text-sm">{game.name}</div>
                  <div className="text-[10px] font-normal text-zinc-400 uppercase">{game.genre}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-current divide-opacity-5 text-xs">
            {UNIVERSAL_ACTIONS.map(action => {
              // Extract bindings for each selected profile
              const gameBinds = selectedProfiles.map(game => ({
                game,
                res: getBindingForAction(game, action)
              }));

              // Check if there is a mismatch across available binds
              const bindValues = gameBinds
                .map(gb => gb.res ? gb.res.bind.split('(')[0].trim().toUpperCase() : null)
                .filter(Boolean);

              const hasMismatch = new Set(bindValues).size > 1;

              return (
                <tr 
                  key={action.id}
                  className={`transition-colors ${
                    hasMismatch ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {/* Action Name Column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      {hasMismatch ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400" title="Mismatch detected" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" title="Consistent" />
                      )}
                      <span className={`font-bold ${activeTheme.textMain}`}>
                        {action.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {action.description}
                    </span>
                  </td>

                  {/* Game Columns */}
                  {gameBinds.map(({ game, res }) => (
                    <td key={game.id} className="py-3.5 px-4 text-center">
                      {res ? (
                        <div className="inline-flex flex-col items-center">
                          <kbd className={`px-2.5 py-1 text-xs font-mono font-black rounded uppercase shadow-sm ${
                            res.isCustomized 
                              ? 'bg-amber-400 text-black border border-amber-500' 
                              : activeTheme.keycap
                          }`}>
                            {res.bind.split('(')[0].trim()}
                          </kbd>

                          <span className="text-[9px] text-zinc-400 font-mono mt-1 max-w-[120px] truncate" title={res.itemDescription}>
                            {res.itemDescription}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-500 italic font-mono">
                          N/A
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
