import React, { useState, useMemo } from 'react';
import { ThemeConfig } from '../types';
import { 
  Calculator, Mouse, Sliders, Zap, Info, Copy, Check, 
  ArrowRightLeft, Target, Gamepad2, Shield, Sparkles, Activity
} from 'lucide-react';

interface SensitivityConverterProps {
  activeTheme: ThemeConfig;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

// Sensitivity multipliers relative to Source / Unreal / CS (Base ratio 1.0)
// Formula: Game Sens * Game Yaw = Rotation per count
// CS/Apex/TF2 Yaw: 0.022
// Valorant Yaw: 0.07 (Val Sens = CS Sens / 3.181818)
// Overwatch Yaw: 0.0066 (OW Sens = CS Sens * 3.333333)
// Fortnite Yaw: 0.005555
// R6 Siege Yaw: 0.005729578
// COD Yaw: 0.0066
interface GameSensProfile {
  id: string;
  name: string;
  yaw: number; // yaw angle per count in degrees
  defaultSens: number;
  category: 'Tactical FPS' | 'Battle Royale' | 'Hero Shooter' | 'Action/RPG';
}

const SUPPORTED_GAMES: GameSensProfile[] = [
  { id: 'valorant', name: 'Valorant', yaw: 0.07, defaultSens: 0.35, category: 'Tactical FPS' },
  { id: 'cs2', name: 'Counter-Strike 2 / CS:GO', yaw: 0.022, defaultSens: 1.11, category: 'Tactical FPS' },
  { id: 'apex', name: 'Apex Legends', yaw: 0.022, defaultSens: 1.11, category: 'Battle Royale' },
  { id: 'overwatch2', name: 'Overwatch 2', yaw: 0.0066, defaultSens: 3.71, category: 'Hero Shooter' },
  { id: 'cod', name: 'Call of Duty: Warzone / MW3', yaw: 0.0066, defaultSens: 3.71, category: 'Battle Royale' },
  { id: 'fortnite', name: 'Fortnite (Slider %)', yaw: 0.00555555, defaultSens: 8.8, category: 'Battle Royale' },
  { id: 'r6s', name: 'Rainbow Six Siege', yaw: 0.005729578, defaultSens: 8.5, category: 'Tactical FPS' },
  { id: 'destiny2', name: 'Destiny 2', yaw: 0.0066, defaultSens: 3.71, category: 'Hero Shooter' },
  { id: 'halo', name: 'Halo Infinite', yaw: 0.0066, defaultSens: 3.71, category: 'Hero Shooter' },
  { id: 'pubg', name: 'PUBG: Battlegrounds', yaw: 0.00222222, defaultSens: 50, category: 'Battle Royale' },
  { id: 'tf2', name: 'Team Fortress 2', yaw: 0.022, defaultSens: 1.11, category: 'Hero Shooter' },
  { id: 'roblox', name: 'Roblox (Slider)', yaw: 0.0035, defaultSens: 0.2, category: 'Action/RPG' },
  { id: 'minecraft', name: 'Minecraft (Sens %)', yaw: 0.03, defaultSens: 100, category: 'Action/RPG' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', yaw: 0.015, defaultSens: 2.5, category: 'Action/RPG' }
];

export const SensitivityConverter: React.FC<SensitivityConverterProps> = ({
  activeTheme,
  getButtonBgClass
}) => {
  const [sourceGameId, setSourceGameId] = useState<string>('valorant');
  const [targetGameId, setTargetGameId] = useState<string>('apex');
  const [inputSens, setInputSens] = useState<number | string>(0.35);
  const [dpi, setDpi] = useState<number | string>(800);
  const [copiedGame, setCopiedGame] = useState<string | null>(null);

  const numSens = useMemo(() => {
    const parsed = typeof inputSens === 'number' ? inputSens : parseFloat(inputSens);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [inputSens]);

  const numDpi = useMemo(() => {
    const parsed = typeof dpi === 'number' ? dpi : parseInt(dpi, 10);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [dpi]);

  const sourceGame = useMemo(() => 
    SUPPORTED_GAMES.find(g => g.id === sourceGameId) || SUPPORTED_GAMES[0],
  [sourceGameId]);

  const targetGame = useMemo(() => 
    SUPPORTED_GAMES.find(g => g.id === targetGameId) || SUPPORTED_GAMES[1],
  [targetGameId]);

  // Calculations
  const metrics = useMemo(() => {
    const degreesPerCount = numSens * sourceGame.yaw;
    if (degreesPerCount <= 0 || numDpi <= 0) {
      return { targetSens: 0, edpi: 0, cm360: 0, inches360: 0, aimType: 'Unknown' };
    }

    const countsPer360 = 360 / degreesPerCount;
    const inches360 = countsPer360 / numDpi;
    const cm360 = inches360 * 2.54;

    const targetSens = degreesPerCount / targetGame.yaw;
    const edpi = numSens * numDpi;

    let aimType = 'Balanced Hybrid';
    if (cm360 >= 50) aimType = 'Ultra Low (Arm Aiming)';
    else if (cm360 >= 35) aimType = 'Tactical Low (Arm/Wrist)';
    else if (cm360 >= 22) aimType = 'Medium Speed (Hybrid)';
    else aimType = 'High Speed (Wrist/Fingertip)';

    return {
      targetSens: Number(targetSens.toFixed(3)),
      rawTargetSens: targetSens.toFixed(4),
      edpi: Math.round(edpi),
      cm360: Number(cm360.toFixed(1)),
      inches360: Number(inches360.toFixed(1)),
      aimType
    };
  }, [numSens, sourceGame, targetGame, numDpi]);

  const handleSwapGames = () => {
    if (metrics.targetSens <= 0) return;
    const currentTargetSens = metrics.targetSens;
    const oldSource = sourceGameId;
    const oldTarget = targetGameId;
    setSourceGameId(oldTarget);
    setTargetGameId(oldSource);
    setInputSens(currentTargetSens);
  };

  // Calculate sensitivity table across all games
  const allGameEquivalents = useMemo(() => {
    const degreesPerCount = numSens * sourceGame.yaw;
    return SUPPORTED_GAMES.map(game => {
      const equivSens = degreesPerCount / game.yaw;
      return {
        ...game,
        sens: Number(equivSens.toFixed(3)),
        edpi: Math.round(equivSens * numDpi)
      };
    });
  }, [numSens, sourceGame, numDpi]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedGame(label);
    setTimeout(() => setCopiedGame(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border border-current border-opacity-10 shadow-2xl relative overflow-hidden ${activeTheme.cardBg}`}>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center">
              <Calculator className="w-3 h-3 mr-1" /> Precision Aim Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Cross-Engine 1:1 Translation
            </span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-black ${activeTheme.textMain}`}>
            Universal Sensitivity & eDPI Converter
          </h1>

          <p className={`text-sm ${activeTheme.textMuted} leading-relaxed`}>
            Maintain 1:1 motor muscle memory across different game engines. Convert mouse sensitivities, calculate physical 360° distance in centimeters/inches, and optimize controller response curves.
          </p>
        </div>
      </div>

      {/* Primary Calculator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Inputs Panel (2 Columns on Desktop) */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border border-current border-opacity-10 space-y-6 ${activeTheme.cardBg}`}>
          <div className="flex items-center justify-between border-b border-current border-opacity-10 pb-4">
            <h3 className={`text-base font-black ${activeTheme.textMain} flex items-center`}>
              <Sliders className="w-4 h-4 mr-2 text-amber-400" /> Convert Settings
            </h3>
            <span className="text-xs text-zinc-400 font-mono">360° Yaw Calibration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Source Game */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Source Game
              </label>
              <select
                value={sourceGameId}
                onChange={(e) => {
                  setSourceGameId(e.target.value);
                  const found = SUPPORTED_GAMES.find(g => g.id === e.target.value);
                  if (found) setInputSens(found.defaultSens);
                }}
                className={`w-full p-3 rounded-2xl bg-black/40 border border-current border-opacity-20 font-bold text-xs ${activeTheme.textMain} focus:border-amber-400 outline-none`}
              >
                {SUPPORTED_GAMES.map(g => (
                  <option key={g.id} value={g.id} className="bg-zinc-900 text-white">
                    {g.name} ({g.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Input Sensitivity */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex justify-between">
                <span>In-Game Sensitivity</span>
                <span className="text-amber-400 font-mono">{inputSens}</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                value={inputSens}
                onChange={(e) => setInputSens(e.target.value)}
                className={`w-full p-3 rounded-2xl bg-black/40 border border-current border-opacity-20 font-mono text-xs ${activeTheme.textMain} focus:border-amber-400 outline-none`}
              />
            </div>

            {/* Target Game */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Target Game
                </label>
                <button
                  type="button"
                  onClick={handleSwapGames}
                  title="Swap Source and Target Game Engine Calibration"
                  className="px-2 py-0.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                >
                  <ArrowRightLeft className="w-3 h-3" /> Swap
                </button>
              </div>
              <select
                value={targetGameId}
                onChange={(e) => setTargetGameId(e.target.value)}
                className={`w-full p-3 rounded-2xl bg-black/40 border border-current border-opacity-20 font-bold text-xs ${activeTheme.textMain} focus:border-amber-400 outline-none`}
              >
                {SUPPORTED_GAMES.map(g => (
                  <option key={g.id} value={g.id} className="bg-zinc-900 text-white">
                    {g.name} ({g.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Mouse DPI Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex justify-between">
                <span>Hardware Mouse DPI</span>
                <span className="text-amber-400 font-mono">{numDpi} DPI</span>
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  {[400, 800, 1200, 1600, 3200].map(presetDpi => (
                    <button
                      key={presetDpi}
                      onClick={() => setDpi(presetDpi)}
                      className={`flex-1 py-2 text-[11px] font-mono font-bold rounded-xl transition-all border ${
                        numDpi === presetDpi
                          ? 'bg-amber-400 text-black border-amber-500 shadow'
                          : 'bg-black/20 dark:bg-white/5 border-current border-opacity-10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {presetDpi}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step="100"
                  min="100"
                  max="32000"
                  value={dpi}
                  onChange={(e) => setDpi(e.target.value)}
                  placeholder="Custom DPI..."
                  className={`w-full p-2.5 rounded-xl bg-black/40 border border-current border-opacity-20 font-mono text-xs ${activeTheme.textMain} focus:border-amber-400 outline-none`}
                />
              </div>
            </div>
          </div>

          {/* Result Highlight Banner */}
          <div className="p-5 rounded-2xl bg-black/50 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Converted Sensitivity for {targetGame.name}
              </span>
              <div className="text-3xl font-mono font-black text-amber-400 mt-0.5">
                {metrics.targetSens}
              </div>
              <span className="text-[11px] text-zinc-400">
                Exact 1:1 match for {sourceGame.name} @ {inputSens}
              </span>
            </div>

            <button
              onClick={() => handleCopy(String(metrics.targetSens), 'target')}
              className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center ${getButtonBgClass(activeTheme)}`}
            >
              {copiedGame === 'target' ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copiedGame === 'target' ? 'Copied Value!' : 'Copy Sensitivity'}
            </button>
          </div>
        </div>

        {/* Calculated Metrics Side Cards */}
        <div className="space-y-4">
          
          {/* Physical Mousepad Distance */}
          <div className={`p-5 rounded-3xl border border-current border-opacity-10 space-y-3 ${activeTheme.cardBg}`}>
            <div className="flex items-center space-x-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Mouse className="w-4 h-4 text-blue-400" />
              <span>Physical 360° Distance</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-black/30 rounded-2xl border border-current border-opacity-10">
                <span className="text-[10px] text-zinc-400 font-mono">Distance (cm)</span>
                <div className="text-2xl font-black font-mono text-blue-400">
                  {metrics.cm360} <span className="text-xs font-normal">cm/360</span>
                </div>
              </div>

              <div className="p-3 bg-black/30 rounded-2xl border border-current border-opacity-10">
                <span className="text-[10px] text-zinc-400 font-mono">Distance (inches)</span>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {metrics.inches360} <span className="text-xs font-normal">in/360</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-bold text-center">
              Profile: {metrics.aimType}
            </div>
          </div>

          {/* eDPI Metric */}
          <div className={`p-5 rounded-3xl border border-current border-opacity-10 space-y-2 ${activeTheme.cardBg}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center">
                <Zap className="w-4 h-4 text-amber-400 mr-1.5" /> Effective DPI (eDPI)
              </span>
              <span className="text-xl font-mono font-black text-amber-400">
                {metrics.edpi}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              eDPI = In-Game Sensitivity × Hardware DPI ({inputSens} × {dpi}). Allows comparing true speed across players using different DPIs.
            </p>
          </div>

        </div>

      </div>

      {/* Multi-Game Comparison Matrix Table */}
      <div className={`p-6 rounded-3xl border border-current border-opacity-10 shadow-2xl space-y-4 ${activeTheme.cardBg}`}>
        <div className="flex items-center justify-between border-b border-current border-opacity-10 pb-4">
          <div>
            <h3 className={`text-base font-black ${activeTheme.textMain}`}>
              Multi-Game Sensitivity Reference Table
            </h3>
            <p className="text-xs text-zinc-400">
              Equivalent sensitivities for all supported games at {dpi} DPI ({metrics.cm360} cm/360°)
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Live Calculations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-current border-opacity-10 text-zinc-400 font-black uppercase tracking-wider">
                <th className="py-3 px-4">Game Title</th>
                <th className="py-3 px-4">Genre / Category</th>
                <th className="py-3 px-4 text-center">Equivalent Sens</th>
                <th className="py-3 px-4 text-center">eDPI (@ {dpi} DPI)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current divide-opacity-5 font-mono">
              {allGameEquivalents.map(game => (
                <tr key={game.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-amber-400">
                    {game.name}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-sans">
                    {game.category}
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-sm text-zinc-200">
                    {game.sens}
                  </td>
                  <td className="py-3.5 px-4 text-center text-zinc-400">
                    {game.edpi}
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => handleCopy(String(game.sens), game.id)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-black/20 dark:bg-white/10 hover:bg-black/30 border border-current border-opacity-10 text-zinc-300"
                    >
                      {copiedGame === game.id ? 'Copied!' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controller Deadzone & Response Curves Guide */}
      <div className={`p-6 sm:p-8 rounded-3xl border border-current border-opacity-10 space-y-6 ${activeTheme.cardBg}`}>
        <div className="flex items-center space-x-3 border-b border-current border-opacity-10 pb-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-lg font-black ${activeTheme.textMain}`}>
              Controller Deadzone & Response Curves Guide
            </h3>
            <p className="text-xs text-zinc-400">
              Optimal thumbstick acceleration curves for gamepad aiming in FPS games
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Linear */}
          <div className="p-5 rounded-2xl bg-black/30 border border-current border-opacity-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs uppercase text-amber-400">Linear Curve</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">1:1 Raw</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Stick deflection translates directly 1:1 to camera rotation speed. Requires precise thumb control and minimal stick drift. Preferred by top Apex Legends & Call of Duty pros.
            </p>
            <div className="text-[11px] font-mono text-zinc-300 bg-black/40 p-2 rounded-xl">
              Recommended Inner Deadzone: <strong>2% - 5%</strong>
            </div>
          </div>

          {/* Exponential */}
          <div className="p-5 rounded-2xl bg-black/30 border border-current border-opacity-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs uppercase text-blue-400">Classic / Exponential</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">Dampened</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Initial stick movements are slow for fine micro-adjustments, accelerating smoothly as you push toward outer edges. Very forgiving for micro-aim.
            </p>
            <div className="text-[11px] font-mono text-zinc-300 bg-black/40 p-2 rounded-xl">
              Recommended Inner Deadzone: <strong>5% - 10%</strong>
            </div>
          </div>

          {/* Dynamic (S-Curve) */}
          <div className="p-5 rounded-2xl bg-black/30 border border-current border-opacity-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs uppercase text-emerald-400">Dynamic (S-Curve)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">Hybrid</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Reverse S-curve providing snappy initial turn acceleration with smooth mid-range control. Excellent for fast target acquisition and 180° flick turns.
            </p>
            <div className="text-[11px] font-mono text-zinc-300 bg-black/40 p-2 rounded-xl">
              Recommended Inner Deadzone: <strong>3% - 7%</strong>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
