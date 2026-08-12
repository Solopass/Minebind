import React, { useState } from 'react';
import { InputPlatform, ControlCategory, ThemeConfig } from '../types';
import { Gamepad2, Keyboard, Mouse, Flame, Info, Check } from 'lucide-react';

interface ControlVisualizerProps {
  platform: InputPlatform;
  categories: ControlCategory[];
  activeTheme: ThemeConfig;
  onSelectKeyFilter?: (keyName: string | null) => void;
  selectedKeyFilter?: string | null;
}

export const ControlVisualizer: React.FC<ControlVisualizerProps> = ({
  platform,
  categories,
  activeTheme,
  onSelectKeyFilter,
  selectedKeyFilter
}) => {
  const [visualMode, setVisualMode] = useState<'interactive' | 'heatmap'>('interactive');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Compute key frequencies for heatmap
  const buttonFrequencies: Record<string, number> = {};
  let maxFreq = 1;

  categories.forEach(cat => {
    cat.items.forEach(item => {
      const keysText = item.platformKeys?.[platform] || item.keys;
      const cleanKeys = keysText.replace(/`/g, '').toLowerCase();
      // split by common delimiters
      const tokens = cleanKeys.split(/[\s+\/,\-]+/);
      tokens.forEach(tok => {
        const key = tok.trim();
        if (key && key.length > 0) {
          buttonFrequencies[key] = (buttonFrequencies[key] || 0) + 1;
          if (buttonFrequencies[key] > maxFreq) maxFreq = buttonFrequencies[key];
        }
      });
    });
  });

  const activeKeyName = hoveredButton || selectedKeyFilter;

  // Find all actions matching the active key name
  const matchingActions = categories.flatMap(c => 
    c.items.filter(item => {
      if (!activeKeyName) return false;
      const keysText = (item.platformKeys?.[platform] || item.keys).toLowerCase();
      return keysText.includes(activeKeyName.toLowerCase());
    }).map(item => ({ ...item, category: c.name }))
  );

  const getButtonIntensityColor = (btnKey: string) => {
    if (visualMode !== 'heatmap') return '';
    const freq = buttonFrequencies[btnKey.toLowerCase()] || 0;
    if (freq === 0) return 'opacity-30 bg-zinc-800 text-zinc-500';
    const ratio = freq / maxFreq;
    if (ratio > 0.6) return 'bg-rose-500 text-white font-bold ring-2 ring-rose-300 shadow-lg shadow-rose-500/50 scale-105';
    if (ratio > 0.3) return 'bg-amber-500 text-black font-bold ring-2 ring-amber-300 shadow-md shadow-amber-500/40';
    return 'bg-emerald-500 text-black font-semibold';
  };

  const isButtonHighlighted = (btnKey: string) => {
    if (!activeKeyName) return false;
    return activeKeyName.toLowerCase() === btnKey.toLowerCase();
  };

  const handleButtonClick = (btnKey: string) => {
    if (onSelectKeyFilter) {
      if (selectedKeyFilter === btnKey) {
        onSelectKeyFilter(null);
      } else {
        onSelectKeyFilter(btnKey);
      }
    }
  };

  return (
    <div className={`p-6 rounded-2xl border border-current border-opacity-10 shadow-xl ${activeTheme.cardBg} transition-all`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className={`text-xl font-bold flex items-center ${activeTheme.textMain}`}>
            {platform === 'pc' ? <Keyboard className={`w-6 h-6 mr-2.5 ${activeTheme.accent}`} /> : <Gamepad2 className={`w-6 h-6 mr-2.5 ${activeTheme.accent}`} />}
            {platform === 'pc' ? 'PC Keyboard & Mouse Layout' :
             platform === 'xbox' ? 'Xbox Controller Layout' :
             platform === 'playstation' ? 'DualSense Controller Layout' : 'Nintendo Switch Pro Layout'}
          </h3>
          <p className={`text-xs mt-1 ${activeTheme.textMuted}`}>
            Hover or tap any button to highlight its in-game actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-black/10 dark:bg-white/10 p-1 rounded-lg border border-current border-opacity-10 text-xs font-bold">
            <button
              onClick={() => setVisualMode('interactive')}
              className={`px-3 py-1.5 rounded-md transition-all ${visualMode === 'interactive' ? `${activeTheme.cardBg} ${activeTheme.textMain} shadow-sm` : activeTheme.textMuted}`}
            >
              Interactive Diagram
            </button>
            <button
              onClick={() => setVisualMode('heatmap')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center ${visualMode === 'heatmap' ? `bg-rose-500/20 text-rose-400 border border-rose-500/30` : activeTheme.textMuted}`}
            >
              <Flame className="w-3.5 h-3.5 mr-1 text-rose-500" /> Usage Heatmap
            </button>
          </div>
        </div>
      </div>

      {/* Render Diagram based on selected platform */}
      <div className="py-4 px-2 overflow-x-auto flex flex-col items-center justify-center">
        {platform === 'pc' && (
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center max-w-full">
            {/* Keyboard Grid */}
            <div className="inline-flex flex-col gap-1.5 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl">
              {/* Row 1 */}
              <div className="flex gap-1.5">
                {['esc', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'].map((k) => (
                  <button
                    key={k}
                    onMouseEnter={() => setHoveredButton(k)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => handleButtonClick(k)}
                    className={`h-8 px-2 text-[10px] font-mono uppercase rounded border transition-all ${
                      isButtonHighlighted(k) ? 'bg-indigo-500 text-white ring-2 ring-indigo-300 scale-110 z-10' :
                      visualMode === 'heatmap' ? getButtonIntensityColor(k) : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Row 2 Number Row */}
              <div className="flex gap-1.5">
                {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'].map((k) => (
                  <button
                    key={k}
                    onMouseEnter={() => setHoveredButton(k)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => handleButtonClick(k)}
                    className={`h-9 ${k === 'backspace' ? 'w-16' : 'w-9'} text-xs font-mono font-bold rounded border transition-all ${
                      isButtonHighlighted(k) ? 'bg-indigo-500 text-white ring-2 ring-indigo-300 scale-110 z-10' :
                      visualMode === 'heatmap' ? getButtonIntensityColor(k) : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Row 3 QWERTY */}
              <div className="flex gap-1.5">
                {['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'].map((k) => (
                  <button
                    key={k}
                    onMouseEnter={() => setHoveredButton(k)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => handleButtonClick(k)}
                    className={`h-9 ${k === 'tab' ? 'w-14' : 'w-9'} text-xs font-mono font-bold rounded border transition-all ${
                      isButtonHighlighted(k) ? 'bg-indigo-500 text-white ring-2 ring-indigo-300 scale-110 z-10' :
                      ['w','a','s','d'].includes(k) ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300 font-extrabold' :
                      visualMode === 'heatmap' ? getButtonIntensityColor(k) : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Row 4 ASDF */}
              <div className="flex gap-1.5">
                {['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'].map((k) => (
                  <button
                    key={k}
                    onMouseEnter={() => setHoveredButton(k)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => handleButtonClick(k)}
                    className={`h-9 ${k === 'caps' ? 'w-16' : k === 'enter' ? 'w-16' : 'w-9'} text-xs font-mono font-bold rounded border transition-all ${
                      isButtonHighlighted(k) ? 'bg-indigo-500 text-white ring-2 ring-indigo-300 scale-110 z-10' :
                      ['w','a','s','d'].includes(k) ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300 font-extrabold' :
                      visualMode === 'heatmap' ? getButtonIntensityColor(k) : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Row 5 Shift ZXCV */}
              <div className="flex gap-1.5">
                {['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'].map((k, idx) => (
                  <button
                    key={`${k}-${idx}`}
                    onMouseEnter={() => setHoveredButton('shift')}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => handleButtonClick('shift')}
                    className={`h-9 ${k === 'shift' ? 'w-20' : 'w-9'} text-xs font-mono font-bold rounded border transition-all ${
                      isButtonHighlighted('shift') ? 'bg-indigo-500 text-white ring-2 ring-indigo-300 scale-110 z-10' :
                      visualMode === 'heatmap' ? getButtonIntensityColor(k) : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Row 6 Ctrl Alt Space */}
              <div className="flex gap-1.5">
                <button
                  onMouseEnter={() => setHoveredButton('ctrl')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('ctrl')}
                  className={`h-9 w-14 text-xs font-mono font-bold rounded border transition-all ${isButtonHighlighted('ctrl') ? 'bg-indigo-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  ctrl
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('alt')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('alt')}
                  className={`h-9 w-12 text-xs font-mono font-bold rounded border transition-all ${isButtonHighlighted('alt') ? 'bg-indigo-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  alt
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('space')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('space')}
                  className={`h-9 flex-1 text-xs font-mono font-bold rounded border transition-all ${isButtonHighlighted('space') ? 'bg-indigo-500 text-white ring-2 ring-indigo-300' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  SPACEBAR
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('alt')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('alt')}
                  className={`h-9 w-12 text-xs font-mono font-bold rounded border transition-all ${isButtonHighlighted('alt') ? 'bg-indigo-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  alt
                </button>
              </div>
            </div>

            {/* Mouse Visualizer */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-zinc-950 border border-zinc-800 w-48 shadow-2xl">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center">
                <Mouse className="w-4 h-4 mr-1.5 text-indigo-400" /> Gaming Mouse
              </span>
              <div className="w-32 h-44 rounded-t-full rounded-b-3xl bg-zinc-900 border-2 border-zinc-700 relative p-2 flex flex-col items-center">
                {/* Left & Right Click */}
                <div className="w-full flex gap-1 h-16 border-b border-zinc-800">
                  <button
                    onMouseEnter={() => setHoveredButton('lmb')}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => handleButtonClick('lmb')}
                    className={`flex-1 rounded-tl-full rounded-tr-sm border text-[10px] font-bold uppercase transition-all flex items-center justify-center ${
                      isButtonHighlighted('lmb') ? 'bg-indigo-500 text-white ring-2 ring-indigo-300' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    LMB
                  </button>
                  {/* Scroll Wheel */}
                  <button
                    onMouseEnter={() => setHoveredButton('mmb')}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => handleButtonClick('mmb')}
                    className={`w-4 h-10 my-auto rounded-full border text-[8px] font-bold transition-all ${
                      isButtonHighlighted('mmb') ? 'bg-indigo-400 ring-2' : 'bg-zinc-950 border-zinc-600'
                    }`}
                    title="Middle Click / Scroll Wheel"
                  />
                  <button
                    onMouseEnter={() => setHoveredButton('rmb')}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => handleButtonClick('rmb')}
                    className={`flex-1 rounded-tr-full rounded-tl-sm border text-[10px] font-bold uppercase transition-all flex items-center justify-center ${
                      isButtonHighlighted('rmb') ? 'bg-indigo-500 text-white ring-2 ring-indigo-300' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    RMB
                  </button>
                </div>
                {/* Palm rest */}
                <div className="flex-1 w-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-[10px] font-bold">
                    DPI
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Xbox Controller Diagram */}
        {platform === 'xbox' && (
          <div className="relative w-full max-w-lg h-72 bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            {/* Top Bumpers & Triggers */}
            <div className="flex justify-between items-center px-4 -mt-2">
              <div className="flex gap-2">
                <button
                  onMouseEnter={() => setHoveredButton('lt')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('lt')}
                  className={`px-4 py-1.5 rounded-t-xl text-xs font-extrabold uppercase border transition-all ${isButtonHighlighted('lt') ? 'bg-emerald-500 text-black ring-2' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  LT
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('lb')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('lb')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase border transition-all ${isButtonHighlighted('lb') ? 'bg-emerald-500 text-black ring-2' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  LB
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onMouseEnter={() => setHoveredButton('rb')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('rb')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase border transition-all ${isButtonHighlighted('rb') ? 'bg-emerald-500 text-black ring-2' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  RB
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('rt')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('rt')}
                  className={`px-4 py-1.5 rounded-t-xl text-xs font-extrabold uppercase border transition-all ${isButtonHighlighted('rt') ? 'bg-emerald-500 text-black ring-2' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  RT
                </button>
              </div>
            </div>

            {/* Main Face Controls */}
            <div className="grid grid-cols-3 items-center my-auto px-4">
              {/* Left Stick & D-Pad */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onMouseEnter={() => setHoveredButton('l-stick')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('l-stick')}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xs uppercase shadow-inner transition-all ${isButtonHighlighted('l-stick') ? 'bg-emerald-500 text-black ring-4' : 'bg-zinc-800 border-zinc-600 text-zinc-300'}`}
                >
                  LS (L3)
                </button>
              </div>

              {/* Center Menu / Guide */}
              <div className="flex justify-center gap-3">
                <button
                  onMouseEnter={() => setHoveredButton('view')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-6 h-6 rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400 flex items-center justify-center border border-zinc-700"
                >
                  ⧉
                </button>
                <div className="w-8 h-8 rounded-full bg-white text-black font-black text-xs flex items-center justify-center shadow-md">
                  X
                </div>
                <button
                  onMouseEnter={() => setHoveredButton('menu')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-6 h-6 rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400 flex items-center justify-center border border-zinc-700"
                >
                  ☰
                </button>
              </div>

              {/* ABXY Face Buttons */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <button
                  onMouseEnter={() => setHoveredButton('y')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('y')}
                  className={`absolute top-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${isButtonHighlighted('y') ? 'bg-amber-400 text-black ring-4' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'}`}
                >
                  Y
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('x')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('x')}
                  className={`absolute left-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${isButtonHighlighted('x') ? 'bg-blue-400 text-black ring-4' : 'bg-blue-500/20 text-blue-400 border-blue-500/40'}`}
                >
                  X
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('b')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('b')}
                  className={`absolute right-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${isButtonHighlighted('b') ? 'bg-rose-400 text-black ring-4' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}
                >
                  B
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('a')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('a')}
                  className={`absolute bottom-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${isButtonHighlighted('a') ? 'bg-emerald-400 text-black ring-4' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'}`}
                >
                  A
                </button>
              </div>
            </div>

            {/* Bottom Row (D-Pad & Right Stick) */}
            <div className="flex justify-between items-end px-8 pb-2">
              <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center font-bold text-xs text-zinc-300">
                D-PAD
              </div>
              <button
                onMouseEnter={() => setHoveredButton('r-stick')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleButtonClick('r-stick')}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xs uppercase shadow-inner transition-all ${isButtonHighlighted('r-stick') ? 'bg-emerald-500 text-black ring-4' : 'bg-zinc-800 border-zinc-600 text-zinc-300'}`}
              >
                RS (R3)
              </button>
            </div>
          </div>
        )}

        {/* PlayStation DualSense Diagram */}
        {platform === 'playstation' && (
          <div className="relative w-full max-w-lg h-72 bg-zinc-950 border-2 border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            {/* Top Triggers */}
            <div className="flex justify-between items-center px-4 -mt-2">
              <div className="flex gap-2">
                <button
                  onMouseEnter={() => setHoveredButton('l2')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('l2')}
                  className={`px-4 py-1.5 rounded-t-xl text-xs font-extrabold uppercase border transition-all ${isButtonHighlighted('l2') ? 'bg-blue-500 text-white ring-2' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  L2
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('l1')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('l1')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase border transition-all ${isButtonHighlighted('l1') ? 'bg-blue-500 text-white ring-2' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  L1
                </button>
              </div>
              {/* Touchpad */}
              <div className="w-24 h-10 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                TOUCHPAD
              </div>
              <div className="flex gap-2">
                <button
                  onMouseEnter={() => setHoveredButton('r1')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('r1')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase border transition-all ${isButtonHighlighted('r1') ? 'bg-blue-500 text-white ring-2' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  R1
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('r2')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('r2')}
                  className={`px-4 py-1.5 rounded-t-xl text-xs font-extrabold uppercase border transition-all ${isButtonHighlighted('r2') ? 'bg-blue-500 text-white ring-2' : 'bg-zinc-800 border-zinc-700 text-zinc-200'}`}
                >
                  R2
                </button>
              </div>
            </div>

            {/* D-Pad & Shapes */}
            <div className="grid grid-cols-2 justify-between items-center my-auto px-4">
              {/* D-Pad */}
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center font-bold text-xs text-zinc-300 mx-auto">
                D-PAD
              </div>

              {/* PlayStation Shapes */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <button
                  onMouseEnter={() => setHoveredButton('triangle')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('triangle')}
                  className={`absolute top-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${isButtonHighlighted('triangle') ? 'bg-emerald-400 text-black ring-4' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'}`}
                >
                  △
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('square')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('square')}
                  className={`absolute left-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${isButtonHighlighted('square') ? 'bg-fuchsia-400 text-black ring-4' : 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40'}`}
                >
                  ▢
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('circle')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('circle')}
                  className={`absolute right-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${isButtonHighlighted('circle') ? 'bg-rose-400 text-black ring-4' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}
                >
                  ◯
                </button>
                <button
                  onMouseEnter={() => setHoveredButton('cross')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => handleButtonClick('cross')}
                  className={`absolute bottom-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${isButtonHighlighted('cross') ? 'bg-sky-400 text-black ring-4' : 'bg-sky-500/20 text-sky-400 border-sky-500/40'}`}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sticks Symmetrical */}
            <div className="flex justify-center gap-12 pb-2">
              <button
                onMouseEnter={() => setHoveredButton('l3')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleButtonClick('l3')}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xs uppercase shadow-inner transition-all ${isButtonHighlighted('l3') ? 'bg-blue-500 text-white ring-4' : 'bg-zinc-800 border-zinc-600 text-zinc-300'}`}
              >
                L3
              </button>
              <button
                onMouseEnter={() => setHoveredButton('r3')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleButtonClick('r3')}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xs uppercase shadow-inner transition-all ${isButtonHighlighted('r3') ? 'bg-blue-500 text-white ring-4' : 'bg-zinc-800 border-zinc-600 text-zinc-300'}`}
              >
                R3
              </button>
            </div>
          </div>
        )}

        {/* Nintendo Switch Pro Diagram */}
        {platform === 'switch' && (
          <div className="relative w-full max-w-lg h-72 bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center px-4 -mt-2">
              <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-t-xl text-xs font-extrabold bg-zinc-800 border border-zinc-700 text-zinc-200">ZL</button>
                <button className="px-4 py-1.5 rounded-lg text-xs font-extrabold bg-zinc-800 border border-zinc-700 text-zinc-200">L</button>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-lg text-xs font-extrabold bg-zinc-800 border border-zinc-700 text-zinc-200">R</button>
                <button className="px-4 py-1.5 rounded-t-xl text-xs font-extrabold bg-zinc-800 border border-zinc-700 text-zinc-200">ZR</button>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center my-auto px-4">
              <button
                onMouseEnter={() => setHoveredButton('l-stick')}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center font-bold text-xs text-zinc-300 mx-auto"
              >
                L Stick
              </button>
              <div className="text-center font-black text-rose-500 text-xs tracking-widest">
                SWITCH PRO
              </div>
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <button onClick={() => handleButtonClick('x')} className="absolute top-0 w-9 h-9 rounded-full font-black text-sm bg-zinc-800 border border-zinc-600 text-zinc-200">X</button>
                <button onClick={() => handleButtonClick('y')} className="absolute left-0 w-9 h-9 rounded-full font-black text-sm bg-zinc-800 border border-zinc-600 text-zinc-200">Y</button>
                <button onClick={() => handleButtonClick('a')} className="absolute right-0 w-9 h-9 rounded-full font-black text-sm bg-zinc-800 border border-zinc-600 text-zinc-200">A</button>
                <button onClick={() => handleButtonClick('b')} className="absolute bottom-0 w-9 h-9 rounded-full font-black text-sm bg-zinc-800 border border-zinc-600 text-zinc-200">B</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected / Hovered Actions Box */}
      <div className="mt-6 pt-4 border-t border-current border-opacity-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center">
            <Info className="w-4 h-4 mr-1.5 text-indigo-400" />
            {activeKeyName ? `Mapped Actions for "${activeKeyName.toUpperCase()}"` : 'Hover over any button to view mapped actions'}
          </span>
          {selectedKeyFilter && (
            <button
              onClick={() => onSelectKeyFilter && onSelectKeyFilter(null)}
              className="text-xs font-bold text-rose-400 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {activeKeyName ? (
          matchingActions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchingActions.map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/10 dark:bg-white/5 border border-current border-opacity-10 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide block">{act.category}</span>
                    <span className={`font-semibold text-sm ${activeTheme.textMain}`}>{act.description}</span>
                  </div>
                  <kbd className={`px-2.5 py-1 text-xs font-bold rounded ${activeTheme.keycap}`}>
                    {act.platformKeys?.[platform] || act.keys}
                  </kbd>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm italic ${activeTheme.textMuted}`}>
              No specific action mapped to "{activeKeyName}" in this profile.
            </p>
          )
        ) : (
          <div className="flex items-center justify-center p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-dashed border-current border-opacity-10 text-xs text-zinc-400">
            Interactive visualizer ready. Hover or tap buttons to discover game controls.
          </div>
        )}
      </div>
    </div>
  );
};
