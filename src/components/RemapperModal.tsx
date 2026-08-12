import { useState, useEffect } from 'react';
import { GameProfile, CustomVariant, InputPlatform, ThemeConfig, ControlItem } from '../types';
import { 
  Sliders, Plus, Trash2, Edit3, Save, RotateCcw, 
  Check, Sparkles, AlertCircle, Copy, Download, Upload, Layers
} from 'lucide-react';

interface RemapperModalProps {
  gameProfile: GameProfile;
  platform: InputPlatform;
  activeTheme: ThemeConfig;
  customVariants: CustomVariant[];
  activeVariantId: string | null;
  onSelectVariant: (variantId: string | null) => void;
  onCreateVariant: (variant: CustomVariant) => void;
  onUpdateVariant: (variant: CustomVariant) => void;
  onDeleteVariant: (variantId: string) => void;
  onClose: () => void;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

export function RemapperModal({
  gameProfile,
  platform,
  activeTheme,
  customVariants,
  activeVariantId,
  onSelectVariant,
  onCreateVariant,
  onUpdateVariant,
  onDeleteVariant,
  onClose,
  getButtonBgClass
}: RemapperModalProps) {
  const activeVariant = customVariants.find(v => v.id === activeVariantId) || null;

  const [editingName, setEditingName] = useState(activeVariant?.name || `${gameProfile.name} Custom Layout`);
  const [bindings, setBindings] = useState<Record<string, string>>(() => {
    return activeVariant ? { ...activeVariant.customBindings } : {};
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempBindInput, setTempBindInput] = useState('');
  const [newVariantNameInput, setNewVariantNameInput] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Sync state if activeVariant changes
  useEffect(() => {
    if (activeVariant) {
      setEditingName(activeVariant.name);
      setBindings({ ...activeVariant.customBindings });
    } else {
      setBindings({});
    }
  }, [activeVariantId, activeVariant]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !editingItemId) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingItemId, onClose]);

  const allItems = gameProfile.categories.flatMap(c => c.items);

  const getItemCurrentBinding = (item: ControlItem) => {
    if (bindings[item.id]) return bindings[item.id];
    return item.platformKeys?.[platform] || item.keys;
  };

  const handleSaveCurrentVariant = () => {
    if (!activeVariant) {
      // Create new variant
      const newVar: CustomVariant = {
        id: `variant-${Date.now()}`,
        gameId: gameProfile.id,
        name: editingName.trim() || `${gameProfile.name} Custom`,
        createdAt: Date.now(),
        platform: platform,
        customBindings: bindings
      };
      onCreateVariant(newVar);
    } else {
      // Update existing
      const updated: CustomVariant = {
        ...activeVariant,
        name: editingName.trim(),
        platform: platform,
        customBindings: bindings
      };
      onUpdateVariant(updated);
    }
  };

  const handleCreateNewBlankVariant = () => {
    const newName = newVariantNameInput.trim() || `${gameProfile.name} Custom #${customVariants.length + 1}`;
    const newVar: CustomVariant = {
      id: `variant-${Date.now()}`,
      gameId: gameProfile.id,
      name: newName,
      createdAt: Date.now(),
      platform: platform,
      customBindings: {}
    };
    onCreateVariant(newVar);
    setNewVariantNameInput('');
    setIsCreatingNew(false);
  };

  const handleRebind = (itemId: string, newKey: string) => {
    setBindings(prev => ({
      ...prev,
      [itemId]: newKey
    }));
    setEditingItemId(null);
  };

