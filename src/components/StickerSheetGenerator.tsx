import React, { useState } from 'react';
import { GameProfile, InputPlatform, ThemeConfig, CustomVariant } from '../types';
import { 
  Printer, Grid, Copy, Check, Download, Sparkles, Sliders, 
  Layers, Scissors, Layout, Gamepad2, Mouse, Eye
} from 'lucide-react';

interface StickerSheetGeneratorProps {
  activeProfile: GameProfile;
  activeVariant: CustomVariant | null;
  platform: InputPlatform;
  activeTheme: ThemeConfig;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

export const StickerSheetGenerator: React.FC<StickerSheetGeneratorProps> = ({
  activeProfile,
  activeVariant,
  platform,
  activeTheme,
  getButtonBgClass
}) => {
  const [stickerType, setStickerType] = useState<'keycaps' | 'fightstick' | 'controller'>('keycaps');
  const [paperStyle, setPaperStyle] = useState<'high-contrast' | 'dark-mode' | 'cyber-yellow'>('high-contrast');
  const [sheetTitle, setSheetTitle] = useState(`${activeProfile.name} - Custom Desk Sticker Sheet`);

  // Extract all controls
  const allItems = activeProfile.categories.flatMap(cat => 
    cat.items.map(item => ({
      ...item,
      categoryName: cat.name
    }))
  );

  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`no-print p-6 sm:p-8 rounded-3xl border border-current border-opacity-10 shadow-2xl relative overflow-hidden ${activeTheme.cardBg}`}>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center">
              <Printer className="w-3 h-3 mr-1" /> Physical Desk Gear
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Printable Sticker Grid
            </span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-black ${activeTheme.textMain}`}>
            Keycap & Fightstick Sticker Sheet Generator
          </h1>

          <p className={`text-sm ${activeTheme.textMuted} leading-relaxed`}>
            Generate print-ready sticker grids for keyboard keycaps, macro pads, leverless arcade sticks (Hitbox), or controller back paddles. Print on standard sticker paper and cut along precision die-cut lines.
          </p>
        </div>
      </div>

      {/* Sheet Configuration Controls */}
      <div className={`no-print p-6 rounded-3xl border border-current border-opacity-10 space-y-6 ${activeTheme.cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Sticker Preset Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Sticker Format & Sizing
            </label>
            <select
              value={stickerType}
              onChange={(e) => setStickerType(e.target.value as any)}
              className={`w-full p-3 rounded-2xl bg-black/40 border border-current border-opacity-20 font-bold text-xs ${activeTheme.textMain} focus:border-amber-400 outline-none`}
            >
              <option value="keycaps">Standard Keyboard Keycaps (15mm x 15mm)</option>
              <option value="fightstick">Arcade Fightstick Buttons (30mm Circles)</option>
              <option value="controller">Controller & Paddle Strips (24mm x 12mm)</option>
            </select>
          </div>

          {/* Paper Print Palette */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Print Color Theme
            </label>
            <select
              value={paperStyle}
              onChange={(e) => setPaperStyle(e.target.value as any)}
              className={`w-full p-3 rounded-2xl bg-black/40 border border-current border-opacity-20 font-bold text-xs ${activeTheme.textMain} focus:border-amber-400 outline-none`}
            >
              <option value="high-contrast">High Contrast White Paper (Black Ink Save)</option>
              <option value="dark-mode">OLED Dark Vinyl (Black Background)</option>
              <option value="cyber-yellow">Cyberpunk High-Vis Amber</option>
            </select>
          </div>

          {/* Print Action Button */}
          <div className="space-y-2 flex flex-col justify-end">
            <button
              onClick={handlePrintSheet}
              className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center ${getButtonBgClass(activeTheme)}`}
            >
              <Printer className="w-4 h-4 mr-2" /> Print Sticker Sheet (Ctrl+P)
            </button>
          </div>

        </div>

        {/* Title Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Sheet Title Header
          </label>
          <input
            type="text"
            value={sheetTitle}
            onChange={(e) => setSheetTitle(e.target.value)}
            className={`w-full p-2.5 rounded-xl bg-black/40 border border-current border-opacity-20 font-bold text-xs ${activeTheme.textMain} outline-none focus:border-amber-400`}
          />
        </div>
      </div>

      {/* Printable Sheet Canvas Preview Area */}
      <div className="p-6 rounded-3xl border border-current border-opacity-20 bg-zinc-950 space-y-4">
        
        <div className="no-print flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
          <span className="flex items-center">
            <Scissors className="w-3.5 h-3.5 mr-1 text-amber-400" /> Print Preview (Paper Format: A4 / Letter)
          </span>
          <span className="font-mono text-[10px] uppercase">
            {allItems.length} Printed Stickers
          </span>
        </div>

        {/* Printable Printable Container (Targeted by CSS @media print) */}
        <div className={`printable-area p-8 rounded-2xl border transition-all ${
          paperStyle === 'high-contrast' ? 'bg-white text-black border-zinc-300' :
          paperStyle === 'cyber-yellow' ? 'bg-amber-400 text-black border-amber-500' :
          'bg-zinc-900 text-white border-zinc-700'
        }`}>
          
          {/* Printable Header */}
          <div className="border-b-2 border-current pb-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">
                {sheetTitle}
              </h2>
              <p className="text-xs font-mono opacity-80 mt-0.5">
                Game: {activeProfile.name} • Platform: {platform.toUpperCase()} • Format: {stickerType.toUpperCase()}
              </p>
            </div>
            <div className="text-right text-[10px] font-mono opacity-70">
              GameControl Master Sticker Spec
            </div>
          </div>

          {/* Grid Layout depending on Sticker Type */}
          <div className={`grid gap-3 ${
            stickerType === 'fightstick' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' 
              : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'
          }`}>
            {allItems.map((item) => {
              const bindVal = activeVariant?.customBindings[item.id] || item.platformKeys?.[platform] || item.keys;

              if (stickerType === 'fightstick') {
                // Round 30mm Arcade Stick Button Stickers
                return (
                  <div
                    key={item.id}
                    className={`aspect-square rounded-full border-2 border-dashed border-current p-2 flex flex-col items-center justify-center text-center relative overflow-hidden ${
                      paperStyle === 'high-contrast' ? 'bg-zinc-50' : 'bg-black/30'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-tighter truncate max-w-[80%] opacity-80">
                      {item.description}
                    </span>
                    <span className="text-sm font-black font-mono mt-0.5">
                      {bindVal}
                    </span>
                  </div>
                );
              }

              // Square Keycap Stickers (15mm x 15mm)
              return (
                <div
                  key={item.id}
                  className={`aspect-square rounded-xl border-2 border-dashed border-current p-2 flex flex-col items-center justify-between text-center ${
                    paperStyle === 'high-contrast' ? 'bg-zinc-50' : 'bg-black/30'
                  }`}
                >
                  <span className="text-[8px] font-bold uppercase tracking-tighter line-clamp-1 opacity-70">
                    {item.description}
                  </span>

                  <span className="text-xs sm:text-sm font-black font-mono uppercase">
                    {bindVal}
                  </span>

                  <span className="text-[7px] font-mono opacity-50 truncate w-full">
                    {item.categoryName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Cutting Instructions Footer */}
          <div className="mt-8 pt-4 border-t border-dashed border-current text-[9px] font-mono opacity-70 flex justify-between items-center">
            <span>✂️ Cut carefully along dashed guidelines.</span>
            <span>https://ai.studio/build • GameControl Master</span>
          </div>

        </div>

      </div>

    </div>
  );
};
