import React, { useState } from 'react';
import { GameProfile, ThemeConfig } from '../types';
import { Edit3, X, Save } from 'lucide-react';

interface EditProfileModalProps {
  activeProfile: GameProfile;
  onSave: (updatedMd: string) => void;
  onClose: () => void;
  activeTheme: ThemeConfig;
  getButtonBgClass: (theme: ThemeConfig) => string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  activeProfile,
  onSave,
  onClose,
  activeTheme,
  getButtonBgClass
}) => {
  const [content, setContent] = useState(activeProfile.md);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] flex flex-col p-6 rounded-3xl shadow-2xl border border-current border-opacity-10 ${activeTheme.cardBg}`}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className={`text-2xl font-black flex items-center ${activeTheme.textMain}`}>
            <Edit3 className={`w-6 h-6 mr-3 ${activeTheme.accent}`} /> Edit Raw Markdown - {activeProfile.name}
          </h3>
          <button onClick={onClose} className={`p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 ${activeTheme.textMuted}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className={`text-xs mb-4 ${activeTheme.textMuted}`}>
          Edit markdown directly using headers (## Category) and bullet points (* `[Button]` Description) to add custom keybindings.
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`flex-1 w-full p-4 rounded-2xl font-mono text-sm border bg-black/5 dark:bg-white/5 border-current border-opacity-20 focus:outline-none mb-6 resize-none ${activeTheme.textMain}`}
          rows={16}
          spellCheck="false"
        />

        <div className="flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase border border-current border-opacity-20 ${activeTheme.textMuted}`}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(content)}
            className={`px-5 py-2.5 flex items-center rounded-xl font-bold text-xs uppercase ${getButtonBgClass(activeTheme)}`}
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
