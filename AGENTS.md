# GameControl Master — Agent Guidelines & Project Standards

## Project Purpose & Architecture
**GameControl Master** is a high-performance, single-screen React application for video game control mapping, combo practice, esports pro layouts, interactive remapping, and desk cheat sheet generation.

### Core Data Models (`/src/types.ts`)
- **`GameProfile`**: Defines game controls grouped into `categories`, platform mappings (`platformKeys`), and chained mechanics (`combos`).
- **`ProPreset`**: Pro player bindings and settings (e.g. Zen, TenZ, ImperialHal, Daigo) with 1-click apply capabilities.
- **`CustomVariant`**: User remapped key bindings saved per game in `localStorage` (`gc_custom_variants`).
- **`MuscleMemoryMatrix`**: Cross-game control alignment grid comparing universal actions (Crouch, Sprint, Ping, Reload) across titles and detecting muscle memory mismatches.
- **`SensitivityConverter`**: Cross-engine mouse sensitivity translator, eDPI calculator, cm/360° distance metrics, and controller response curve guides.
- **`StreamerMiniDock`**: Compact second-screen mode for streamers and dual-monitor reference with real-time keybinding filter search.
- **`StickerSheetGenerator`**: Print-ready sticker grid generator for keyboard keycaps, macro pads, and 30mm arcade fightstick buttons.
- **`CommunityShareModal`**: Compressed Base64 cloud share codes (`GC-...`) and community preset hub for keybindings, custom variants, and profiles.
- **`TechGuide`**: Step-by-step execution manuals with timing windows and visual cues.
- **`ProfileCompletionStatus`**: Calculated dynamically via `calculateProfileCompletion(profile)` in `/src/utils/completion.ts`.

### Planned Roadmap Features (Under Consideration)
- **Live Gamepad & Keyboard Hardware Tester**: Direct Web Gamepad API connection to test USB/Bluetooth controllers live in-browser (triggers, analog stick deadzones, button presses, N-key rollover).

### Completion Calculation Rules
Profiles achieve **100% Complete & Verified** status (with blue checkmark badge) when:
1. `totalControlsCount >= 8`
2. `totalCombosCount >= 3`
3. Cross-platform support covers all primary platforms (`pc`, `xbox`, `playstation`, `switch`).

### UI & Styling Guidelines
- **Theme Support**: Cyberpunk Yellow, PlayStation Blue, Xbox Emerald, Esports Light.
- **Keycaps**: Rendered with high-contrast font-mono styling and 3D shadow borders (`activeTheme.keycap`). Remapped custom bindings are highlighted in amber (`bg-amber-400 text-black`).
- **No Heavy External Backends**: Designed for lightning-fast client-side interactivity with `localStorage` persistence.
