import React from 'react';
import { ThemeConfig, UserStreak } from '../types';
import { Palette, Settings2, Download, UploadCloud, Volume2, Type, Server, Flame } from 'lucide-react';

interface SettingsPanelProps {
  themes: ThemeConfig[];
  activeThemeIndex: number;
  onSelectTheme: (index: number) => void;
  soundPack: string;
  onSelectSoundPack: (pack: string) => void;
  appFont: string;
  onSelectFont: (font: string) => void;
  appScale: string;
  onSelectScale: (scale: string) => void;
  activeTheme: ThemeConfig;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  streakData: UserStreak;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  themes,
  activeThemeIndex,
  onSelectTheme,
  soundPack,
  onSelectSoundPack,
  appFont,
  onSelectFont,
  appScale,
  onSelectScale,
  activeTheme,
  onExportData,
  onImportData,
  streakData,
  getButtonBgClass
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="text-center">
        <Settings2 className={`w-12 h-12 mx-auto mb-3 ${activeTheme.accent}`} />
        <h2 className={`text-3xl font-black ${activeTheme.textMain}`}>
          Settings & Customization Studio
        </h2>
        <p className={`text-xs mt-1 ${activeTheme.textMuted}`}>
          Personalize visual themes, sound profiles, typography, and manage local profile data backups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Theme Picker */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border border-current border-opacity-10 shadow-xl ${activeTheme.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center ${activeTheme.textMain}`}>
            <Palette className="w-5 h-5 mr-2" /> Gamer Color Themes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themes.map((t, idx) => (
              <button
                key={idx}
                onClick={() => onSelectTheme(idx)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  activeThemeIndex === idx
                    ? `border-current ${activeTheme.textMain} bg-black/10 dark:bg-white/10 ring-2 ring-current`
                    : `border-transparent hover:border-current hover:border-opacity-20 ${activeTheme.textMuted} bg-black/5 dark:bg-white/5`
                }`}
              >
                <div className={`font-bold text-sm mb-2 ${t.accent}`}>{t.name}</div>
                <div className="flex gap-2">
                  <div className={`w-6 h-6 rounded-full ${t.appBg} border border-white/20`} />
                  <div className={`w-6 h-6 rounded-full ${t.cardBg.split(' ')[0]} border border-white/20`} />
                  <div className={`w-6 h-6 rounded-full ${t.keycap.split(' ')[0]} border border-white/20`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Font Controls */}
        <div className={`p-6 rounded-3xl border border-current border-opacity-10 shadow-xl space-y-6 ${activeTheme.cardBg}`}>
          <div>
            <h3 className={`text-base font-bold mb-3 flex items-center ${activeTheme.textMain}`}>
              <Volume2 className="w-4 h-4 mr-2" /> Mechanical Sound Profile
            </h3>
            <select
              value={soundPack}
              onChange={(e) => onSelectSoundPack(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-black/5 dark:bg-white/5 border-current border-opacity-20 font-bold text-xs ${activeTheme.textMain}`}
            >
              <option value="blue">Blue Switch (Clicky Tactile)</option>
              <option value="red">Red Switch (Linear Smooth)</option>
              <option value="typewriter">Arcade Cabinet Clank</option>
            </select>
          </div>

          <div>
            <h3 className={`text-base font-bold mb-3 flex items-center ${activeTheme.textMain}`}>
              <Type className="w-4 h-4 mr-2" /> UI Text Scale
            </h3>
            <div className="flex gap-2">
              {[
                { id: 'text-sm', label: 'Compact' },
                { id: 'text-base', label: 'Normal' },
                { id: 'text-lg', label: 'Spacious' }
              ].map(scale => (
                <button
                  key={scale.id}
                  onClick={() => onSelectScale(scale.id)}
                  className={`flex-1 py-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                    appScale === scale.id
                      ? `border-current ${activeTheme.textMain} bg-black/10 dark:bg-white/10`
                      : `border-transparent ${activeTheme.textMuted} hover:bg-black/5 dark:hover:bg-white/5`
                  }`}
                >
                  {scale.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-current border-opacity-10">
            <span className="text-xs font-bold uppercase text-orange-400 flex items-center mb-1">
              <Flame className="w-4 h-4 mr-1" /> Practice Streak: {streakData.count} Days
            </span>
            <p className="text-[11px] text-zinc-400">
              Practice controls daily to build muscle memory and maintain your streak.
            </p>
          </div>
        </div>
      </div>

      {/* Backup & Import Data */}
      <div className={`p-6 rounded-3xl border border-current border-opacity-10 shadow-xl ${activeTheme.cardBg}`}>
        <h3 className={`text-lg font-bold mb-2 flex items-center ${activeTheme.textMain}`}>
          <Server className="w-5 h-5 mr-2" /> Data Backup & Migration
        </h3>
        <p className={`text-xs mb-6 ${activeTheme.textMuted}`}>
          Game profiles and training stats are stored locally in your browser. Export backups or import saved configs anytime.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={onExportData}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center transition-all ${getButtonBgClass(activeTheme)}`}
          >
            <Download className="w-4 h-4 mr-2" /> Export Backup JSON
          </button>

          <label className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center cursor-pointer border border-current border-opacity-20 hover:bg-black/5 dark:hover:bg-white/5 transition-all ${activeTheme.textMain}`}>
            <UploadCloud className="w-4 h-4 mr-2" /> Import Backup File
            <input type="file" accept=".json" onChange={onImportData} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
