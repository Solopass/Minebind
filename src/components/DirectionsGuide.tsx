import { useState, useMemo } from 'react';
import { TechGuide, InputPlatform, ThemeConfig, GameProfile } from '../types';
import { TECH_GUIDES } from '../data/techGuides';
import { 
  BookOpen, Search, Sparkles, AlertCircle, CheckCircle2, 
  Layers, ChevronRight, Zap, Target, Award, PlayCircle, Flame, ArrowRight 
} from 'lucide-react';

interface DirectionsGuideProps {
  profiles: GameProfile[];
  activeProfileId: string;
  onSelectGameProfile: (profileId: string) => void;
  platform: InputPlatform;
  activeTheme: ThemeConfig;
  getButtonBgClass: (theme: ThemeConfig) => string;
  onLaunchTrainerForCombo?: (gameId: string, comboName: string, sequence: string) => void;
}

export function DirectionsGuide({
  profiles,
  activeProfileId,
  onSelectGameProfile,
  platform,
  activeTheme,
  getButtonBgClass,
  onLaunchTrainerForCombo
}: DirectionsGuideProps) {
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuideId, setSelectedGuideId] = useState<string>(TECH_GUIDES[0]?.id || '');

  // Filtered Guides
  const filteredGuides = useMemo(() => {
    return TECH_GUIDES.filter(guide => {
      const matchesGame = selectedGameFilter === 'all' || guide.gameId === selectedGameFilter;
      const matchesDiff = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
      const matchesQuery = !searchQuery.trim() || 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.gameName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGame && matchesDiff && matchesQuery;
    });
  }, [selectedGameFilter, selectedDifficulty, searchQuery]);

  const activeGuide = useMemo(() => {
    return TECH_GUIDES.find(g => g.id === selectedGuideId) || filteredGuides[0] || TECH_GUIDES[0];
  }, [selectedGuideId, filteredGuides]);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Advanced':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Pro Master':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-black animate-pulse';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border border-current border-opacity-10 shadow-2xl relative overflow-hidden ${activeTheme.cardBg}`}>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-current border-opacity-20 ${activeTheme.accent}`}>
              Interactive Execution Manual
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Instructions
            </span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-black ${activeTheme.textMain}`}>
            Complex Keybinds & Chained Mechanics Guide
          </h1>

          <p className={`text-sm ${activeTheme.textMuted} leading-relaxed`}>
            Step-by-step simple instructions for high-skill video game techniques — from Rocket League Flip Resets and Speed Flips to Street Fighter Drive Rush cancels and Elden Ring Guard Counters.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border border-current border-opacity-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${activeTheme.cardBg}`}>
        
        {/* Game Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setSelectedGameFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedGameFilter === 'all'
                ? `${getButtonBgClass(activeTheme)} shadow-md`
                : `${activeTheme.textMuted} hover:${activeTheme.textMain} hover:bg-black/5 dark:hover:bg-white/5`
            }`}
          >
            All Games ({TECH_GUIDES.length})
          </button>

          {profiles.map(p => {
            const count = TECH_GUIDES.filter(g => g.gameId === p.id).length;
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

        {/* Search & Difficulty Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              placeholder="Search instructions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl border bg-black/5 dark:bg-white/5 border-current border-opacity-20 text-xs font-bold focus:outline-none ${activeTheme.textMain}`}
            />
            <Search className={`absolute left-3 top-2.5 w-3.5 h-3.5 ${activeTheme.textMuted}`} />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className={`px-3 py-2 rounded-xl border bg-black/5 dark:bg-white/5 border-current border-opacity-20 text-xs font-bold focus:outline-none ${activeTheme.textMain}`}
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Pro Master">Pro Master</option>
          </select>
        </div>
      </div>

      {/* Main Split Layout: Guide List & Full Instruction View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Tech Guides List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className={`text-xs font-black uppercase tracking-widest px-2 ${activeTheme.textMuted}`}>
            Available Guides ({filteredGuides.length})
          </h3>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredGuides.map(guide => {
              const isSelected = activeGuide.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuideId(guide.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? `${activeTheme.cardBg} border-amber-500/50 shadow-xl ring-2 ring-amber-500/20`
                      : `${activeTheme.cardBg} border-current border-opacity-10 hover:border-opacity-30 opacity-80 hover:opacity-100`
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      {guide.gameName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getDifficultyBadge(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                  </div>

                  <h4 className={`font-black text-sm mb-1 ${activeTheme.textMain}`}>
                    {guide.title}
                  </h4>

                  <p className={`text-xs line-clamp-2 ${activeTheme.textMuted}`}>
                    {guide.summary}
                  </p>

                  <div className="mt-3 pt-2 border-t border-current border-opacity-10 flex items-center justify-between text-[11px]">
                    <span className={`font-semibold ${activeTheme.textMuted}`}>
                      {guide.steps.length} Steps
                    </span>
                    <span className={`flex items-center font-bold ${isSelected ? activeTheme.accent : activeTheme.textMuted}`}>
                      View Directions <ChevronRight className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredGuides.length === 0 && (
              <div className={`p-8 text-center rounded-2xl border border-current border-opacity-10 ${activeTheme.cardBg}`}>
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                <p className="text-xs font-bold text-zinc-400">
                  No execution guides found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Instructions Card */}
        {activeGuide && (
          <div className={`lg:col-span-7 rounded-3xl border border-current border-opacity-10 p-6 sm:p-8 shadow-2xl space-y-6 ${activeTheme.cardBg}`}>
            
            {/* Guide Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${activeTheme.accent} bg-amber-500/10`}>
                    {activeGuide.gameName}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyBadge(activeGuide.difficulty)}`}>
                    {activeGuide.difficulty}
                  </span>
                </div>

                {onLaunchTrainerForCombo && (
                  <button
                    onClick={() => {
                      const firstStepKey = activeGuide.steps.map(s => s.keyInput).join(' -> ');
                      onLaunchTrainerForCombo(activeGuide.gameId, activeGuide.title, firstStepKey);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase flex items-center shadow-lg transition-transform hover:scale-105 ${getButtonBgClass(activeTheme)}`}
                  >
                    <PlayCircle className="w-3.5 h-3.5 mr-1.5" /> Practice In Trainer
                  </button>
                )}
              </div>

              <h2 className={`text-2xl sm:text-3xl font-black ${activeTheme.textMain}`}>
                {activeGuide.title}
              </h2>

              <p className={`mt-2 text-sm leading-relaxed ${activeTheme.textMuted}`}>
                {activeGuide.summary}
              </p>
            </div>

            {/* Prerequisites */}
            {activeGuide.prerequisites && activeGuide.prerequisites.length > 0 && (
              <div className="p-4 rounded-2xl bg-black/10 dark:bg-white/5 border border-current border-opacity-10">
                <h4 className={`text-xs font-black uppercase tracking-wider mb-2 flex items-center ${activeTheme.textMain}`}>
                  <Target className="w-4 h-4 mr-2 text-amber-400" /> Prerequisites & Setup Requirements
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400">
                  {activeGuide.prerequisites.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step by Step Execution Instructions */}
            <div className="space-y-4">
              <h3 className={`text-sm font-black uppercase tracking-widest flex items-center ${activeTheme.textMain}`}>
                <Layers className={`w-4 h-4 mr-2 ${activeTheme.accent}`} /> Step-by-Step Execution Sequence
              </h3>

              <div className="space-y-3">
                {activeGuide.steps.map((step) => (
                  <div 
                    key={step.stepNumber}
                    className="p-4 rounded-2xl bg-black/20 dark:bg-white/5 border border-current border-opacity-10 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-black bg-amber-400 shadow-md`}>
                          {step.stepNumber}
                        </span>
                        <h4 className={`font-black text-sm ${activeTheme.textMain}`}>
                          {step.instruction}
                        </h4>
                      </div>

                      <kbd className={`px-2.5 py-1 text-xs font-mono font-black rounded uppercase shadow-sm ${activeTheme.keycap}`}>
                        {step.keyInput}
                      </kbd>
                    </div>

                    <div className="ml-10 space-y-1">
                      <p className="text-xs text-amber-200/90 font-medium">
                        ⏱ <strong>Timing Window:</strong> {step.timing}
                      </p>
                      {step.visualTip && (
                        <p className="text-xs text-zinc-400 italic">
                          💡 <strong>Visual Cue:</strong> {step.visualTip}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Pitfalls & Mistakes */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" /> Common Pitfalls to Avoid
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-rose-200/80">
                {activeGuide.commonMistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>

            {/* Pro Tip */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start">
              <Zap className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                  Pro Mastery Tip
                </h4>
                <p className="mt-0.5 text-xs text-amber-100/90 leading-relaxed">
                  {activeGuide.proTip}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
