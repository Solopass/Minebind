import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GameProfile, InputPlatform, SrsCardData, UserStreak, ThemeConfig, GameGenre, CustomVariant, ProPreset } from './types';
import { INITIAL_GAME_PROFILES } from './data/gameProfiles';
import { calculateProfileCompletion } from './utils/completion';
import { ControlVisualizer } from './components/ControlVisualizer';
import { PracticeTrainer } from './components/PracticeTrainer';
import { DirectionsGuide } from './components/DirectionsGuide';
import { ProPresetsGallery } from './components/ProPresetsGallery';
import { RemapperModal } from './components/RemapperModal';
import { CheatSheetExporterModal } from './components/CheatSheetExporterModal';
import { CommunityShareModal } from './components/CommunityShareModal';
import { MuscleMemoryMatrix } from './components/MuscleMemoryMatrix';
import { SensitivityConverter } from './components/SensitivityConverter';
import { StreamerMiniDock } from './components/StreamerMiniDock';
import { StickerSheetGenerator } from './components/StickerSheetGenerator';
import { AIGenerator } from './components/AIGenerator';
import { MacroRecorderModal } from './components/MacroRecorderModal';
import { CommandPalette } from './components/CommandPalette';
import { SettingsPanel } from './components/SettingsPanel';
import { EditProfileModal } from './components/EditProfileModal';
import { 
  Gamepad2, BookOpen, BrainCircuit, Sparkles, Settings2, 
  Search, Plus, Share2, Edit3, Trash2, Check, Circle, 
  Printer, Monitor, MonitorCheck, Flame, AlertTriangle, 
  Folder, LayoutGrid, List, Layers, Volume2, VolumeX, ShieldAlert,
  ArrowRight, CheckCircle2, Compass, HelpCircle, ShieldCheck, PlayCircle, Info,
  Trophy, Sliders, Grid, Calculator, Scissors
} from 'lucide-react';


const BASE_THEMES: ThemeConfig[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Yellow & Neon',
    appBg: 'bg-zinc-950',
    navBg: 'bg-zinc-900/90 backdrop-blur-md border-b border-amber-500/20',
    textMain: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    accent: 'text-amber-400',
    cardBg: 'bg-zinc-900/60 shadow-2xl',
    cardHeaderBg: 'bg-zinc-800/60',
    keycap: 'bg-zinc-800 border border-amber-500/30 text-amber-300 shadow-[0_3px_0_0_rgba(245,158,11,0.2)] rounded-md font-bold',
    colorKey: 'amber'
  },
  {
    id: 'playstation',
    name: 'PlayStation Deep Blue',
    appBg: 'bg-slate-950',
    navBg: 'bg-slate-900/90 backdrop-blur-md border-b border-blue-500/20',
    textMain: 'text-slate-100',
    textMuted: 'text-slate-400',
    accent: 'text-blue-400',
    cardBg: 'bg-slate-900/60 shadow-xl',
    cardHeaderBg: 'bg-slate-800/60',
    keycap: 'bg-slate-800 border border-blue-500/40 text-blue-300 shadow-[0_3px_0_0_rgba(59,130,246,0.2)] rounded-md font-bold',
    colorKey: 'blue'
  },
  {
    id: 'xbox',
    name: 'Xbox Emerald Neon',
    appBg: 'bg-zinc-950',
    navBg: 'bg-zinc-900/90 backdrop-blur-md border-b border-emerald-500/20',
    textMain: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    accent: 'text-emerald-400',
    cardBg: 'bg-zinc-900/60 shadow-xl',
    cardHeaderBg: 'bg-zinc-800/60',
    keycap: 'bg-zinc-800 border border-emerald-500/40 text-emerald-300 shadow-[0_3px_0_0_rgba(16,185,129,0.2)] rounded-md font-bold',
    colorKey: 'emerald'
  },
  {
    id: 'clean-light',
    name: 'Esports Light Mode',
    appBg: 'bg-slate-50',
    navBg: 'bg-white/90 backdrop-blur-md border-b border-slate-200',
    textMain: 'text-slate-900',
    textMuted: 'text-slate-500',
    accent: 'text-indigo-600',
    cardBg: 'bg-white border border-slate-200 shadow-sm',
    cardHeaderBg: 'bg-slate-100/80',
    keycap: 'bg-white border border-slate-300 text-slate-800 shadow-[0_2px_0_0_rgba(203,213,225,1)] rounded-md font-bold',
    colorKey: 'indigo'
  }
];

