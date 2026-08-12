import { GameProfile } from '../types';

export const INITIAL_GAME_PROFILES: GameProfile[] = [
  {
    id: 'rocket-league',
    name: 'Rocket League',
    genre: 'Sports',
    developer: 'Psyonix',
    platformSupport: ['pc', 'xbox', 'playstation', 'switch'],
    defaultPlatform: 'xbox',
    md: `# Rocket League
## Driving & Aerial Basics
* \`RT\` / \`R2\` / \`W\` Accelerate / Drive Forward
* \`LT\` / \`L2\` / \`S\` Reverse / Brake
* \`A\` / \`Cross\` / \`Space\` Jump / Dodge Flip
* \`B\` / \`Circle\` / \`L-Shift\` Rocket Boost
* \`X\` / \`Square\` / \`Shift\` Powerslide / Air Roll
* \`LB\` / \`L1\` / \`Q\` Air Roll Left
* \`RB\` / \`R1\` / \`E\` Air Roll Right

## Camera & Utility
* \`Y\` / \`Triangle\` / \`Space\` Toggle Ball Camera / Car Camera
* \`RS\` / \`R-Stick\` / \`Mouse\` Rearview / Look Around
* \`Back\` / \`Touchpad\` / \`Tab\` Scoreboard

## Advanced High-Skill Mechanics (Combos)
* \`Fast Aerial\` Pitch Back + Jump + Boost -> Release Pitch -> Jump
* \`Half Flip\` Backflip -> Cancel Flip Up -> Air Roll Left 180°
* \`Speed Flip\` Diagonal Front Flip -> Cancel Downwards + Hold Boost
* \`Flip Reset\` Hit Ball -> Touch 4 Wheels to Ball -> Flip into Goal
* \`Musty Flick\` Pitch Back >90° -> Backflip Forward Vector
* \`Wave Dash\` Jump -> Tilt Back -> Dodge Forward at Ground Touch`,
    categories: [
      {
        name: 'Driving & Vehicle Control',
        items: [
          { id: 'rl-1', description: 'Drive Forward / Accelerate', keys: '`RT` / `R2` / `W`', platformKeys: { xbox: '`RT`', playstation: '`R2`', pc: '`W`', switch: '`ZR`' } },
          { id: 'rl-2', description: 'Brake / Reverse', keys: '`LT` / `L2` / `S`', platformKeys: { xbox: '`LT`', playstation: '`L2`', pc: '`S`', switch: '`ZL`' } },
          { id: 'rl-3', description: 'Steer / Pitch / Yaw', keys: '`L-Stick` / `A D`', platformKeys: { xbox: '`L-Stick`', playstation: '`L-Stick`', pc: '`A D`', switch: '`L-Stick`' } },
          { id: 'rl-4', description: 'Jump / In-Air Flip Dodge', keys: '`A` / `Cross` / `Space`', platformKeys: { xbox: '`A`', playstation: '`Cross`', pc: '`Space`', switch: '`B`' } },
          { id: 'rl-5', description: 'Rocket Boost', keys: '`B` / `Circle` / `Shift`', platformKeys: { xbox: '`B`', playstation: '`Circle`', pc: '`Shift`', switch: '`A`' } },
          { id: 'rl-6', description: 'Powerslide / Free Air Roll', keys: '`X` / `Square` / `Shift`', platformKeys: { xbox: '`X`', playstation: '`Square`', pc: '`Shift`', switch: '`Y`' } },
          { id: 'rl-7', description: 'Directional Air Roll Left', keys: '`LB` / `L1` / `Q`', platformKeys: { xbox: '`LB`', playstation: '`L1`', pc: '`Q`', switch: '`L`' } },
          { id: 'rl-8', description: 'Directional Air Roll Right', keys: '`RB` / `R1` / `E`', platformKeys: { xbox: '`RB`', playstation: '`R1`', pc: '`E`', switch: '`R`' } }
        ]
      },
      {
        name: 'Camera & Interface Utility',
        items: [
          { id: 'rl-9', description: 'Toggle Ball Camera', keys: '`Y` / `Triangle` / `Space`', platformKeys: { xbox: '`Y`', playstation: '`Triangle`', pc: '`Space`', switch: '`X`' } },
          { id: 'rl-10', description: 'Rear View Camera', keys: '`R3` / `R-Stick Click` / `Middle Click`', platformKeys: { xbox: '`RS Click`', playstation: '`R3`', pc: '`MMB`', switch: '`R3`' } },
          { id: 'rl-11', description: 'Scoreboard / Quick Chat', keys: '`Select` / `Touchpad` / `Tab`', platformKeys: { xbox: '`View`', playstation: '`Touchpad`', pc: '`Tab`', switch: '`Minus`' } }
        ]
      }
    ],
    combos: [
      {
        name: 'Fast Aerial Launch',
        sequence: 'Pitch Back -> Jump + Boost -> Release Pitch -> Jump Again',
        description: 'Launches car into high aerials much faster than standard jumping.',
        difficulty: 'Intermediate',
        timingNote: '0.2s window between first and second jump while holding boost continuously.',
        platformSequences: {
          xbox: 'LS Down -> A + B -> Release LS -> A',
          playstation: 'LS Down -> Cross + Circle -> Release LS -> Cross',
          pc: 'S -> Space + Shift -> Release S -> Space',
          switch: 'LS Down -> B + A -> Release LS -> B'
        }
      },
      {
        name: 'Half Flip (Quick Recovery Turn)',
        sequence: 'Backflip -> Push Stick UP (Cancel Flip) -> Air Roll Left/Right 180°',
        description: 'Instant 180-degree turn while maintaining backward momentum.',
        difficulty: 'Intermediate',
        timingNote: 'Cancel flip when car is upside down (50% through backflip animation).',
        platformSequences: {
          xbox: 'LS Down + A (x2) -> Immediately LS UP -> LB (Air Roll Left)',
          playstation: 'LS Down + Cross (x2) -> Immediately LS UP -> L1 (Air Roll Left)',
          pc: 'S + Space (x2) -> Immediately W -> Q',
          switch: 'LS Down + B (x2) -> Immediately LS UP -> L'
        }
      },
      {
        name: 'Speed Flip (Kickoff & Fast Sprint)',
        sequence: 'Diagonal Front Flip -> Pull Stick DOWN (Cancel) + Hold Boost throughout',
        description: 'The fastest movement technique in Rocket League for kickoffs and field traversal.',
        difficulty: 'Advanced',
        timingNote: 'Cancel flip within 50 milliseconds of pressing second jump.',
        platformSequences: {
          xbox: 'LS Up-Left + A (x2) -> Pull LS Down-Right + Hold B',
          playstation: 'LS Up-Left + Cross (x2) -> Pull LS Down-Right + Hold Circle',
          pc: 'W+A + Space (x2) -> Pull S + Hold Shift',
          switch: 'LS Up-Left + B (x2) -> Pull LS Down-Right + Hold A'
        }
      },
      {
        name: 'Flip Reset (Unlimited Aerial Flip)',
        sequence: 'Air Roll Under Ball -> Touch All 4 Wheels to Ball -> Dodge Flip into Net',
        description: 'Touches car undercarriage to ball surface in mid-air to reset the jump timer.',
        difficulty: 'Pro Master',
        timingNote: 'Ball must make clean simultaneous contact with all four tires.',
        platformSequences: {
          xbox: 'Boost to Ball -> LB Air Roll upside down -> Contact Ball -> A Dodge',
          playstation: 'Boost to Ball -> L1 Air Roll upside down -> Contact Ball -> Cross Dodge',
          pc: 'Shift Boost -> Q Air Roll -> Touch Ball -> Space Dodge',
          switch: 'A Boost -> L Air Roll -> Touch Ball -> B Dodge'
        }
      },
      {
        name: 'Musty Flick (Surprise Power Shot)',
        sequence: 'Tilt Car Nose Past 90° Back -> Backflip (Generates Explosive Forward Force)',
        description: 'Leverages car rotational physics to flick ball forward at extreme speeds.',
        difficulty: 'Advanced',
        timingNote: 'Ensure car nose passes 90 degrees back before executing backflip.',
        platformSequences: {
          xbox: 'Pitch Nose Down -> LS Back past 90° -> A Backflip',
          playstation: 'Pitch Nose Down -> LS Back past 90° -> Cross Backflip',
          pc: 'S Tilt -> Pull S past 90° -> Space Backflip',
          switch: 'LS Back past 90° -> B Backflip'
        }
      },
      {
        name: 'Wave Dash (Ground Speed Burst)',
        sequence: 'Small Jump -> Tilt Nose Up -> Dodge Forward as Rear Wheels Touch Ground',
        description: 'Gains instant flip speed without committing car to full air rotation.',
        difficulty: 'Intermediate',
        timingNote: 'Trigger front dodge at the precise millisecond rear tires touch turf.',
        platformSequences: {
          xbox: 'Tap A -> Tilt LS Back -> LS Forward + A as wheels touch',
          playstation: 'Tap Cross -> Tilt LS Back -> LS Forward + Cross as wheels touch',
          pc: 'Tap Space -> S -> W + Space as wheels touch',
          switch: 'Tap B -> Tilt LS Back -> LS Forward + B as wheels touch'
        }
      }
    ]
  },
  {
    id: 'elden-ring',
    name: 'Elden Ring',
    genre: 'Action RPG',
    developer: 'FromSoftware',
    platformSupport: ['pc', 'xbox', 'playstation'],
    defaultPlatform: 'playstation',
    md: `# Elden Ring
## Basic Movement & Navigation
* \`L-Stick\` / \`W A S D\` Walk / Run
* \`R-Stick\` / \`Mouse\` Camera Control / Lock-On (\`R3\` / \`MMB\`)
* \`Circle\` / \`B\` / \`Space\` Dodge Roll / Backstep / Sprint (Hold)
* \`Cross\` / \`A\` / \`F\` Jump

## Combat & Weapon Stances
* \`R1\` / \`RB\` / \`LMB\` Light Attack
* \`R2\` / \`RT\` / \`Shift+LMB\` Heavy Attack / Charge Attack
* \`L1\` / \`LB\` / \`RMB\` Guard / Left Hand Weapon
* \`L2\` / \`LT\` / \`Shift+RMB\` Skill / Ash of War
* \`Triangle+R1\` / \`Y+RB\` / \`E+LMB\` Two-Hand Right Weapon
* \`Triangle+L1\` / \`Y+LB\` / \`E+RMB\` Two-Hand Left Weapon

## Advanced Guard & Parry Mechanics
* \`Guard Counter\` Block Hit (L1) -> Charge Heavy (R2)
* \`Parry & Riposte\` Shield Skill (L2) -> Walk Close -> Light Attack (R1)
* \`Power Stance\` Dual-Wield Same Weapon Class -> L1 Light Attack Chain

## Quick Pouch Shortcuts
* \`Triangle + Up-D-Pad\` / \`E + 1\` Call Torrent Steed
* \`Triangle + Down-D-Pad\` / \`E + 2\` Crimson Flask
* \`Triangle + Left-D-Pad\` / \`E + 3\` Cerulean Flask`,
    categories: [
      {
        name: 'Basic Movement & Navigation',
        items: [
          { id: 'er-1', description: 'Move / Walk / Run', keys: '`L-Stick` / `W A S D`', platformKeys: { pc: '`W A S D`', xbox: '`L-Stick`', playstation: '`L-Stick`', switch: '`L-Stick`' } },
          { id: 'er-2', description: 'Camera Control / Target Lock', keys: '`R3` / `MMB`', platformKeys: { pc: '`MMB`', xbox: '`RS Click`', playstation: '`R3`', switch: '`R3`' } },
          { id: 'er-3', description: 'Dodge Roll / Backstep / Sprint (Hold)', keys: '`Circle` / `B` / `Space`', platformKeys: { pc: '`Space`', xbox: '`B`', playstation: '`Circle`', switch: '`A`' } },
          { id: 'er-4', description: 'Jump', keys: '`Cross` / `A` / `F`', platformKeys: { pc: '`F`', xbox: '`A`', playstation: '`Cross`', switch: '`B`' } }
        ]
      },
      {
        name: 'Combat & Weapon Stances',
        items: [
          { id: 'er-5', description: 'Light Attack', keys: '`R1` / `RB` / `LMB`', platformKeys: { pc: '`LMB`', xbox: '`RB`', playstation: '`R1`', switch: '`R`' } },
          { id: 'er-6', description: 'Heavy Attack / Charged Strike', keys: '`R2` / `RT` / `Shift+LMB`', platformKeys: { pc: '`Shift+LMB`', xbox: '`RT`', playstation: '`R2`', switch: '`ZR`' } },
          { id: 'er-7', description: 'Block / Guard / Left Hand Action', keys: '`L1` / `LB` / `RMB`', platformKeys: { pc: '`RMB`', xbox: '`LB`', playstation: '`L1`', switch: '`L`' } },
          { id: 'er-8', description: 'Ash of War Weapon Skill', keys: '`L2` / `LT` / `Shift+RMB`', platformKeys: { pc: '`Shift+RMB`', xbox: '`LT`', playstation: '`L2`', switch: '`ZL`' } },
          { id: 'er-9', description: 'Two-Hand Weapon Toggle', keys: '`Triangle+R1` / `Y+RB` / `E+LMB`', platformKeys: { pc: '`E+LMB`', xbox: '`Y+RB`', playstation: '`Triangle+R1`', switch: '`X+R`' } }
        ]
      },
      {
        name: 'Utility & Pouch Items',
        items: [
          { id: 'er-10', description: 'Use Selected Item (Flasks)', keys: '`Square` / `X` / `R`', platformKeys: { pc: '`R`', xbox: '`X`', playstation: '`Square`', switch: '`Y`' } },
          { id: 'er-11', description: 'Quick Pouch Mount Torrent', keys: '`Hold Triangle + Up-D-Pad`', platformKeys: { pc: '`E+1`', xbox: '`Hold Y + Up`', playstation: '`Hold Triangle + Up`', switch: '`Hold X + Up`' } },
          { id: 'er-12', description: 'Cycle Quick Items', keys: '`Down-D-Pad` / `Down-Arrow`', platformKeys: { pc: '`Down Arrow`', xbox: '`Down D-Pad`', playstation: '`Down D-Pad`', switch: '`Down D-Pad`' } }
        ]
      }
    ],
    combos: [
      {
        name: 'Guard Counter',
        sequence: 'Block Enemy Attack (L1) -> Charge Heavy Attack (R2)',
        description: 'Delivers a heavy stance-breaking attack immediately after blocking an enemy blow.',
        difficulty: 'Beginner',
        timingNote: 'Press heavy attack immediately upon hearing the metallic shield impact chime.',
        platformSequences: {
          playstation: 'Hold L1 -> R2 immediately after impact',
          xbox: 'Hold LB -> RT immediately after impact',
          pc: 'Hold RMB -> Shift+LMB immediately after impact'
        }
      },
      {
        name: 'Shield Parry & Critical Riposte',
        sequence: 'Shield Skill (L2) on Enemy Swing -> Walk Close -> Light Attack (R1)',
        description: 'Deflects enemy attack frame, opening enemy for a massive lethal critical blow.',
        difficulty: 'Advanced',
        timingNote: 'Active parry frames must align with enemy weapon arc.',
        platformSequences: {
          playstation: 'L2 (Timing) -> Walk Forward -> R1',
          xbox: 'LT (Timing) -> Walk Forward -> RB',
          pc: 'Shift+RMB (Timing) -> Walk Forward -> LMB'
        }
      },
      {
        name: 'Torrent Jump Dismount Attack',
        sequence: 'Mount Sprint -> Jump (Cross) -> Dismount (L3) -> Heavy Attack (R2)',
        description: 'Leaps off spectral steed in mid-air to land a massive plunging heavy blow.',
        difficulty: 'Intermediate',
        timingNote: 'Dismount at peak of Torrent jump arc.',
        platformSequences: {
          playstation: 'Mount -> Cross Jump -> L3 Click -> R2 Heavy',
          xbox: 'Mount -> A Jump -> LS Click -> RT Heavy',
          pc: 'Mount -> F Jump -> C Dismount -> Shift+LMB Heavy'
        }
      }
    ]
  },
  {
    id: 'sf6',
    name: 'Street Fighter 6',
    genre: 'Fighting',
    developer: 'Capcom',
    platformSupport: ['pc', 'xbox', 'playstation'],
    defaultPlatform: 'playstation',
    md: `# Street Fighter 6
## Classic Controls Layout
* \`Square\` / \`LP\` Light Punch
* \`Triangle\` / \`MP\` Medium Punch
* \`R1\` / \`HP\` Heavy Punch
* \`Cross\` / \`LK\` Light Kick
* \`Circle\` / \`MK\` Medium Kick
* \`R2\` / \`HK\` Heavy Kick

## System Mechanics & Drive System
* \`L1\` / \`HP+HK\` Drive Impact (Armored Strike)
* \`L2\` / \`MP+MK\` Drive Parry (Reflect & Fuel Gauge)
* \`Forward, Forward during Parry\` Drive Rush
* \`LP + LK\` / \`Square+Cross\` Grab / Throw

## Iconic Specials & Super Arts
* \`Quarter Circle Forward\` Down -> Down-Right -> Right + Punch (Hadoken)
* \`Dragon Punch\` Right -> Down -> Down-Right + Punch (Shoryuken)
* \`Level 3 Super Art\` QCF x2 + Heavy Punch`,
    categories: [
      {
        name: 'Basic Attacks (Classic)',
        items: [
          { id: 'sf-1', description: 'Light Punch (LP)', keys: '`Square` / `X` / `U`', platformKeys: { playstation: '`Square`', xbox: '`X`', pc: '`U`' } },
          { id: 'sf-2', description: 'Medium Punch (MP)', keys: '`Triangle` / `Y` / `I`', platformKeys: { playstation: '`Triangle`', xbox: '`Y`', pc: '`I`' } },
          { id: 'sf-3', description: 'Heavy Punch (HP)', keys: '`R1` / `RB` / `O`', platformKeys: { playstation: '`R1`', xbox: '`RB`', pc: '`O`' } },
          { id: 'sf-4', description: 'Light Kick (LK)', keys: '`Cross` / `A` / `J`', platformKeys: { playstation: '`Cross`', xbox: '`A`', pc: '`J`' } },
          { id: 'sf-5', description: 'Medium Kick (MK)', keys: '`Circle` / `B` / `K`', platformKeys: { playstation: '`Circle`', xbox: '`B`', pc: '`K`' } },
          { id: 'sf-6', description: 'Heavy Kick (HK)', keys: '`R2` / `RT` / `L`', platformKeys: { playstation: '`R2`', xbox: '`RT`', pc: '`L`' } }
        ]
      },
      {
        name: 'Drive Mechanics & Defense',
        items: [
          { id: 'sf-7', description: 'Drive Impact (Armored Guard-Break)', keys: '`L1` / `LB` / `HP+HK`', platformKeys: { playstation: '`L1`', xbox: '`LB`', pc: '`O+L`' } },
          { id: 'sf-8', description: 'Drive Parry', keys: '`L2` / `LT` / `MP+MK`', platformKeys: { playstation: '`L2`', xbox: '`LT`', pc: '`I+K`' } },
          { id: 'sf-9', description: 'Throw / Throw Escape', keys: '`Square+Cross` / `LP+LK`', platformKeys: { playstation: '`Square+Cross`', xbox: '`X+A`', pc: '`U+J`' } }
        ]
      }
    ],
    combos: [
      {
        name: 'Drive Rush Cancel Combo',
        sequence: 'Standing MP -> Forward, Forward (Drive Rush) -> Heavy Punch -> Shoryuken',
        description: 'Cancels normal attack into instant Drive Rush to extend punish combos.',
        difficulty: 'Advanced',
        timingNote: 'Tap Forward, Forward on the exact frame the normal move connects.',
        platformSequences: {
          playstation: 'Triangle -> Forward, Forward -> R1 -> Right, Down, Down-Right + R1',
          xbox: 'Y -> Forward, Forward -> RB -> Right, Down, Down-Right + RB',
          pc: 'I -> D, D -> O -> D, S, D+O'
        }
      },
      {
        name: 'Hadoken (Fireball)',
        sequence: 'Down -> Down-Right -> Right + Punch',
        description: 'Standard zoning projectile attack.',
        difficulty: 'Beginner',
        timingNote: 'Smooth quarter-circle motion on D-Pad or stick.',
        platformSequences: {
          playstation: 'Down, Down-Right, Right + Square/Triangle/R1',
          xbox: 'Down, Down-Right, Right + X/Y/RB',
          pc: 'S, S+D, D + U/I/O'
        }
      },
      {
        name: 'Shoryuken (Dragon Punch Anti-Air)',
        sequence: 'Right -> Down -> Down-Right + Punch',
        description: 'Invincible upper-cut anti-air attack.',
        difficulty: 'Intermediate',
        timingNote: 'Execute right as jumping opponent enters your strike zone.',
        platformSequences: {
          playstation: 'Right, Down, Down-Right + R1',
          xbox: 'Right, Down, Down-Right + RB',
          pc: 'D, S, S+D + O'
        }
      },
      {
        name: 'Level 3 Critical Art Super',
        sequence: 'Down, Right, Down, Right + Heavy Punch',
        description: 'Devastating high-damage cinematic finisher.',
        difficulty: 'Advanced',
        timingNote: 'Double quarter-circle forward input before pressing heavy punch.',
        platformSequences: {
          playstation: 'Down, Right, Down, Right + R1',
          xbox: 'Down, Right, Down, Right + RB',
          pc: 'S, D, S, D + O'
        }
      }
    ]
  },
  {
    id: 'helldivers-2',
    name: 'Helldivers 2',
    genre: 'Co-op Shooter',
    developer: 'Arrowhead Game Studios',
    platformSupport: ['pc', 'playstation'],
    defaultPlatform: 'playstation',
    md: `# Helldivers 2
## Movement & Survival
* \`W A S D\` / \`L-Stick\` Move
* \`Alt\` / \`Circle\` Dive / Prone
* \`Ctrl\` / \`L1\` Open Stratagem Menu (Hold)
* \`V\` / \`Up-D-Pad\` Quick Stim (Heal)
* \`F\` / \`R3\` Melee Attack
* \`Space\` / \`Cross\` Vault / Climb

## Stratagem D-Pad Sequences
* \`Reinforce\` Up Down Right Left Up
* \`Eagle 500kg Bomb\` Up Right Down Down Down
* \`Quasar Cannon\` Down Down Up Left Right
* \`Supply Pack\` Down Left Up Down Up
* \`Autocannon\` Down Left Down Up Up Right`,
    categories: [
      {
        name: 'Combat & Movement',
        items: [
          { id: 'hd-1', description: 'Move / Sprint', keys: '`W A S D` / `L-Stick`', platformKeys: { pc: '`W A S D`', playstation: '`L-Stick`' } },
          { id: 'hd-2', description: 'Dive to Ground (Dodges Explosions)', keys: '`Alt` / `Circle`', platformKeys: { pc: '`Alt`', playstation: '`Circle`' } },
          { id: 'hd-3', description: 'Quick Stim (Instant Heal)', keys: '`V` / `Up-D-Pad`', platformKeys: { pc: '`V`', playstation: '`Up-D-Pad`' } },
          { id: 'hd-4', description: 'Stratagem Input Menu (Hold)', keys: '`Ctrl` / `L1`', platformKeys: { pc: '`Ctrl`', playstation: '`L1`' } },
          { id: 'hd-5', description: 'Fire Weapon / Aim ADS', keys: '`LMB / RMB` / `R2 / L2`', platformKeys: { pc: '`LMB / RMB`', playstation: '`R2 / L2`' } }
        ]
      },
      {
        name: 'Iconic Stratagem D-Pad Sequences',
        items: [
          { id: 'hd-6', description: 'Reinforce Squadmate', keys: '`Up Down Right Left Up`', isCombo: true },
          { id: 'hd-7', description: 'Eagle 500kg Bomb', keys: '`Up Right Down Down Down`', isCombo: true },
          { id: 'hd-8', description: 'Quasar Cannon Heavy Weapon', keys: '`Down Down Up Left Right`', isCombo: true },
          { id: 'hd-9', description: 'Resupply Pod', keys: '`Down Down Up Right`', isCombo: true }
        ]
      }
    ],
    combos: [
      {
        name: 'Eagle 500kg Strike',
        sequence: 'Hold L1 -> Up, Right, Down, Down, Down -> Throw Beacon (R2)',
        description: 'Calls in devastating 500kg explosive bomb to wipe out Bile Titans.',
        difficulty: 'Intermediate',
        timingNote: 'Input directional keys swiftly while sprinting.',
        platformSequences: {
          playstation: 'Hold L1 -> Up, Right, Down, Down, Down -> R2 Throw',
          pc: 'Hold Ctrl -> W, D, S, S, S -> LMB Throw'
        }
      },
      {
        name: 'Emergency Reinforce Dive',
        sequence: 'Dive (Circle) -> Hold L1 in mid-air -> Up, Down, Right, Left, Up -> Throw',
        description: 'Inputs revive code while diving through explosion fire.',
        difficulty: 'Advanced',
        timingNote: 'Execute entire 5-button sequence before hitting the dirt.',
        platformSequences: {
          playstation: 'Circle Dive -> Hold L1 -> Up, Down, Right, Left, Up -> R2',
          pc: 'Alt Dive -> Hold Ctrl -> W, S, D, A, W -> LMB'
        }
      },
      {
        name: 'Hellbomb Armed Sequence',
        sequence: 'Interact Terminal -> Up, Right, Down, Down, Down',
        description: 'Arms nuclear Hellbomb near Automaton factories.',
        difficulty: 'Intermediate',
        timingNote: 'Clear surrounding enemies before opening terminal.',
        platformSequences: {
          playstation: 'Cross Terminal -> Up, Right, Down, Down, Down',
          pc: 'E Terminal -> W, D, S, S, S'
        }
      }
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    genre: 'FPS',
    developer: 'Riot Games',
    platformSupport: ['pc', 'xbox', 'playstation'],
    defaultPlatform: 'pc',
    md: `# Valorant
## Movement & Gunplay
* \`W A S D\` Move Forward / Left / Backward / Right
* \`Shift\` Walk (Silent Footsteps)
* \`Ctrl\` Crouch
* \`Space\` Jump
* \`LMB\` Primary Fire
* \`RMB\` Alt Fire / Aim Down Sights (ADS)
* \`R\` Reload Weapon

## Agent Abilities
* \`C\` Ability 1 (Utility)
* \`Q\` Ability 2 (Flash / Damage)
* \`E\` Signature Ability
* \`X\` Ultimate Ability

## Tactical Utility
* \`F\` Use / Plant / Defuse Spike
* \`G\` Drop Weapon
* \`B\` Buy Menu`,
    categories: [
      {
        name: 'Movement & Gunplay',
        items: [
          { id: 'val-1', description: 'Move / Strafe', keys: '`W A S D`', platformKeys: { pc: '`W A S D`', xbox: '`L-Stick`', playstation: '`L-Stick`' } },
          { id: 'val-2', description: 'Walk (Silent Movement)', keys: '`Shift`', platformKeys: { pc: '`Shift`', xbox: '`LB`', playstation: '`L1`' } },
          { id: 'val-3', description: 'Crouch', keys: '`Ctrl`', platformKeys: { pc: '`Ctrl`', xbox: '`B`', playstation: '`Circle`' } },
          { id: 'val-4', description: 'Primary Fire', keys: '`LMB`', platformKeys: { pc: '`LMB`', xbox: '`RT`', playstation: '`R2`' } },
          { id: 'val-5', description: 'ADS / Alt Fire', keys: '`RMB`', platformKeys: { pc: '`RMB`', xbox: '`LT`', playstation: '`L2`' } }
        ]
      },
      {
        name: 'Agent Abilities',
        items: [
          { id: 'val-6', description: 'Ability 1 (Utility)', keys: '`C`', platformKeys: { pc: '`C`', xbox: '`LB`', playstation: '`L1`' } },
          { id: 'val-7', description: 'Ability 2 (Flash/Molly)', keys: '`Q`', platformKeys: { pc: '`Q`', xbox: '`RB`', playstation: '`R1`' } },
          { id: 'val-8', description: 'Signature Ability', keys: '`E`', platformKeys: { pc: '`E`', xbox: '`X`', playstation: '`Square`' } },
          { id: 'val-9', description: 'Ultimate Ability', keys: '`X`', platformKeys: { pc: '`X`', xbox: '`LB+RB`', playstation: '`L1+R1`' } }
        ]
      },
      {
        name: 'Utility & Spike Interaction',
        items: [
          { id: 'val-10', description: 'Plant / Defuse Spike', keys: '`F`', platformKeys: { pc: '`F`', xbox: '`X`', playstation: '`Square`' } },
          { id: 'val-11', description: 'Buy Menu', keys: '`B`', platformKeys: { pc: '`B`', xbox: '`View`', playstation: '`Touchpad`' } }
        ]
      }
    ],
    combos: [
      {
        name: 'Jett Dash Peek & Escape',
        sequence: 'Tailwind (E) -> Peek Corner -> Fire Shot -> Dash Back (E)',
        description: 'Snipes angle with Operator and instantly dashes to safety.',
        difficulty: 'Intermediate',
        timingNote: 'Trigger Tailwind before peeking so dash is activated.',
        platformSequences: {
          pc: 'Press E -> A/D Peek -> LMB Shot -> E Dash',
          xbox: 'Press X -> LS Peek -> RT Shot -> X Dash'
        }
      },
      {
        name: 'Raze Double Satchel Flying Blast',
        sequence: 'Blast Pack 1 (Q) -> Detonate (Q) -> Air Stride -> Blast Pack 2 (Q) -> Showstopper Rocket (X)',
        description: 'Launches Raze across entire site at supersonic speed into rocket kill.',
        difficulty: 'Pro Master',
        timingNote: 'Throw second satchel at peak velocity arc.',
        platformSequences: {
          pc: 'Q -> Q -> Jump -> Q -> Q -> X Rocket',
          xbox: 'RB -> RB -> A -> RB -> RB -> LB+RB Rocket'
        }
      },
      {
        name: 'Brimstone Triple Smoke Deployment',
        sequence: 'Sky Smoke (E) -> Select 3 Locations (LMB) -> Deploy (RMB)',
        description: 'Instantly drops three smokes covering site sightlines simultaneously.',
        difficulty: 'Beginner',
        timingNote: 'Select site chokepoints on tactical map before confirming.',
        platformSequences: {
          pc: 'E Map -> LMB x3 -> RMB Confirm',
          xbox: 'X Map -> RT x3 -> LT Confirm'
        }
      }
    ]
  },
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    genre: 'Battle Royale',
    developer: 'Respawn Entertainment',
    platformSupport: ['pc', 'xbox', 'playstation', 'switch'],
    defaultPlatform: 'pc',
    md: `# Apex Legends
## Movement & High-Speed Tech
* \`W A S D\` Move
* \`Ctrl\` Crouch / Slide
* \`Space\` Jump
* \`Sprint -> Crouch\` Slide Jump
* \`Superglide\` Jump + Crouch at exact same frame off ledge
* \`Tap Strafe\` Scroll Wheel Up (Forward) during jump turn

## Combat & Tactical Abilities
* \`Q\` Tactical Ability
* \`Z\` / \`LB+RB\` Ultimate Ability
* \`F\` Melee Attack
* \`H\` Extra Character Utility
* \`Middle Click\` Ping Enemy / Location`,
    categories: [
      {
        name: 'Basic Movement & Gunplay',
        items: [
          { id: 'ap-1', description: 'Move / Strafe', keys: '`W A S D`', platformKeys: { pc: '`W A S D`', xbox: '`L-Stick`', playstation: '`L-Stick`', switch: '`L-Stick`' } },
          { id: 'ap-2', description: 'Crouch / Slide', keys: '`Ctrl` / `C`', platformKeys: { pc: '`Ctrl`', xbox: '`B`', playstation: '`Circle`', switch: '`A`' } },
          { id: 'ap-3', description: 'Jump / Vault', keys: '`Space`', platformKeys: { pc: '`Space`', xbox: '`A`', playstation: '`Cross`', switch: '`B`' } },
          { id: 'ap-4', description: 'Tactical Ability', keys: '`Q`', platformKeys: { pc: '`Q`', xbox: '`LB`', playstation: '`L1`', switch: '`L`' } },
          { id: 'ap-5', description: 'Ultimate Ability', keys: '`Z` / `LB+RB`', platformKeys: { pc: '`Z`', xbox: '`LB+RB`', playstation: '`L1+R1`', switch: '`L+R`' } }
        ]
      },
      {
        name: 'Advanced High-Skill Movement Tech',
        items: [
          { id: 'ap-6', description: 'Slide Jump Momentum', keys: '`Sprint -> Crouch -> Jump`', isCombo: true },
          { id: 'ap-7', description: 'Superglide (Ledge Burst)', keys: '`Jump + Crouch (Same Frame)`', isCombo: true },
          { id: 'ap-8', description: 'Tap Strafe (Sharp Air Turn)', keys: '`Scroll Wheel Up (Bound to Forward)`', isCombo: true }
        ]
      }
    ],
    combos: [
      {
        name: 'Superglide (Extreme Ledge Boost)',
        sequence: 'Climb Ledge -> At Peak Frame press Jump + Crouch simultaneously',
        description: 'Launches player forward off ledges at 1000+ speed units.',
        difficulty: 'Pro Master',
        timingNote: 'Single-frame window (~16ms at 60fps) at top of mantle animation.',
        platformSequences: {
          pc: 'Mantle -> Space + Ctrl (Exact Same Frame)',
          xbox: 'Mantle -> A + B (Exact Same Frame)',
          playstation: 'Mantle -> Cross + Circle (Exact Same Frame)',
          switch: 'Mantle -> B + A (Exact Same Frame)'
        }
      },
      {
        name: 'Tap Strafe (180° Mid-Air Direction Change)',
        sequence: 'Jump off Pad/Slide -> Turn Camera 90-180° -> Scroll Wheel Up (Forward)',
        description: 'Enables impossible sharp mid-air turns around cover.',
        difficulty: 'Advanced',
        timingNote: 'Spam scroll wheel while turning mouse without pressing S.',
        platformSequences: {
          pc: 'Slide Jump -> Turn Mouse -> Spam Scroll Up (Forward)'
        }
      },
      {
        name: 'Wall Jump Momentum Reset',
        sequence: 'Slide Jump -> Aim at Wall -> Release W -> Jump off Wall Contact',
        description: 'Bounces off vertical surfaces to disorient opponents.',
        difficulty: 'Intermediate',
        timingNote: 'Must release forward key (W) right before contacting wall.',
        platformSequences: {
          pc: 'Slide Jump -> Face Wall -> Release W -> Tap Space on Wall',
          xbox: 'Slide Jump -> Face Wall -> Neutral LS -> Tap A on Wall',
          playstation: 'Slide Jump -> Face Wall -> Neutral LS -> Tap Cross on Wall'
        }
      }
    ]
  }
];
