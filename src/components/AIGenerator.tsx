import React, { useState } from 'react';
import { GameProfile, InputPlatform, ThemeConfig } from '../types';
import { Sparkles, Loader2, Gamepad2, Wand2, CheckCircle2, Terminal } from 'lucide-react';

interface AIGeneratorProps {
  onAddProfile: (newProfile: GameProfile) => void;
  activeTheme: ThemeConfig;
  getButtonBgClass: (theme: ThemeConfig) => string;
  onSetToast: (msg: string) => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({
  onAddProfile,
  activeTheme,
  getButtonBgClass,
  onSetToast
}) => {
  const [gameTitle, setGameTitle] = useState('');
  const [playstyle, setPlaystyle] = useState('');
  const [platform, setPlatform] = useState<InputPlatform>('pc');
  const [isGenerating, setIsGenerating] = useState(false);

  const sampleGames = [
    { title: 'Black Myth: Wukong', genre: 'Action RPG' },
    { title: 'Grand Theft Auto VI', genre: 'Open World' },
    { title: 'Monster Hunter Wilds', genre: 'Action RPG' },
    { title: 'Tekken 8', genre: 'Fighting Combos' },
    { title: 'Counter-Strike 2', genre: 'Competitive FPS' },
    { title: 'Civilization VII', genre: 'Strategy' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/generate-controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameTitle: gameTitle.trim(),
          playstyle: playstyle.trim(),
          platform
        })
      });

      const data = await response.json();

      if (response.ok && data.profile) {
        onAddProfile(data.profile);
        onSetToast(`Successfully generated game profile for "${data.profile.name}"!`);
        setGameTitle('');
        setPlaystyle('');
      } else {
        onSetToast(data.error || "Failed to generate game controls.");
      }
    } catch (err: any) {
      console.error(err);
      onSetToast("Server connection error during AI generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className={`p-8 rounded-3xl border border-current border-opacity-10 shadow-2xl ${activeTheme.cardBg}`}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
            <Sparkles className={`w-8 h-8 ${activeTheme.accent}`} />
          </div>
          <h2 className={`text-3xl font-black mb-2 ${activeTheme.textMain}`}>
            AI Game Controls & Combos Generator
          </h2>
          <p className={`text-xs ${activeTheme.textMuted}`}>
            Powered by Gemini AI server model. Generate authentic control schemes, keybinds, and combo inputs for any video game in seconds.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${activeTheme.textMuted}`}>
              Video Game Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                placeholder="e.g. Black Myth Wukong, Monster Hunter, Space Marine 2..."
                required
                className={`w-full px-5 py-4 rounded-xl border bg-black/5 dark:bg-white/5 border-current border-opacity-20 focus:outline-none font-bold text-sm ${activeTheme.textMain}`}
              />
              <Gamepad2 className="absolute right-4 top-4 w-5 h-5 opacity-40" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${activeTheme.textMuted}`}>
                Specific Character / Playstyle (Optional)
              </label>
              <input
                type="text"
                value={playstyle}
                onChange={(e) => setPlaystyle(e.target.value)}
                placeholder="e.g. Mishima Combos, Pro Keybinds, Flying Controls..."
                className={`w-full px-4 py-3 rounded-xl border bg-black/5 dark:bg-white/5 border-current border-opacity-20 focus:outline-none text-xs font-semibold ${activeTheme.textMain}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${activeTheme.textMuted}`}>
                Target Layout Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as InputPlatform)}
                className={`w-full px-4 py-3 rounded-xl border bg-black/5 dark:bg-white/5 border-current border-opacity-20 focus:outline-none text-xs font-bold ${activeTheme.textMain}`}
              >
                <option value="pc">PC Keyboard & Mouse</option>
                <option value="playstation">PlayStation DualSense</option>
                <option value="xbox">Xbox Controller</option>
                <option value="switch">Nintendo Switch Pro</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !gameTitle.trim()}
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center transition-all shadow-lg ${
              isGenerating || !gameTitle.trim()
                ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-400'
                : getButtonBgClass(activeTheme)
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Querying Gemini AI for Game Controls...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Game Control Scheme
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Prompts */}
        <div className="mt-8 pt-6 border-t border-current border-opacity-10">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
            Instant 1-Click Game Control Ideas:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleGames.map((sg, idx) => (
              <button
                key={idx}
                onClick={() => setGameTitle(sg.title)}
                className="px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/5 border border-current border-opacity-10 text-xs font-semibold hover:border-indigo-400 transition-colors flex items-center"
              >
                <Terminal className="w-3 h-3 mr-1 text-indigo-400" />
                {sg.title} <span className="ml-1 opacity-40">({sg.genre})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