const safeStorageGet = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeStorageSet = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

export default function App() {
  const [view, setView] = useState<'library' | 'visualizer' | 'matrix' | 'sensitivity' | 'stickers' | 'trainer' | 'directions' | 'esports' | 'ai' | 'settings'>('library');
  const [platform, setPlatform] = useState<InputPlatform>('pc');
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('gc_mute') === 'true');
  const [soundPack, setSoundPack] = useState(() => localStorage.getItem('gc_soundpack') || 'blue');
  const [appScale, setAppScale] = useState(() => localStorage.getItem('gc_scale') || 'text-base');

  const [themes] = useState<ThemeConfig[]>(BASE_THEMES);
  const [activeThemeIndex, setActiveThemeIndex] = useState(() => parseInt(localStorage.getItem('gc_theme_index') || '0', 10));
  const activeTheme = themes[activeThemeIndex] || themes[0];

  const [profiles, setProfiles] = useState<GameProfile[]>(() => safeStorageGet('gc_game_profiles', INITIAL_GAME_PROFILES));
  const [activeProfileId, setActiveProfileId] = useState<string>(() => localStorage.getItem('gc_active_profile') || INITIAL_GAME_PROFILES[0].id);

  const [customVariants, setCustomVariants] = useState<CustomVariant[]>(() => safeStorageGet('gc_custom_variants', []));
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  const activeProfile = useMemo(() => {
    return profiles.find(p => p.id === activeProfileId) || profiles[0] || INITIAL_GAME_PROFILES[0];
  }, [profiles, activeProfileId]);

  const activeVariant = useMemo(() => {
    return customVariants.find(v => v.id === activeVariantId && v.gameId === activeProfile.id) || null;
  }, [customVariants, activeVariantId, activeProfile]);

  const activeProfileCompletion = useMemo(() => {
    return calculateProfileCompletion(activeProfile);
  }, [activeProfile]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedKeyFilter, setSelectedKeyFilter] = useState<string | null>(null);

  const [srsData, setSrsData] = useState<Record<string, SrsCardData>>(() => safeStorageGet('gc_srs_data', {}));
  const [streakData, setStreakData] = useState<UserStreak>(() => safeStorageGet('gc_streak_data', { count: 1, lastDate: null }));

  const [showMacroModal, setShowMacroModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRemapperModal, setShowRemapperModal] = useState(false);
  const [showCheatSheetModal, setShowCheatSheetModal] = useState(false);
  const [showCommunityShareModal, setShowCommunityShareModal] = useState(false);
  const [showStreamerDock, setShowStreamerDock] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  // Handlers for Pro Presets and Custom Remapped Variants
  const handleApplyProPreset = (preset: ProPreset) => {
    const newVariant: CustomVariant = {
      id: `variant-pro-${preset.id}-${Date.now()}`,
      gameId: preset.gameId,
      name: `${preset.proName}'s Binds`,
      createdAt: Date.now(),
      platform: preset.platform,
      customBindings: preset.bindings
    };
    setCustomVariants(prev => [newVariant, ...prev]);
    setActiveVariantId(newVariant.id);
    setAppliedPresetId(preset.id);
    setActiveProfileId(preset.gameId);
    setPlatform(preset.platform);
    setToastMessage(`Applied ${preset.proName}'s 1-Click Preset!`);
  };

  const handleCreateVariant = (v: CustomVariant) => {
    setCustomVariants(prev => [v, ...prev]);
    setActiveVariantId(v.id);
    setToastMessage(`Saved layout "${v.name}"!`);
  };

  const handleUpdateVariant = (v: CustomVariant) => {
    setCustomVariants(prev => prev.map(item => item.id === v.id ? v : item));
    setToastMessage(`Updated layout "${v.name}"!`);
  };

  const handleDeleteVariant = (id: string) => {
    setCustomVariants(prev => prev.filter(v => v.id !== id));
    if (activeVariantId === id) setActiveVariantId(null);
    setToastMessage("Deleted custom layout variant.");
  };

  // Auto hide toast
  useEffect(() => {

    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Persist State
  useEffect(() => safeStorageSet('gc_game_profiles', profiles), [profiles]);
  useEffect(() => localStorage.setItem('gc_active_profile', activeProfileId), [activeProfileId]);
  useEffect(() => safeStorageSet('gc_custom_variants', customVariants), [customVariants]);
  useEffect(() => safeStorageSet('gc_srs_data', srsData), [srsData]);
  useEffect(() => safeStorageSet('gc_streak_data', streakData), [streakData]);
  useEffect(() => localStorage.setItem('gc_theme_index', activeThemeIndex.toString()), [activeThemeIndex]);

  useEffect(() => localStorage.setItem('gc_mute', isMuted.toString()), [isMuted]);
  useEffect(() => localStorage.setItem('gc_soundpack', soundPack), [soundPack]);
  useEffect(() => localStorage.setItem('gc_scale', appScale), [appScale]);

  // Global Keyboard Shortcuts (Cmd+K and Number Navigation)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Don't trigger when user is typing in form inputs
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
        return;
      }

      if (!e.ctrlKey && !e.altKey && !e.shiftKey && ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(e.key)) {
        const tabList: Array<'library' | 'visualizer' | 'matrix' | 'sensitivity' | 'stickers' | 'trainer' | 'directions' | 'esports' | 'ai' | 'settings'> = [
          'library', 'visualizer', 'matrix', 'sensitivity', 'stickers', 'trainer', 'directions', 'esports', 'ai', 'settings'
        ];
        const num = parseInt(e.key, 10);
        const idx = num === 0 ? 9 : num - 1;
        if (tabList[idx]) {
          setView(tabList[idx]);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const getButtonBgClass = useCallback((theme: ThemeConfig) => {
    if (theme.colorKey === 'amber') return 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20';
    if (theme.colorKey === 'blue') return 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20';
    if (theme.colorKey === 'emerald') return 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20';
    return 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20';
  }, []);

  // Filter Categories & Controls
  const filteredCategories = useMemo(() => {
    let cats = activeProfile.categories || [];
    if (!searchQuery.trim() && !selectedKeyFilter) return cats;

    return cats.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        const effectiveBind = activeVariant?.customBindings[item.id] || item.platformKeys?.[platform] || item.keys;
        const matchesQuery = !searchQuery.trim() || 
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          effectiveBind.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesKeyFilter = !selectedKeyFilter || 
          effectiveBind.toLowerCase().includes(selectedKeyFilter.toLowerCase());

        return matchesQuery && matchesKeyFilter;
      })
    })).filter(cat => cat.items.length > 0);
  }, [activeProfile, activeVariant, searchQuery, selectedKeyFilter, platform]);

  // Detect Conflicts
  const conflicts = useMemo(() => {
    const keyMap: Record<string, string[]> = {};
    activeProfile.categories.forEach(cat => {
      cat.items.forEach(item => {
        const bindText = activeVariant?.customBindings[item.id] || item.platformKeys?.[platform] || item.keys;
        const keyText = bindText.replace(/`/g, '').toLowerCase().trim();
        if (keyText) {
          if (!keyMap[keyText]) keyMap[keyText] = [];
          keyMap[keyText].push(item.description);
        }
      });
    });

    const found: Record<string, string[]> = {};
    Object.entries(keyMap).forEach(([k, list]) => {
      if (list.length > 1) {
        found[k] = Array.from(new Set(list));
      }
    });
    return found;
  }, [activeProfile, activeVariant, platform]);

  const handleUpdateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    setStreakData(prev => {
      if (prev.lastDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (prev.lastDate === yesterday) {
        return { count: prev.count + 1, lastDate: today };
      }
      return { count: 1, lastDate: today };
    });
  };

  const handleShareProfile = () => {
    setShowCommunityShareModal(true);
  };

  const handleImportProfile = (importedProfile: GameProfile) => {
    setProfiles(prev => {
      const exists = prev.some(p => p.id === importedProfile.id);
      if (exists) {
        return prev.map(p => p.id === importedProfile.id ? importedProfile : p);
      }
      return [importedProfile, ...prev];
    });
    setActiveProfileId(importedProfile.id);
    setToastMessage(`Imported profile "${importedProfile.name}"!`);
  };

  const handleImportVariant = (importedVariant: CustomVariant) => {
    setCustomVariants(prev => {
      const exists = prev.some(v => v.id === importedVariant.id);
      if (exists) {
        return prev.map(v => v.id === importedVariant.id ? importedVariant : v);
      }
      return [importedVariant, ...prev];
    });
    if (importedVariant.gameId) {
      setActiveProfileId(importedVariant.gameId);
    }
    setActiveVariantId(importedVariant.id);
    setToastMessage(`Imported remapped layout "${importedVariant.name}"!`);
  };

  const handleSaveEditedMarkdown = (updatedMd: string) => {
    // Basic Markdown parser to reconstruct categories
    const lines = updatedMd.split('\n');
    let appName = activeProfile.name;
    const categories: any[] = [];
    let currentCat: any = { name: 'General', items: [] };

    lines.forEach((line, idx) => {
      const clean = line.trim();
      if (clean.startsWith('# ')) {
        appName = clean.substring(2).trim();
      } else if (clean.startsWith('## ')) {
        if (currentCat.items.length > 0) categories.push(currentCat);
        currentCat = { name: clean.substring(3).trim(), items: [] };
      } else {
        const codeMatch = clean.match(/`([^`]+)`/);
        if (codeMatch) {
          const keys = codeMatch[1];
          let desc = clean.replace(codeMatch[0], '').trim();
          if (desc.startsWith('*') || desc.startsWith('-')) desc = desc.substring(1).trim();
          currentCat.items.push({
            id: `item-${idx}`,
            description: desc || 'Custom Control',
            keys: `\`${keys}\``
          });
        }
      }
    });
    if (currentCat.items.length > 0) categories.push(currentCat);

    setProfiles(prev => prev.map(p => p.id === activeProfile.id ? {
      ...p,
      name: appName,
      md: updatedMd,
      categories: categories.length > 0 ? categories : p.categories
    } : p));

    setShowEditModal(false);
    setToastMessage("Profile updated successfully!");
  };

  const handleSaveMacro = (name: string, seq: string) => {
    const newItem = {
      id: `macro-${Date.now()}`,
      description: name,
      keys: `\`${seq}\``,
      isCombo: true
    };

    setProfiles(prev => prev.map(p => {
      if (p.id !== activeProfile.id) return p;
      const cats = [...p.categories];
      const comboCat = cats.find(c => c.name.toLowerCase().includes('combo') || c.name.toLowerCase().includes('macro'));
      if (comboCat) {
        comboCat.items.push(newItem);
      } else {
        cats.push({ name: 'Custom Combos & Macros', items: [newItem] });
      }
      return { ...p, categories: cats };
    }));

    setToastMessage(`Saved macro combo "${name}"!`);
  };

  return (
    <div className={`min-h-screen ${activeTheme.appBg} ${activeTheme.textMain} ${appScale} transition-colors duration-300 pb-20`}>
      {/* Toast Notification */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className={`${getButtonBgClass(activeTheme)} px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider shadow-2xl flex items-center`}>
          <Check className="w-4 h-4 mr-2" />
          {toastMessage}
        </div>
      </div>

      {/* Main Top Navigation */}
      <nav className={`sticky top-0 z-50 px-4 py-3 border-b ${activeTheme.navBg}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Gamepad2 className={`w-6 h-6 ${activeTheme.accent}`} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight block leading-none">
                GameControl<span className={activeTheme.accent}>Master</span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${activeTheme.textMuted}`}>
                Gamer Control & Combo Academy
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-black/20 dark:bg-white/5 p-1 rounded-2xl border border-current border-opacity-10 overflow-x-auto hide-scrollbar max-w-full">
            {[
              { id: 'library', icon: BookOpen, label: 'Game Controls' },
              { id: 'visualizer', icon: Gamepad2, label: 'Layout Diagrams' },
              { id: 'matrix', icon: Grid, label: 'Muscle Matrix' },
              { id: 'sensitivity', icon: Calculator, label: 'Sens Converter' },
              { id: 'stickers', icon: Scissors, label: 'Sticker Sheets' },
              { id: 'trainer', icon: BrainCircuit, label: 'Combo Trainer' },
              { id: 'directions', icon: Compass, label: 'Directions' },
              { id: 'esports', icon: Trophy, label: 'Pro Presets' },
              { id: 'ai', icon: Sparkles, label: 'AI Generator' },
              { id: 'settings', icon: Settings2, label: 'Studio' }
            ].map((tab) => (

              <button
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`flex items-center px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  view === tab.id
                    ? `${activeTheme.cardBg} ${activeTheme.textMain} shadow-md border border-current border-opacity-20`
                    : `${activeTheme.textMuted} hover:${activeTheme.textMain}`
                }`}
              >
                <tab.icon className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Platform Switcher & Actions */}
          <div className="flex items-center space-x-2">
            {/* Streamer Mini-Dock Button */}
            <button
              onClick={() => setShowStreamerDock(true)}
              className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Open Streamer Dock (Second Screen Mode)"
            >
              <Monitor className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline">Streamer Dock</span>
            </button>
            {/* Input Layout Platform Selector */}
            <div className="flex bg-black/20 dark:bg-white/5 p-1 rounded-xl border border-current border-opacity-10 text-xs font-bold">
              {[
                { id: 'pc', label: 'PC K&M' },
                { id: 'playstation', label: 'PS5' },
                { id: 'xbox', label: 'Xbox' },
                { id: 'switch', label: 'Switch' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id as InputPlatform)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${platform === p.id ? `${activeTheme.accent} font-extrabold bg-black/30` : activeTheme.textMuted}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 ${activeTheme.textMuted}`}
              title="Toggle Audio Cues"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowCommandPalette(true)}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-current border-opacity-20 text-xs font-bold ${activeTheme.textMuted}`}
            >
              <kbd className="font-mono text-[10px]">⌘K</kbd> Search
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Game Library & Controls View */}
        {view === 'library' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Game Profile Selector Bar */}
            <div className={`p-3 rounded-2xl border border-current border-opacity-10 flex items-center justify-between gap-4 overflow-x-auto hide-scrollbar ${activeTheme.cardBg}`}>
              <div className="flex items-center gap-2">
                <Folder className={`w-5 h-5 ml-2 flex-shrink-0 ${activeTheme.accent}`} />
                {profiles.map(p => {
                  const pCompletion = calculateProfileCompletion(p);
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProfileId(p.id);
                        setSelectedKeyFilter(null);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center ${
                        activeProfile.id === p.id
                          ? `${getButtonBgClass(activeTheme)} shadow-md`
                          : `${activeTheme.textMuted} hover:${activeTheme.textMain} hover:bg-black/5 dark:hover:bg-white/5`
                      }`}
                    >
                      <span>{p.name}</span>
                      {pCompletion.is100Percent ? (
                        <CheckCircle2 className="w-3.5 h-3.5 ml-1.5 text-blue-400 fill-blue-500/20 flex-shrink-0" title="100% Complete & Verified" />
                      ) : (
                        <span className="ml-1.5 text-[10px] font-mono opacity-80 bg-black/20 dark:bg-white/20 px-1.5 py-0.2 rounded-full">
                          {pCompletion.percentage}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 border-l border-current border-opacity-10 pl-3">
                <button
                  onClick={() => setShowRemapperModal(true)}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20`}
                  title="Remap Keys & Custom Layouts"
                >
                  <Sliders className="w-3.5 h-3.5 mr-1" />
                  <span>Remap Keys</span>
                  {activeVariant && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-black">Active</span>
                  )}
                </button>

                <button
                  onClick={() => setShowCheatSheetModal(true)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center bg-black/10 dark:bg-white/10 hover:bg-black/20 ${activeTheme.textMain}`}
                  title="Print & Export Desk Cheat Sheet"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  <span>Cheat Sheet</span>
                </button>

                <button
                  onClick={() => setShowMacroModal(true)}
                  className={`p-2 rounded-xl transition-all ${activeTheme.textMuted} hover:text-rose-400 hover:bg-rose-500/10`}
                  title="Record Custom Combo / Macro"
                >
                  <Circle className="w-4 h-4 text-rose-500 fill-rose-500" />
                </button>
                <button
                  onClick={handleShareProfile}
                  className={`p-2 rounded-xl transition-all ${activeTheme.textMuted} hover:${activeTheme.textMain}`}
                  title="Share Profile Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className={`p-2 rounded-xl transition-all ${activeTheme.textMuted} hover:${activeTheme.textMain}`}
                  title="Edit Raw Markdown"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Profile Header & Controls Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-current border-opacity-20 ${activeTheme.textMuted}`}>
                    {activeProfile.genre}
                  </span>
                  {activeProfile.developer && (
                    <span className={`text-xs font-bold ${activeTheme.textMuted}`}>
                      by {activeProfile.developer}
                    </span>
                  )}

                  {/* Completion Status Badge */}
                  {activeProfileCompletion.is100Percent ? (
                    <div className="flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black shadow-sm" title="All controls, keybinds, and combos are fully complete">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-400 fill-blue-400/20" />
                      100% Complete & Verified
                    </div>
                  ) : (
                    <div className="flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                      {activeProfileCompletion.percentage}% Complete
                    </div>
                  )}
                </div>

                <h1 className={`text-3xl sm:text-4xl font-black mt-1 ${activeTheme.textMain}`}>
                  {activeProfile.name} Controls & Combos
                </h1>
              </div>

              {/* Search & Key Filter */}
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search actions or keys..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-black/5 dark:bg-white/5 border-current border-opacity-20 text-xs font-bold focus:outline-none ${activeTheme.textMain}`}
                  />
                  <Search className={`absolute left-3 top-3 w-3.5 h-3.5 ${activeTheme.textMuted}`} />
                </div>
              </div>
            </div>

            {/* Conflict Warnings */}
            {Object.keys(conflicts).length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                    Keybinding Conflict Warning ({platform.toUpperCase()} Layout)
                  </h4>
                  <div className="mt-1 text-xs text-amber-200/80 space-y-1">
                    {Object.entries(conflicts).map(([key, list]) => (
                      <p key={key}>
                        <strong className="text-amber-400">"{key.toUpperCase()}"</strong> is mapped to multiple actions: {(list as string[]).join(' AND ')}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Control Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.name}
                  className={`rounded-2xl border border-current border-opacity-10 overflow-hidden shadow-xl ${activeTheme.cardBg}`}
                >
                  <div className={`px-5 py-3.5 border-b border-current border-opacity-10 ${activeTheme.cardHeaderBg}`}>
                    <h3 className={`font-black text-xs uppercase tracking-widest ${activeTheme.accent}`}>
                      {category.name}
                    </h3>
                  </div>

                  <ul className="divide-y divide-current divide-opacity-5">
                    {category.items.map((item) => (
                      <li key={item.id} className="p-4 flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <div>
                          <span className={`font-bold text-sm block ${activeTheme.textMain}`}>
                            {item.description}
                          </span>
                          {item.notes && (
                            <span className="text-[11px] italic text-zinc-400 block mt-0.5">
                              {item.notes}
                            </span>
                          )}
                        </div>

                        <kbd className={`px-3 py-1.5 text-xs font-mono font-black tracking-wide rounded uppercase whitespace-nowrap shadow-sm ${
                          activeVariant?.customBindings[item.id] 
                            ? 'bg-amber-400 text-black border border-amber-500 shadow-md' 
                            : activeTheme.keycap
                        }`}>
                          {activeVariant?.customBindings[item.id] || item.platformKeys?.[platform] || item.keys}
                        </kbd>

                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Combos & Skill Sequences Section */}
            {activeProfile.combos && activeProfile.combos.length > 0 && (
              <div className={`p-6 rounded-3xl border border-current border-opacity-10 shadow-xl ${activeTheme.cardBg}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-black flex items-center ${activeTheme.textMain}`}>
                    <Sparkles className={`w-5 h-5 mr-2 ${activeTheme.accent}`} />
                    Iconic Combos & Chained Mechanics
                  </h3>

                  <button
                    onClick={() => setView('directions')}
                    className={`text-xs font-bold flex items-center text-amber-400 hover:underline`}
                  >
                    <Compass className="w-4 h-4 mr-1" /> View Execution Directions & Manual
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProfile.combos.map((combo, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-black/10 dark:bg-white/5 border border-current border-opacity-10 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`font-black text-sm block ${activeTheme.textMain}`}>
                            {combo.name}
                          </span>
                          {combo.difficulty && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {combo.difficulty}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400">
                          {combo.description}
                        </p>

                        {combo.timingNote && (
                          <p className="text-[11px] text-amber-200/80 mt-1 font-medium">
                            ⏱ {combo.timingNote}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-current border-opacity-10 flex flex-wrap items-center justify-between gap-2">
                        <kbd className={`px-3 py-1.5 text-xs font-mono font-black rounded uppercase inline-block ${activeTheme.keycap}`}>
                          {combo.platformSequences?.[platform] || combo.sequence}
                        </kbd>

                        <button
                          onClick={() => setView('directions')}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center"
                        >
                          How to do this <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Directions & Instructions View */}
        {view === 'directions' && (
          <DirectionsGuide
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectGameProfile={(id) => {
              setActiveProfileId(id);
              setView('library');
            }}
            platform={platform}
            activeTheme={activeTheme}
            getButtonBgClass={getButtonBgClass}
            onLaunchTrainerForCombo={(gameId) => {
              setActiveProfileId(gameId);
              setView('trainer');
            }}
          />
        )}

        {/* Esports Pro Presets View */}
        {view === 'esports' && (
          <ProPresetsGallery
            profiles={profiles}
            activeProfileId={activeProfileId}
            activeTheme={activeTheme}
            platform={platform}
            getButtonBgClass={getButtonBgClass}
            onApplyProPreset={handleApplyProPreset}
            appliedPresetId={appliedPresetId}
          />
        )}

        {/* Visualizer View */}
        {view === 'visualizer' && (

          <ControlVisualizer
            platform={platform}
            categories={activeProfile.categories}
            activeTheme={activeTheme}
            selectedKeyFilter={selectedKeyFilter}
            onSelectKeyFilter={(k) => setSelectedKeyFilter(k)}
          />
        )}

        {/* Sensitivity & eDPI Converter View */}
        {view === 'sensitivity' && (
          <SensitivityConverter
            activeTheme={activeTheme}
            getButtonBgClass={getButtonBgClass}
          />
        )}

        {/* Keycap & Fightstick Sticker Sheet Generator View */}
        {view === 'stickers' && (
          <StickerSheetGenerator
            activeProfile={activeProfile}
            activeVariant={activeVariant}
            platform={platform}
            activeTheme={activeTheme}
            getButtonBgClass={getButtonBgClass}
          />
        )}

        {/* Cross-Game Muscle Memory Matrix View */}
        {view === 'matrix' && (
          <MuscleMemoryMatrix
            profiles={profiles}
            platform={platform}
            activeTheme={activeTheme}
            customVariants={customVariants}
            getButtonBgClass={getButtonBgClass}
            onOpenRemapper={(game) => {
              setActiveProfileId(game.id);
              setShowRemapperModal(true);
            }}
          />
        )}

        {/* Trainer View */}
        {view === 'trainer' && (
          <PracticeTrainer
            activeProfile={activeProfile}
            platform={platform}
            srsData={srsData}
            onUpdateSrs={(cardId, updated) => setSrsData(prev => ({ ...prev, [cardId]: updated }))}
            streakData={streakData}
            onUpdateStreak={handleUpdateStreak}
            activeTheme={activeTheme}
            isMuted={isMuted}
            getButtonBgClass={getButtonBgClass}
          />
        )}

        {/* AI Generator View */}
        {view === 'ai' && (
          <AIGenerator
            onAddProfile={(p) => {
              setProfiles(prev => [...prev, p]);
              setActiveProfileId(p.id);
              setView('library');
            }}
            activeTheme={activeTheme}
            getButtonBgClass={getButtonBgClass}
            onSetToast={(msg) => setToastMessage(msg)}
          />
        )}

        {/* Settings View */}
        {view === 'settings' && (
          <SettingsPanel
            themes={themes}
            activeThemeIndex={activeThemeIndex}
            onSelectTheme={(i) => setActiveThemeIndex(i)}
            soundPack={soundPack}
            onSelectSoundPack={(sp) => setSoundPack(sp)}
            appFont="font-sans"
            onSelectFont={() => {}}
            appScale={appScale}
            onSelectScale={(s) => setAppScale(s)}
            activeTheme={activeTheme}
            onExportData={() => {
              const exportBlob = new Blob([JSON.stringify({ 
                profiles, 
                customVariants, 
                srsData, 
                streakData,
                activeThemeIndex,
                soundPack,
                appScale
              }, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(exportBlob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `gamecontrol_backup_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setToastMessage("Exported complete system backup JSON!");
            }}
            onImportData={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (evt) => {
                try {
                  const data = JSON.parse(evt.target?.result as string);
                  if (data.profiles && Array.isArray(data.profiles)) {
                    setProfiles(data.profiles);
                  }
                  if (data.customVariants && Array.isArray(data.customVariants)) {
                    setCustomVariants(data.customVariants);
                  }
                  if (data.srsData) setSrsData(data.srsData);
                  if (data.streakData) setStreakData(data.streakData);
                  if (typeof data.activeThemeIndex === 'number') setActiveThemeIndex(data.activeThemeIndex);
                  if (data.soundPack) setSoundPack(data.soundPack);
                  if (data.appScale) setAppScale(data.appScale);

                  setToastMessage("Successfully imported full system backup!");
                } catch (err) {
                  setToastMessage("Invalid backup JSON format.");
                }
              };
              reader.readAsText(file);
            }}
            streakData={streakData}
            getButtonBgClass={getButtonBgClass}
          />
        )}
      </main>

      {/* Modals */}
      {showMacroModal && (
        <MacroRecorderModal
          activeProfile={activeProfile}
          onSaveMacro={handleSaveMacro}
          onClose={() => setShowMacroModal(false)}
          activeTheme={activeTheme}
          getButtonBgClass={getButtonBgClass}
        />
      )}

      {showEditModal && (
        <EditProfileModal
          activeProfile={activeProfile}
          onSave={handleSaveEditedMarkdown}
          onClose={() => setShowEditModal(false)}
          activeTheme={activeTheme}
          getButtonBgClass={getButtonBgClass}
        />
      )}

      {showCommandPalette && (
        <CommandPalette
          profiles={profiles}
          onSelectResult={(profileId, search) => {
            setActiveProfileId(profileId);
            setSearchQuery(search);
            setView('library');
          }}
          onClose={() => setShowCommandPalette(false)}
          activeTheme={activeTheme}
        />
      )}

      {showRemapperModal && (
        <RemapperModal
          gameProfile={activeProfile}
          platform={platform}
          activeTheme={activeTheme}
          customVariants={customVariants.filter(v => v.gameId === activeProfile.id)}
          activeVariantId={activeVariantId}
          onSelectVariant={(vId) => setActiveVariantId(vId)}
          onCreateVariant={handleCreateVariant}
          onUpdateVariant={handleUpdateVariant}
          onDeleteVariant={handleDeleteVariant}
          onClose={() => setShowRemapperModal(false)}
          getButtonBgClass={getButtonBgClass}
        />
      )}

      {showCheatSheetModal && (
        <CheatSheetExporterModal
          gameProfile={activeProfile}
          platform={platform}
          activeTheme={activeTheme}
          activeVariant={activeVariant}
          onClose={() => setShowCheatSheetModal(false)}
          getButtonBgClass={getButtonBgClass}
        />
      )}

      {showCommunityShareModal && (
        <CommunityShareModal
          activeProfile={activeProfile}
          activeVariant={activeVariant}
          activeTheme={activeTheme}
          onImportProfile={handleImportProfile}
          onImportVariant={handleImportVariant}
          onClose={() => setShowCommunityShareModal(false)}
          getButtonBgClass={getButtonBgClass}
        />
      )}

      {showStreamerDock && (
        <StreamerMiniDock
          profiles={profiles}
          activeProfile={activeProfile}
          activeVariant={activeVariant}
          platform={platform}
          activeTheme={activeTheme}
          onSelectProfile={(id) => setActiveProfileId(id)}
          onSelectPlatform={(p) => setPlatform(p)}
          onClose={() => setShowStreamerDock(false)}
          getButtonBgClass={getButtonBgClass}
        />
      )}

    </div>
  );
}