  const handleResetItemToDefault = (itemId: string) => {
    setBindings(prev => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const handleResetAllToDefault = () => {
    setBindings({});
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`max-w-4xl w-full rounded-3xl border border-current border-opacity-20 p-6 sm:p-8 shadow-2xl space-y-6 ${activeTheme.cardBg} max-h-[92vh] flex flex-col justify-between overflow-hidden`}>
        
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current border-opacity-10 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${activeTheme.accent} bg-amber-500/10`}>
                Interactive Remapper
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {gameProfile.name} ({platform.toUpperCase()})
              </span>
            </div>
            <h2 className={`text-2xl font-black ${activeTheme.textMain}`}>
              Custom Layout & Keybinding Remapper
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-black/20 dark:bg-white/10 hover:bg-black/30 ${activeTheme.textMain}"
            >
              Close
            </button>
          </div>
        </div>

        {/* Variant Selector Bar */}
        <div className="p-4 rounded-2xl bg-black/20 dark:bg-white/5 border border-current border-opacity-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => onSelectVariant(null)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeVariantId === null
                  ? `${getButtonBgClass(activeTheme)} shadow-md`
                  : `text-zinc-400 hover:text-white hover:bg-black/10 dark:hover:bg-white/10`
              }`}
            >
              Default Controls
            </button>

            {customVariants.map(variant => (
              <div key={variant.id} className="flex items-center">
                <button
                  onClick={() => onSelectVariant(variant.id)}
                  className={`px-3.5 py-2 rounded-r-none rounded-l-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeVariantId === variant.id
                      ? `${getButtonBgClass(activeTheme)} shadow-md`
                      : `text-zinc-400 hover:text-white hover:bg-black/10 dark:hover:bg-white/10`
                  }`}
                >
                  {variant.name}
                </button>
                <button
                  onClick={() => onDeleteVariant(variant.id)}
                  className="px-2 py-2 rounded-r-xl text-xs text-rose-400 hover:bg-rose-500/20 bg-black/20 dark:bg-white/10"
                  title="Delete Custom Variant"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Create New Variant Button */}
          {!isCreatingNew ? (
            <button
              onClick={() => setIsCreatingNew(true)}
              className={`px-3.5 py-2 rounded-xl font-black text-xs uppercase flex items-center bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20`}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> New Custom Preset
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Layout name..."
                value={newVariantNameInput}
                onChange={e => setNewVariantNameInput(e.target.value)}
                className={`px-3 py-1.5 rounded-xl border bg-black/20 border-current border-opacity-20 text-xs font-bold ${activeTheme.textMain}`}
              />
              <button
                onClick={handleCreateNewBlankVariant}
                className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500 text-black uppercase"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Layout Name Input */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs font-black uppercase text-zinc-400">Variant Name:</span>
            <input
              type="text"
              value={editingName}
              onChange={e => setEditingName(e.target.value)}
              className={`flex-1 px-3 py-1.5 rounded-xl border bg-black/10 dark:bg-white/5 border-current border-opacity-20 text-xs font-bold ${activeTheme.textMain}`}
            />
          </div>

          <button
            onClick={handleResetAllToDefault}
            className="text-xs font-bold text-zinc-400 hover:text-amber-400 flex items-center"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset All Binds
          </button>
        </div>

        {/* Remapping Table */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 max-h-[420px]">
          {gameProfile.categories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-3">
              <h4 className={`text-xs font-black uppercase tracking-widest text-amber-400 border-b border-current border-opacity-10 pb-1`}>
                {category.name}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category.items.map(item => {
                  const currentBind = getItemCurrentBinding(item);
                  const isCustomized = Boolean(bindings[item.id]);
                  const isEditingThis = editingItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCustomized
                          ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                          : 'bg-black/10 dark:bg-white/5 border-current border-opacity-10'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-bold block truncate ${activeTheme.textMain}`}>
                          {item.description}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          Default: {item.platformKeys?.[platform] || item.keys}
                        </span>
                      </div>

                      {/* Binding Key Input or Button */}
                      {!isEditingThis ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItemId(item.id);
                              setTempBindInput(currentBind);
                            }}
                            className={`px-2.5 py-1 text-xs font-mono font-black rounded uppercase shadow-sm transition-transform hover:scale-105 ${
                              isCustomized
                                ? 'bg-amber-400 text-black'
                                : activeTheme.keycap
                            }`}
                          >
                            {currentBind}
                          </button>

                          {isCustomized && (
                            <button
                              onClick={() => handleResetItemToDefault(item.id)}
                              className="text-zinc-500 hover:text-rose-400 text-xs p-1"
                              title="Reset to default"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={tempBindInput}
                            onChange={e => setTempBindInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                handleRebind(item.id, tempBindInput);
                              } else if (e.key === 'Escape') {
                                setEditingItemId(null);
                              }
                            }}
                            autoFocus
                            className="w-24 px-2 py-1 text-xs font-mono font-bold rounded bg-black text-amber-400 border border-amber-400 focus:outline-none"
                            placeholder="Type bind..."
                          />
                          <button
                            onClick={() => handleRebind(item.id, tempBindInput)}
                            className="px-2 py-1 bg-amber-400 text-black text-xs font-bold rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-current border-opacity-10 flex items-center justify-between">
          <p className="text-xs text-zinc-400">
            {Object.keys(bindings).length} custom remapped key bindings.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveCurrentVariant}
              className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase shadow-xl flex items-center ${getButtonBgClass(activeTheme)}`}
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Remapped Layout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
