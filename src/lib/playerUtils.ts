import type { Levels } from "../types/OSRS"

/**
 * Calculate the combat level based on the given stats for OSRS.
 * @param stats The combat stats.
 * @param floor If true, the final combat level will be floored to a whole number.
 * @return The calculated combat level as a string.
 */
export const calcCombatLevel = (stats: Levels, floor = false): string => {
  if (!stats) return '?'

  const {
    Attack: attack,
    Strength: strength,
    Defence: defence,
    Hitpoints: HP,
    Ranged: ranged,
    Magic: magic,
    Prayer: prayer,
  } = stats

  // Base combat level is calculated by adding Defence, HP,
  // and half of Prayer (rounded down), then dividing by 4
  const base = 0.25 * (defence + HP + Math.floor(0.5 * prayer))

  // Melee combat level is calculated by adding Attack and Strength,
  // then multiplying by 13/40 (effectively, multiplying by 0.325)
  const melee = 0.325 * (attack + strength)

  // Ranged combat level is calculated by multiplying Ranged by 1.5 (rounded down),
  // then multiplying by 0.325
  const ranging = 0.325 * Math.floor(ranged * 1.5)

  // Magic combat level is calculated by multiplying Magic by 1.5 (rounded down),
  // then multiplying by 0.325
  const mage = 0.325 * Math.floor(magic * 1.5)

  // Final combat level is the base level plus
  // the highest of the melee, ranged, and magic levels
  const final = base + Math.max(melee, ranging, mage)

  // Return the final combat level as a string,
  // optionally flooring it to a whole number
  return floor ? Math.floor(final).toString() : final.toFixed(2)
}
