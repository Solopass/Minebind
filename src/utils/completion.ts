import { GameProfile, ProfileCompletionStatus } from '../types';

/**
 * Calculates the exact completion percentage and status of a game control profile.
 */
export function calculateProfileCompletion(profile: GameProfile): ProfileCompletionStatus {
  const missingItemsList: string[] = [];
  let score = 0;
  const maxScore = 100;

  // 1. Total Controls Count check (Max 25 pts)
  const totalControls = profile.categories.reduce((acc, cat) => acc + cat.items.length, 0);
  if (totalControls >= 10) {
    score += 25;
  } else if (totalControls > 0) {
    score += Math.round((totalControls / 10) * 25);
    missingItemsList.push(`Add ${10 - totalControls} more control mappings (Currently ${totalControls}/10)`);
  } else {
    missingItemsList.push("No control items added to categories");
  }

  // 2. Categories Structure (Max 20 pts)
  const catNames = profile.categories.map(c => c.name.toLowerCase());
  const hasMovement = catNames.some(n => n.includes('move') || n.includes('basic') || n.includes('nav') || n.includes('drive'));
  const hasCombat = catNames.some(n => n.includes('combat') || n.includes('attack') || n.includes('action') || n.includes('ability') || n.includes('offense'));
  const hasUtility = catNames.some(n => n.includes('util') || n.includes('item') || n.includes('interact') || n.includes('menu') || n.includes('tech'));

  if (hasMovement) score += 7; else missingItemsList.push("Missing Movement & Navigation category");
  if (hasCombat) score += 7; else missingItemsList.push("Missing Combat / Actions category");
  if (hasUtility) score += 6; else missingItemsList.push("Missing Utility / Interact category");

  // 3. Platform Binding Coverage (Max 30 pts)
  const supportedPlatforms = profile.platformSupport || ['pc'];
  let totalPlatformBindingsChecked = 0;
  let validPlatformBindingsFound = 0;

  profile.categories.forEach(cat => {
    cat.items.forEach(item => {
      supportedPlatforms.forEach(p => {
        totalPlatformBindingsChecked++;
        if (item.platformKeys && item.platformKeys[p]) {
          validPlatformBindingsFound++;
        }
      });
    });
  });

  if (totalPlatformBindingsChecked > 0) {
    const platformRatio = validPlatformBindingsFound / totalPlatformBindingsChecked;
    const platformScore = Math.round(platformRatio * 30);
    score += platformScore;
    if (platformRatio < 1) {
      const missingCount = totalPlatformBindingsChecked - validPlatformBindingsFound;
      missingItemsList.push(`${missingCount} control(s) missing specific platform keybinds`);
    }
  }

  // 4. Combos & Chained Mechanics Support (Max 25 pts)
  const totalCombos = profile.combos ? profile.combos.length : 0;
  if (totalCombos >= 3) {
    score += 25;
  } else if (totalCombos > 0) {
    score += Math.round((totalCombos / 3) * 25);
    missingItemsList.push(`Add ${3 - totalCombos} more advanced combo chains (Currently ${totalCombos}/3)`);
  } else {
    missingItemsList.push("No advanced combo chains or mechanics added");
  }

  const finalPercentage = Math.min(100, Math.max(0, Math.round(score)));
  const is100Percent = finalPercentage === 100;

  return {
    percentage: finalPercentage,
    is100Percent,
    totalControlsCount: totalControls,
    totalCombosCount: totalCombos,
    supportedPlatformsCount: supportedPlatforms.length,
    missingItemsList
  };
}
