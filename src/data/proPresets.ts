import { ProPreset } from '../types';

export const PRO_PRESETS: ProPreset[] = [
  // Rocket League Pro Presets
  {
    id: 'pro-zen-rl',
    gameId: 'rocket-league',
    gameName: 'Rocket League',
    proName: 'Zen',
    team: 'Team Vitality',
    role: 'RLCS World Champion & MVP',
    description: 'Zen’s legendary controller layout with Air Roll Left on L1/LB and Powerslide/Free Air Roll paired on L1.',
    platform: 'xbox',
    settingsNote: 'Deadzone: 0.05 | Steering Sens: 1.30 | Aerial Sens: 1.30 | FOV: 110 | Distance: 270',
    bindings: {
      'rl-1': '`RT` (Drive Forward)',
      'rl-2': '`LT` (Brake / Reverse)',
      'rl-4': '`A` (Jump)',
      'rl-5': '`RB` (Boost)',
      'rl-6': '`LB` (Powerslide / Air Roll)',
      'rl-7': '`LB` (Air Roll Left)',
      'rl-8': '`B` (Air Roll Right)',
      'rl-9': '`Y` (Toggle Ball Cam)'
    }
  },
  {
    id: 'pro-squishy-rl',
    gameId: 'rocket-league',
    gameName: 'Rocket League',
    proName: 'SquishyMuffinz',
    team: 'The Guard / Cloud9',
    role: 'RLCS World Champion & Content Creator',
    description: 'Squishy’s classic high-control controller layout optimized for directional air roll flicks.',
    platform: 'playstation',
    settingsNote: 'Deadzone: 0.07 | Steering Sens: 1.25 | Aerial Sens: 1.25 | FOV: 110 | Height: 100',
    bindings: {
      'rl-1': '`R2` (Accelerate)',
      'rl-2': '`L2` (Reverse)',
      'rl-4': '`Cross` (Jump)',
      'rl-5': '`Circle` (Boost)',
      'rl-6': '`L1` (Powerslide / Air Roll)',
      'rl-7': '`Square` (Air Roll Left)',
      'rl-8': '`R1` (Air Roll Right)',
      'rl-9': '`Triangle` (Ball Cam)'
    }
  },

  // Valorant Pro Presets
  {
    id: 'pro-tenz-val',
    gameId: 'valorant',
    gameName: 'Valorant',
    proName: 'TenZ',
    team: 'Sentinels',
    role: 'VCT Masters Champion',
    description: 'TenZ’s hyper-accurate keybinds with Mouse 4/5 for utility and Left Alt for crouching.',
    platform: 'pc',
    settingsNote: 'DPI: 800 | eDPI: 280 (Sens: 0.35) | Scope Sens: 1.0 | Resolution: 1920x1080 16:9',
    bindings: {
      'val-1': '`W A S D` (Movement)',
      'val-2': '`L-Shift` (Walk)',
      'val-3': '`L-Ctrl` / `Mouse 5` (Crouch)',
      'val-4': '`LMB` (Fire Weapon)',
      'val-5': '`RMB` (Aim Down Sights)',
      'val-6': '`Mouse 4` (Ability 1 - Utility)',
      'val-7': '`C` (Ability 2 - Flash/Molly)',
      'val-8': '`E` (Signature Ability)',
      'val-9': '`X` (Ultimate Ability)'
    }
  },
  {
    id: 'pro-asuna-val',
    gameId: 'valorant',
    gameName: 'Valorant',
    proName: 'Asuna',
    team: '100 Thieves',
    role: 'VCT Duelist / Initiator',
    description: 'Asuna’s fast-entry keybindings featuring thumb mouse buttons for aggressive ability cancels.',
    platform: 'pc',
    settingsNote: 'DPI: 1400 | Sens: 0.295 | eDPI: 413 | Crosshairs: Cyan Small Box (1-4-2-2)',
    bindings: {
      'val-1': '`W A S D` (Movement)',
      'val-2': '`L-Shift` (Walk)',
      'val-3': '`L-Ctrl` (Crouch)',
      'val-4': '`LMB` (Primary Fire)',
      'val-5': '`RMB` (ADS / Zoom)',
      'val-6': '`Q` (Ability 1)',
      'val-7': '`E` (Ability 2)',
      'val-8': '`C` (Signature)',
      'val-9': '`X` (Ultimate)'
    }
  },

  // Apex Legends Pro Presets
  {
    id: 'pro-hal-apex',
    gameId: 'apex-legends',
    gameName: 'Apex Legends',
    proName: 'ImperialHal',
    team: 'Team Falcons',
    role: 'ALGS World Champion & "CEO of Apex"',
    description: 'ImperialHal’s claw/paddle controller preset with Crouch on R3 (Button Puncher) for effortless slide jumps.',
    platform: 'xbox',
    settingsNote: '4-3 Linear Look Sens | Response Curve: Linear | FOV: 110 | Button Layout: Button Puncher',
    bindings: {
      'apex-1': '`L-Stick` (Move)',
      'apex-2': '`RS Click` (Crouch Slide)',
      'apex-3': '`A` (Jump / Wall Bounce)',
      'apex-4': '`RT` (Attack / Shoot)',
      'apex-5': '`LT` (Aim Down Sights)',
      'apex-6': '`LB` (Tactical Ability)',
      'apex-7': '`LB + RB` (Ultimate Ability)',
      'apex-8': '`B` (Melee Attack)'
    }
  },
  {
    id: 'pro-genburten-apex',
    gameId: 'apex-legends',
    gameName: 'Apex Legends',
    proName: 'Genburten',
    team: 'DarkZero Esports',
    role: 'ALGS Championship MVP',
    description: 'Genburten’s legendary ALGS controller configuration optimized for zero-deadzone beam recoil control.',
    platform: 'playstation',
    settingsNote: 'ALC (Advanced Look Controls) | Deadzone: 0% | Outer Threshold: 1% | Pitch/Yaw: 500 Max',
    bindings: {
      'apex-1': '`L-Stick` (Move)',
      'apex-2': '`R3` (Crouch / Slide Hold)',
      'apex-3': '`L1` (Jump)',
      'apex-4': '`R2` (Shoot)',
      'apex-5': '`L2` (ADS)',
      'apex-6': '`R1` (Tactical Ability)',
      'apex-7': '`L1 + R1` (Ultimate)',
      'apex-8': '`Circle` (Melee)'
    }
  },

  // Street Fighter 6 Pro Presets
  {
    id: 'pro-daigo-sf6',
    gameId: 'street-fighter-6',
    gameName: 'Street Fighter 6',
    proName: 'Daigo "The Beast" Umehara',
    team: 'Red Bull / Team Beast',
    role: 'Evo Legend & Fighting Game Icon',
    description: 'Daigo’s classic Hitbox leverless layout mapping Drive Rush and Drive Reversal for instant reactions.',
    platform: 'pc',
    settingsNote: 'Layout: Leverless / Hitbox Arcade Stick | Control Scheme: Classic Type 6',
    bindings: {
      'sf6-1': '`A S D Space` (Movement & Jump)',
      'sf6-2': '`U I O` (Light / Medium / Heavy Punch)',
      'sf6-3': '`J K L` (Light / Medium / Heavy Kick)',
      'sf6-4': '`I + K` (Drive Impact)',
      'sf6-5': '`U + J` (Drive Parry / Drive Rush)'
    }
  },
  {
    id: 'pro-punk-sf6',
    gameId: 'street-fighter-6',
    gameName: 'Street Fighter 6',
    proName: 'Punk',
    team: 'FlyQuest',
    role: 'Evo SF6 World Champion',
    description: 'Punk’s controller configuration for hit confirmation and frame-perfect Drive Impact counters.',
    platform: 'playstation',
    settingsNote: 'Pad Layout: PS5 DualSense | Scheme: Classic | Drive Impact mapped to L1',
    bindings: {
      'sf6-1': '`D-Pad / L-Stick` (Movement)',
      'sf6-2': '`Square` / `Triangle` / `R1` (Light / Med / Heavy Punch)',
      'sf6-3': '`Cross` / `Circle` / `R2` (Light / Med / Heavy Kick)',
      'sf6-4': '`L1` (Drive Impact)',
      'sf6-5': '`L2` (Drive Parry)'
    }
  },

  // Elden Ring Pro Preset
  {
    id: 'pro-letmesolo-er',
    gameId: 'elden-ring',
    gameName: 'Elden Ring',
    proName: 'Let Me Solo Her',
    team: 'Community Legend',
    role: 'Malenia Slayer',
    description: 'Optimized dodging and two-handing weapon switches for zero-damage boss clears.',
    platform: 'playstation',
    settingsNote: 'Camera Speed: 8 | Auto Target Lock: OFF | Toggle Two-Handing: Triangle + R1',
    bindings: {
      'er-1': '`L-Stick` (Movement)',
      'er-2': '`Circle` (Dodge Roll / Sprint Hold)',
      'er-3': '`R1` (Light Attack / Weapon Art Combo)',
      'er-4': '`R2` (Charged Heavy Attack)',
      'er-5': '`L2` (Skill / Ashes of War)',
      'er-6': '`L1` (Guard / Off-hand)',
      'er-7': '`R3` (Manual Camera Lock)'
    }
  }
];
