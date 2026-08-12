import { useState, useEffect } from 'react';
import { GameProfile, InputPlatform, ThemeConfig, CustomVariant } from '../types';
import { 
  Printer, Copy, Check, Download, FileText, 
  Gamepad2, Sparkles, CheckCircle2, ShieldCheck, ArrowDownToLine 
} from 'lucide-react';

interface CheatSheetExporterModalProps {
  gameProfile: GameProfile;
  platform: InputPlatform;
  activeTheme: ThemeConfig;
  activeVariant?: CustomVariant | null;
  onClose: () => void;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

export function CheatSheetExporterModal({
  gameProfile,
  platform,
  activeTheme,
  activeVariant,
  onClose,
  getButtonBgClass
}: CheatSheetExporterModalProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Generate plain text summary
  const generateTextCheatSheet = () => {
    let output = `=================================================\n`;
    output += `   ${gameProfile.name.toUpperCase()} CONTROLS CHEAT SHEET (${platform.toUpperCase()})\n`;
    if (activeVariant) {
      output += `   Variant: ${activeVariant.name}\n`;
    }
    output += `=================================================\n\n`;

    gameProfile.categories.forEach(cat => {
      output += `[ ${cat.name.toUpperCase()} ]\n`;
      cat.items.forEach(item => {
        const bind = activeVariant?.customBindings[item.id] || item.platformKeys?.[platform] || item.keys;
        output += ` • ${item.description.padEnd(30, ' ')} : ${bind}\n`;
      });
      output += `\n`;
    });

    if (gameProfile.combos && gameProfile.combos.length > 0) {
      output += `[ ICONIC COMBOS & SEQUENCES ]\n`;
      gameProfile.combos.forEach(c => {
        const seq = c.platformSequences?.[platform] || c.sequence;
        output += ` • ${c.name}: ${seq}\n`;
        output += `   Note: ${c.description}\n\n`;
      });
    }

    return output;
  };

  // Generate Markdown table summary
  const generateMarkdownTable = () => {
    let output = `# ${gameProfile.name} Controls (${platform.toUpperCase()})\n\n`;
    if (activeVariant) {
      output += `> Layout Variant: **${activeVariant.name}**\n\n`;
    }

    gameProfile.categories.forEach(cat => {
      output += `### ${cat.name}\n`;
      output += `| Action | Key / Button |\n`;
      output += `| :--- | :--- |\n`;
      cat.items.forEach(item => {
        const bind = activeVariant?.customBindings[item.id] || item.platformKeys?.[platform] || item.keys;
        output += `| ${item.description} | \`${bind.replace(/`/g, '')}\` |\n`;
      });
      output += `\n`;
    });

    return output;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateTextCheatSheet());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownTable());
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cheat-sheet, #printable-cheat-sheet * {
            visibility: visible;
          }
          #printable-cheat-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className={`max-w-4xl w-full rounded-3xl border border-current border-opacity-20 p-6 sm:p-8 shadow-2xl space-y-6 ${activeTheme.cardBg} max-h-[92vh] flex flex-col justify-between overflow-hidden`}>
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-current border-opacity-10 pb-4 no-print">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10`}>
                Print & Export Studio
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {gameProfile.name} ({platform.toUpperCase()})
              </span>
            </div>
            <h2 className={`text-2xl font-black ${activeTheme.textMain}`}>
              Desk Cheat Sheet & Export
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-black/20 dark:bg-white/10 hover:bg-black/30 text-zinc-300 flex items-center"
            >
              {copiedText ? (
                <><Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Copied Text</>
              ) : (
                <><FileText className="w-3.5 h-3.5 mr-1.5" /> Copy Text</>
              )}
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-black/20 dark:bg-white/10 hover:bg-black/30 text-zinc-300 flex items-center"
            >
              {copiedMarkdown ? (
                <><Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Copied Markdown</>
              ) : (
                <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy MD Table</>
              )}
            </button>

            <button
              onClick={handlePrint}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center shadow-lg ${getButtonBgClass(activeTheme)}`}
            >
              <Printer className="w-4 h-4 mr-1.5" /> Print / Save PDF
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Cheat Sheet Paper Preview */}
        <div 
          id="printable-cheat-sheet"
          className="flex-1 overflow-y-auto pr-2 space-y-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                  {gameProfile.genre}
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  • {gameProfile.developer}
                </span>
              </div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
                {gameProfile.name}
              </h1>
              {activeVariant && (
                <p className="text-xs font-bold text-amber-500 mt-1">
                  Custom Variant: {activeVariant.name}
                </p>
              )}
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                {platform.toUpperCase()} Layout
              </span>
              <p className="text-[10px] font-mono text-zinc-400 mt-1">
                Generated via GameControl Master
              </p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameProfile.categories.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 border-b border-zinc-200 dark:border-zinc-800 pb-1">
                  {cat.name}
                </h3>

                <div className="space-y-1.5">
                  {cat.items.map(item => {
                    const bind = activeVariant?.customBindings[item.id] || item.platformKeys?.[platform] || item.keys;
                    return (
                      <div key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-zinc-100 dark:border-zinc-900">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                          {item.description}
                        </span>
                        <kbd className="px-2 py-0.5 text-[11px] font-mono font-black rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                          {bind}
                        </kbd>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Combos callout if exists */}
          {gameProfile.combos && gameProfile.combos.length > 0 && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Chained Mechanics & Combos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gameProfile.combos.map((combo, i) => (
                  <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">
                        {combo.name}
                      </span>
                      {combo.difficulty && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {combo.difficulty}
                        </span>
                      )}
                    </div>
                    <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 block mb-1">
                      {combo.platformSequences?.[platform] || combo.sequence}
                    </kbd>
                    <p className="text-[10px] text-zinc-500 leading-tight">
                      {combo.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-xs text-zinc-400 no-print">
          Click <strong className="text-amber-400">Print / Save PDF</strong> to print directly or download as a PDF document.
        </div>

      </div>
    </div>
  );
}
