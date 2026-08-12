# GameControl Master 🎮

An interactive video game control academy, keybinding remapper, esports pro preset gallery, combo trainer, and printable desk cheat sheet generator.

---

## 🌟 Key Features

1. **Game Controls Library**
   - Clean keybindings grouped by category for top titles (*Rocket League, Valorant, Apex Legends, Street Fighter 6, Elden Ring, Helldivers 2*).
   - Cross-platform support for **PC K&M, PS5, Xbox, and Nintendo Switch**.
   - **100% Verified Completion Badges**: Blue checkmark status badges for complete profiles.

2. **Pro Esports Presets Gallery**
   - 1-Click apply world champion setups:
     - **Zen** (Rocket League - RLCS World Champion)
     - **TenZ** (Valorant - VCT Masters Champion)
     - **ImperialHal** (Apex Legends - ALGS Champion)
     - **Daigo "The Beast" Umehara** (Street Fighter 6 Legend)
     - **Let Me Solo Her** (Elden Ring Community Legend)
   - Side-by-side comparison matrix of pro binds versus default controls.

3. **Interactive Remapper & Saved Variants**
   - Rebind any action to custom keys and save personalized variants (e.g. *"Southpaw Layout"*, *"Jake's Tactical Remap"*).
   - Remapped controls are highlighted in high-visibility amber keycaps across the app.

4. **Printable & Image Cheat Sheet Exporter**
   - Generate high-resolution, print-ready desk cheat sheets formatted for side-monitors or physical printing (`Ctrl+P` / `window.print()`).
   - 1-Click copy to plain text or Markdown tables for Discord and notes apps.

5. **Community Sharing & Cloud Backup Codes**
   - Compressed `GC-...` share codes and JSON strings to instantly transfer custom layouts, remapped variants, or game profiles with friends.
   - **Community Presets Hub**: Curated fan-made layouts including *Steam Deck Handheld Paddles*, *Hitbox SOCD Layout*, and *Southpaw FPS Setup*.

6. **Cross-Game Muscle Memory Alignment Matrix**
   - Side-by-side control alignment grid comparing universal intents (*Crouch/Slide, Sprint, Jump, Ping, Primary Attack, Aim/Guard, Reload*) across multiple titles (*Valorant, Apex Legends, Rocket League, Elden Ring, Street Fighter 6*).
   - **Muscle Memory Mismatch Detector**: Automatically identifies conflicting keybindings across your active games to standardize muscle memory.

7. **Global Hotkeys & Full System Backup/Restore**
   - Press `Cmd+K` / `Ctrl+K` for the Command Palette, or `1-8` keys to switch tabs instantly.
   - 1-Click JSON backup export and restore covering custom variants, SRS flashcard progress, streak history, theme preferences, and game profiles.

8. **Universal Sensitivity & eDPI Converter**
   - 1:1 cross-engine mouse sensitivity translator (*Valorant, CS2, Apex Legends, Overwatch 2, Fortnite, Rainbow Six Siege, Call of Duty, Cyberpunk 2077*).
   - eDPI, cm/360° and inches/360° physical mousepad distance calculator with Controller Response Curves & Deadzone Guide.

9. **Dual-Monitor Streamer Mini-Dock View Mode**
   - Ultra-compact floating reference window for second monitors with live instant keycap filter search and platform toggles.

10. **Printable Keycap & Fightstick Sticker Sheet Generator**
   - Print-ready sticker grid generator formatted for standard keyboard keycaps (15mm x 15mm), macro pads, or 30mm arcade fightstick buttons (Hitbox) with dashed cutting guidelines.

11. **Step-by-Step Directions Guide**
   - Execution manuals for complex chained mechanics (*Flip Resets, Speed Flips, Drive Rush Cancels, Guard Counters*).

12. **Interactive Combo Trainer & SRS**
   - Practice muscle memory with real-time keystroke detection and spaced-repetition tracking.

---

## 🗺 Planned Roadmap (Under Consideration)

- [ ] **Live Gamepad & Keyboard Hardware Tester**: Direct Web Gamepad API connection to test USB/Bluetooth controllers live in-browser (triggers, analog stick deadzones, button presses, N-key rollover).

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Persistence**: LocalStorage with export/import backup functionality

---

## 🚀 Development Setup

```bash
npm install
npm run dev
```

To lint and build:
```bash
npm run lint
npm run build
```
