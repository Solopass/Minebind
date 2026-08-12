import React, { useState } from 'react';
import { GameProfile, CustomVariant, ThemeConfig } from '../types';
import { Share2, Copy, Check, Upload, Download, Sparkles, Shield, UserCheck, Code, BookOpen, AlertCircle } from 'lucide-react';

interface CommunityShareModalProps {
  activeProfile: GameProfile;
  activeVariant: CustomVariant | null;
  activeTheme: ThemeConfig;
  onImportProfile: (profile: GameProfile) => void;
  onImportVariant: (variant: CustomVariant) => void;
  onClose: () => void;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

// Sample Curated Community Presets
const COMMUNITY_PRESETS: Array<{
  id: string;
  title: string;
  author: string;
  gameName: string;
  gameId: string;
  description: string;
  tags: string[];
  payload: any;
}> = [
  {
    id: 'comm-1',
    title: 'Steam Deck Handheld Paddles',
    author: '@HandheldGamer',
    gameName: 'Elden Ring',
    gameId: 'elden-ring',
    description: 'Optimized for back paddles on handheld PC consoles. Jump and Dodge mapped to L4/R4 paddles.',
    tags: ['Steam Deck', 'Handheld', 'Comfort'],
    payload: {
      type: 'variant',
      variant: {
        id: 'var-steamdeck-elden',
        gameId: 'elden-ring',
        name: 'Steam Deck Paddle Layout',
        createdAt: Date.now(),
        platform: 'pc',
        customBindings: {
          'er-1': 'Space / L4 Paddle (Dodge Roll)',
          'er-2': 'F / R4 Paddle (Jump)',
          'er-3': 'E / L5 Paddle (Interact)'
        }
      }
    }
  },
  {
    id: 'comm-2',
    title: 'Fighter Hitbox Keyboard Ergonomics',
    author: '@ArcadePro_Max',
    gameName: 'Street Fighter 6',
    gameId: 'sf6',
    description: 'SOCD-cleaned keyboard binding mimicking a leverless arcade controller layout (ASD + Space for Jump).',
    tags: ['Hitbox', 'Leverless', 'SF6'],
    payload: {
      type: 'variant',
      variant: {
        id: 'var-hitbox-sf6',
        gameId: 'sf6',
        name: 'Hitbox Keyboard SOCD Layout',
        createdAt: Date.now(),
        platform: 'pc',
        customBindings: {
          'sf-1': 'A (Left)',
          'sf-2': 'S (Down)',
          'sf-3': 'D (Right)',
          'sf-4': 'Spacebar (Up / Jump)',
          'sf-5': 'U / J / M (Punches)',
          'sf-6': 'I / K / , (Kicks)'
        }
      }
    }
  },
  {
    id: 'comm-3',
    title: 'Southpaw FPS Leftie Setup',
    author: '@LeftyGamer_99',
    gameName: 'Valorant',
    gameId: 'valorant',
    description: 'Fully remapped right-hand keypad (IJKL) layout for left-handed mouse players.',
    tags: ['Southpaw', 'Leftie', 'FPS'],
    payload: {
      type: 'variant',
      variant: {
        id: 'var-southpaw-val',
        gameId: 'valorant',
        name: 'IJKL Southpaw FPS Layout',
        createdAt: Date.now(),
        platform: 'pc',
        customBindings: {
          'val-1': 'I / K / J / L (Movement)',
          'val-2': 'U (Primary Ability)',
          'val-3': 'O (Secondary Ability)',
          'val-4': 'H (Crouch)',
          'val-5': 'Semikolon (Jump)'
        }
      }
    }
  },
  {
    id: 'comm-4',
    title: 'Thumb-Button Speed-Reset Layout',
    author: '@RL_Freestyler',
    gameName: 'Rocket League',
    gameId: 'rocket-league',
    description: 'Binds Air Roll Left & Right to mouse side thumb buttons for instant speedflips and directional air rolls.',
    tags: ['Freestyle', 'Air Roll', 'Rocket League'],
    payload: {
      type: 'variant',
      variant: {
        id: 'var-rl-thumb',
        gameId: 'rocket-league',
        name: 'Mouse Thumb Air Roll Setup',
        createdAt: Date.now(),
        platform: 'pc',
        customBindings: {
          'rl-4': 'Mouse4 (Air Roll Left)',
          'rl-5': 'Mouse5 (Air Roll Right)',
          'rl-1': 'Shift / L1 (Powerslide)'
        }
      }
    }
  }
];

export const CommunityShareModal: React.FC<CommunityShareModalProps> = ({
  activeProfile,
  activeVariant,
  activeTheme,
  onImportProfile,
  onImportVariant,
  onClose,
  getButtonBgClass
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'community'>('export');
  const [shareType, setShareType] = useState<'profile' | 'variant'>('profile');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Generate Base64 share code
  const getGeneratedShareData = () => {
    let payload: any = {};
    if (shareType === 'variant' && activeVariant) {
      payload = {
        type: 'variant',
        variant: activeVariant,
        created: Date.now(),
        version: '1.0'
      };
    } else {
      payload = {
        type: 'profile',
        profile: activeProfile,
        created: Date.now(),
        version: '1.0'
      };
    }

    const jsonStr = JSON.stringify(payload);
    try {
      const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
      return {
        code: `GC-${payload.type.toUpperCase()}-${b64.substring(0, 16)}...`,
        fullCode: `GC-${b64}`,
        jsonStr
      };
    } catch {
      return {
        code: 'GC-ERROR',
        fullCode: jsonStr,
        jsonStr
      };
    }
  };

  const shareData = getGeneratedShareData();

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessImport = () => {
    setImportStatus(null);
    if (!inputCode.trim()) {
      setImportStatus({ type: 'error', msg: 'Please paste a valid GameControl share code or JSON payload.' });
      return;
    }

    try {
      let rawJson = inputCode.trim();
      if (rawJson.startsWith('GC-')) {
        const b64Part = rawJson.replace(/^GC-(PROFILE-|VARIANT-)?/, '');
        rawJson = decodeURIComponent(escape(atob(b64Part)));
      }

      const data = JSON.parse(rawJson);
      if (data.type === 'variant' && data.variant) {
        onImportVariant(data.variant);
        setImportStatus({ type: 'success', msg: `Successfully imported remapped layout "${data.variant.name}"!` });
        setInputCode('');
      } else if (data.type === 'profile' && data.profile) {
        onImportProfile(data.profile);
        setImportStatus({ type: 'success', msg: `Successfully imported profile "${data.profile.name || data.profile.title}"!` });
        setInputCode('');
      } else {
        setImportStatus({ type: 'error', msg: 'Unrecognized format. Code must contain a valid GameProfile or CustomVariant.' });
      }
    } catch (err) {
      setImportStatus({ type: 'error', msg: 'Failed to parse code. Please verify the share code string.' });
    }
  };

  const handleApplyCommunityPreset = (preset: typeof COMMUNITY_PRESETS[0]) => {
    if (preset.payload.type === 'variant') {
      onImportVariant(preset.payload.variant);
      setImportStatus({ type: 'success', msg: `Imported community preset "${preset.title}"!` });
      setActiveTab('import');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-3xl p-6 sm:p-8 rounded-3xl border border-current border-opacity-20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${activeTheme.cardBg}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-current border-opacity-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${activeTheme.textMain}`}>
                Community Sharing & Cloud Codes
              </h3>
              <p className={`text-xs ${activeTheme.textMuted}`}>
                Share keybindings, remapped variants, and custom profiles with friends or redeem community codes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all`}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 my-4 p-1 bg-black/20 dark:bg-white/5 rounded-2xl border border-current border-opacity-10">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center ${
              activeTab === 'export'
                ? `bg-amber-500 text-black shadow-md`
                : `${activeTheme.textMuted} hover:text-white`
            }`}
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share My Setup
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center ${
              activeTab === 'import'
                ? `bg-amber-500 text-black shadow-md`
                : `${activeTheme.textMuted} hover:text-white`
            }`}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Redeem / Import Code
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center ${
              activeTab === 'community'
                ? `bg-amber-500 text-black shadow-md`
                : `${activeTheme.textMuted} hover:text-white`
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Community Hub
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">

          {/* TAB 1: EXPORT / SHARE */}
          {activeTab === 'export' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex gap-3">
                <button
                  onClick={() => setShareType('profile')}
                  className={`flex-1 p-3 rounded-2xl border text-left transition-all ${
                    shareType === 'profile'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-current border-opacity-10 text-zinc-400 hover:border-opacity-30'
                  }`}
                >
                  <div className="font-bold text-xs">Full Game Profile</div>
                  <div className="text-[11px] opacity-80">{activeProfile.title} ({activeProfile.categories.length} categories)</div>
                </button>

                <button
                  onClick={() => setShareType('variant')}
                  disabled={!activeVariant}
                  className={`flex-1 p-3 rounded-2xl border text-left transition-all ${
                    !activeVariant ? 'opacity-40 cursor-not-allowed border-current border-opacity-10' :
                    shareType === 'variant'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-current border-opacity-10 text-zinc-400 hover:border-opacity-30'
                  }`}
                >
                  <div className="font-bold text-xs">Custom Remapped Layout</div>
                  <div className="text-[11px] opacity-80">
                    {activeVariant ? activeVariant.name : 'No active custom variant'}
                  </div>
                </button>
              </div>

              {/* Share Code Display Box */}
              <div className="p-4 rounded-2xl bg-black/40 border border-current border-opacity-20 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>Shareable Cloud Code</span>
                  <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono">Compressed Format</span>
                </div>

                <div className="p-3 bg-black/60 rounded-xl font-mono text-xs text-amber-300 break-all select-all border border-amber-500/20">
                  {shareData.fullCode}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyCode(shareData.fullCode)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center ${getButtonBgClass(activeTheme)}`}
                  >
                    {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                    {copied ? 'Copied Code!' : 'Copy Share Code'}
                  </button>

                  <button
                    onClick={() => handleCopyCode(shareData.jsonStr)}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-black/20 dark:bg-white/10 hover:bg-black/30 border border-current border-opacity-10 text-zinc-300 flex items-center"
                  >
                    <Code className="w-3.5 h-3.5 mr-1.5" /> Copy Raw JSON
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT / REDEEM */}
          {activeTab === 'import' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className={`text-xs ${activeTheme.textMuted}`}>
                Paste a <strong>GC-...</strong> share code or raw JSON string received from a friend or community member below:
              </p>

              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Paste code here (e.g. GC-eyJ0eXBlIjoidmFyaWFudCI...)"
                rows={4}
                className={`w-full p-4 rounded-2xl bg-black/40 border border-current border-opacity-20 font-mono text-xs ${activeTheme.textMain} focus:border-amber-400 outline-none`}
              />

              {importStatus && (
                <div className={`p-3 rounded-xl text-xs flex items-center ${
                  importStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {importStatus.type === 'success' ? <Check className="w-4 h-4 mr-2 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />}
                  <span>{importStatus.msg}</span>
                </div>
              )}

              <button
                onClick={handleProcessImport}
                className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center ${getButtonBgClass(activeTheme)}`}
              >
                <Upload className="w-4 h-4 mr-2" /> Validate & Apply Code
              </button>
            </div>
          )}

          {/* TAB 3: COMMUNITY HUB */}
          {activeTab === 'community' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className={`text-xs ${activeTheme.textMuted}`}>
                Explore popular community-crafted layouts for various controllers, handheld consoles, and playstyles:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMMUNITY_PRESETS.map((p) => (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border border-current border-opacity-10 bg-black/5 dark:bg-white/5 space-y-3 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">{p.gameName}</span>
                        <span className="text-[10px] text-zinc-400">{p.author}</span>
                      </div>
                      <h4 className={`text-sm font-bold ${activeTheme.textMain}`}>{p.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-current border-opacity-10">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded text-[9px] bg-black/20 dark:bg-white/10 text-zinc-300">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleApplyCommunityPreset(p)}
                        className={`w-full py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-center`}
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> Import Preset
                      </button>
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
