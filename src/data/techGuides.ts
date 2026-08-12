import { TechGuide } from '../types';

export const TECH_GUIDES: TechGuide[] = [
  {
    id: 'rl-flip-reset',
    title: 'Flip Reset Mechanics & Goal Execution',
    gameId: 'rocket-league',
    gameName: 'Rocket League',
    category: 'High-Skill Aerial Tech',
    difficulty: 'Pro Master',
    summary: 'Touch all four tires simultaneously onto the underside of the ball in mid-air to reset your jump timer, granting an infinite flip dodge.',
    prerequisites: [
      'Mastery of Directional Air Roll (Air Roll Left/Right)',
      'Comfortable with wall launches and ball matching speed'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Wall Launch Setup',
        keyInput: 'Drive up Wall -> Hit Ball lightly towards net',
        timing: 'Match speed with the ball; hit bottom-center of ball so it pops upward gracefully.',
        visualTip: 'Car should hit ball when ball is 1 car length away from the ceiling.'
      },
      {
        stepNumber: 2,
        instruction: 'Air Roll Upside Down',
        keyInput: 'Jump off Wall -> Air Roll Left / Right 180°',
        timing: 'Immediately rotate car underbelly toward the falling ball path.',
        visualTip: 'Tilt nose slightly up so wheels face the ball surface.'
      },
      {
        stepNumber: 3,
        instruction: 'Wheel Surface Reset Contact',
        keyInput: 'Release Accelerate -> Feather Boost to touch ball',
        timing: 'All 4 tires must touch ball at the exact same millisecond.',
        visualTip: 'Listen for the distinct suspension compression sound chime.'
      },
      {
        stepNumber: 4,
        instruction: 'Execute Flip Shot / Scoop',
        keyInput: 'Wait for defender reaction -> Dodge Flip into Goal',
        timing: 'You now have unlimited time to flip! Delay your dodge to bait goalkeeper out.',
        visualTip: 'Flick nose up or side-flip under ball for a high-velocity scoop.'
      }
    ],
    commonMistakes: [
      'Only 2 or 3 wheels touch the ball, failing to grant the jump reset.',
      'Hitting the ball too hard on setup, causing it to bounce away out of aerial reach.',
      'Holding acceleration or boost during tire contact, pushing the car away.'
    ],
    proTip: 'In practice mode, turn on game speed 70% to master wheel contact timing before attempting at full 100% match speed.'
  },
  {
    id: 'rl-musty-flick',
    title: 'Musty Flick Power Shot',
    gameId: 'rocket-league',
    gameName: 'Rocket League',
    category: 'Advanced Dribble & Flick',
    difficulty: 'Advanced',
    summary: 'Tilt your car past 90 degrees backward in the air so that executing a Backflip accelerates your car FORWARD with immense force.',
    prerequisites: [
      'Ground dribble control on car roof',
      'Basic pitch tilting knowledge'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Roof Dribble Position',
        keyInput: 'Balance ball on center-front hood',
        timing: 'Match car speed with ball roll speed.',
        visualTip: 'White circle indicator on turf should sit directly in front of windshield.'
      },
      {
        stepNumber: 2,
        instruction: 'Single Jump & Pitch Tilt',
        keyInput: 'Jump once -> Pull Pitch Back (L-Stick Down / S)',
        timing: 'Pitch car nose downward until nose points past 90 degrees toward rear.',
        visualTip: 'Car underbelly should be slightly visible facing forward.'
      },
      {
        stepNumber: 3,
        instruction: 'Execute Forward Vector Backflip',
        keyInput: 'Press Jump (Backflip: L-Stick Down + A / Cross)',
        timing: 'Trigger backflip the exact frame car nose passes 90 degrees.',
        visualTip: 'Tail end of car will snap around like a whip, launcher-flicking the ball.'
      }
    ],
    commonMistakes: [
      'Flipping before reaching 90 degrees, causing car to fly backward instead of forward.',
      'Jumping too high off the ground, causing ball to fall off hood before backflip.'
    ],
    proTip: 'Combine with a side-air roll tilt for a diagonal Musty Flick that bends around goalkeepers.'
  },
  {
    id: 'rl-half-flip',
    title: 'Half Flip Instant 180° Turn',
    gameId: 'rocket-league',
    gameName: 'Rocket League',
    category: 'Essential Recovery Tech',
    difficulty: 'Intermediate',
    summary: 'Cancel a backflip halfway through to flip car upside down, then air roll to land facing forward while retaining full backward momentum.',
    prerequisites: [
      'Bound Directional Air Roll (Air Roll Left / Right)'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Straight Backflip',
        keyInput: 'Drive Reverse -> L-Stick DOWN + Jump x2',
        timing: 'Execute clean backward dodge.',
        visualTip: 'Car begins upside-down backflip rotation.'
      },
      {
        stepNumber: 2,
        instruction: 'Instant Flip Cancel',
        keyInput: 'Push L-Stick UP (W key) immediately',
        timing: 'Push UP when car is 50% rotated (wheels pointing up).',
        visualTip: 'Flip animation freezes mid-rotation.'
      },
      {
        stepNumber: 3,
        instruction: 'Air Roll Land',
        keyInput: 'Hold Air Roll Left (LB / L1 / Q) + Boost',
        timing: 'Hold until wheels align with ground facing 180° backward.',
        visualTip: 'Land smoothly on all 4 wheels while boosting forward.'
      }
    ],
    commonMistakes: [
      'Waiting too long before pushing stick UP, causing backflip to complete fully.',
      'Not binding a dedicated Air Roll Left/Right button, making the 180 roll sloppy.'
    ],
    proTip: 'Use Half Flip whenever you get caught out of position on defense to beat the opponent counter-attack.'
  },
  {
    id: 'rl-speed-flip',
    title: 'Speed Flip Kickoff & Sprint',
    gameId: 'rocket-league',
    gameName: 'Rocket League',
    category: 'Pro Kickoff & Rotation',
    difficulty: 'Advanced',
    summary: 'A cancelled diagonal front flip that keeps your boost rocket pointing straight back throughout the flip for maximum speed.',
    prerequisites: [
      'Understanding of flip cancels',
      'Fast thumb/finger movement'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Diagonal Front Flip',
        keyInput: 'Hold Boost -> L-Stick UP-LEFT + Jump x2',
        timing: 'Hold Boost continuously from start to finish.',
        visualTip: 'Car rotates diagonally at 45 degree angle.'
      },
      {
        stepNumber: 2,
        instruction: 'Immediate Downward Cancel',
        keyInput: 'Pull L-Stick STRAIGHT DOWN within 50ms',
        timing: 'Must pull down virtually simultaneously with 2nd jump tap.',
        visualTip: 'Car nose stays level while tail spins.'
      },
      {
        stepNumber: 3,
        instruction: 'Air Roll Correction & Landing',
        keyInput: 'Hold Air Roll Left to level wheels',
        timing: 'Keep stick pulled down until wheels touch turf.',
        visualTip: 'You will reach Supersonic speed trail before reaching ball.'
      }
    ],
    commonMistakes: [
      'Releasing Boost during the flip cancel (loses 20% speed burst).',
      'Pulling stick down at an angle instead of straight down.'
    ],
    proTip: 'Practice in the "Musty Speed Flip Test" custom training pack to verify if you hit the ball before timer expires.'
  },
  {
    id: 'er-guard-counter',
    title: 'Guard Counter Stance Break',
    gameId: 'elden-ring',
    gameName: 'Elden Ring',
    category: 'Combat Mechanics',
    difficulty: 'Beginner',
    summary: 'Instantly unleash a heavy counter attack with high posture/poise damage after blocking an incoming strike on your shield.',
    prerequisites: [
      'Shield or weapon held in left hand'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Hold Guard',
        keyInput: 'Hold L1 / LB / RMB (Guard)',
        timing: 'Keep shield raised before enemy strike lands.',
        visualTip: 'Stamina bar absorbs the impact.'
      },
      {
        stepNumber: 2,
        instruction: 'Heavy Attack Trigger',
        keyInput: 'Press R2 / RT / Shift+LMB immediately after impact',
        timing: 'Press right as you hear the metallic block chime.',
        visualTip: 'Character plays special fast heavy swinging animation.'
      }
    ],
    commonMistakes: [
      'Pressing Heavy Attack before block completes, taking full damage.',
      'Attempting Guard Counter against multi-hit boss combos without stamina.'
    ],
    proTip: 'Guard Counters inflict massive poise damage, breaking enemy stance in 2-3 hits for a visceral critical strike.'
  },
  {
    id: 'sf-drive-rush',
    title: 'Drive Rush Cancel Combo Extension',
    gameId: 'sf6',
    gameName: 'Street Fighter 6',
    category: 'Neutral & Combo System',
    difficulty: 'Advanced',
    summary: 'Cancel a normal attack directly into a green Drive Rush dash to freeze opponent frames and extend devastating punish combos.',
    prerequisites: [
      'At least 3 Drive Gauge bars available'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Connect Cancellable Normal',
        keyInput: 'Standing Medium Punch or Heavy Punch',
        timing: 'Hit must connect cleanly with opponent (Hit or Guard).',
        visualTip: 'Character weapon/fist contacts opponent model.'
      },
      {
        stepNumber: 2,
        instruction: 'Forward Dash Input',
        keyInput: 'Tap Forward, Forward (or MP+MK Drive Parry)',
        timing: 'Input forward dash during the normal attack strike frames.',
        visualTip: 'Green ink splash effect envelops your character.'
      },
      {
        stepNumber: 3,
        instruction: 'Follow-up Combo Attack',
        keyInput: 'Heavy Punch -> Special Move / Super Art',
        timing: 'Drive Rush grants +4 frame advantage, allowing heavy normals to chain.',
        visualTip: 'Opponent stays frozen in hit-stun.'
      }
    ],
    commonMistakes: [
      'Inputting forward dash too late after attack recovery finishes.',
      'Attempting Drive Rush when in Burnout state (0 Drive gauge).'
    ],
    proTip: 'Drive Rush from Parry neutral costs 1 bar, whereas canceling off a normal move costs 3 bars.'
  },
  {
    id: 'hd-500kg-strike',
    title: 'Eagle 500kg Call-in & Throw Tech',
    gameId: 'helldivers-2',
    gameName: 'Helldivers 2',
    category: 'Stratagem Speed Inputs',
    difficulty: 'Intermediate',
    summary: 'Rapidly input the 5-button D-Pad code for the Eagle 500kg bomb while sprinting under pressure to eradicate heavy armor targets.',
    prerequisites: [
      'Eagle 500kg Stratagem equipped in ship bay'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Hold Stratagem Key',
        keyInput: 'Hold L1 / Ctrl while sprinting',
        timing: 'Keep moving to avoid getting hit by Automaton lasers or Bug swarms.',
        visualTip: 'Stratagem HUD overlays top left screen.'
      },
      {
        stepNumber: 2,
        instruction: 'D-Pad Sequence',
        keyInput: 'UP -> RIGHT -> DOWN -> DOWN -> DOWN',
        timing: 'Tap sequence swiftly with left thumb or WASD.',
        visualTip: 'D-Pad icons light up red on HUD.'
      },
      {
        stepNumber: 3,
        instruction: 'Throw Beacon at Target',
        keyInput: 'Aim -> R2 / LMB (Throw Beacon)',
        timing: 'Throw beacon 20m ahead of approaching Bile Titan / Factory Strider.',
        visualTip: 'Red laser beacon pins exact drop point.'
      }
    ],
    commonMistakes: [
      'Standing still while entering sequence, getting swarmed by Stalkers.',
      'Throwing beacon too close to teammates, causing accidental friendly fire.'
    ],
    proTip: 'Change your Stratagem keybinds on PC from WASD to Arrow Keys so you can run with WASD while typing stratagems with Arrow Keys.'
  },
  {
    id: 'apex-superglide',
    title: 'Superglide Single-Frame Ledge Boost',
    gameId: 'apex-legends',
    gameName: 'Apex Legends',
    category: 'Advanced Movement Tech',
    difficulty: 'Pro Master',
    summary: 'Execute a Jump and Crouch simultaneously at the exact single frame top apex of a ledge mantle to launch across the map.',
    prerequisites: [
      'Climbing ledge / mantle mechanic'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Climb Ledge',
        keyInput: 'Approach Ledge -> Hold Jump (Space / Cross / A)',
        timing: 'Begin standard mantle climb animation over obstacle.',
        visualTip: 'Camera tilts up as hands reach top of ledge.'
      },
      {
        stepNumber: 2,
        instruction: 'Mantle Peak Frame',
        keyInput: 'Wait for climb completion frame',
        timing: 'Exact millisecond screen flattens at top of mantle.',
        visualTip: 'Character hands push off ledge surface.'
      },
      {
        stepNumber: 3,
        instruction: 'Frame-Perfect Jump + Crouch',
        keyInput: 'Press JUMP + CROUCH at exact same frame',
        timing: 'Jump input should hit ~1ms before Crouch input.',
        visualTip: 'Field of view warps back with high-speed motion blur.'
      }
    ],
    commonMistakes: [
      'Pressing Crouch too early (results in dead slide on top of wall).',
      'Pressing Jump too early (results in standard small hop off wall).'
    ],
    proTip: 'Cap your framerate to 144fps or 120fps in display settings to widen the physical millisecond frame window for supergliding.'
  }
];
