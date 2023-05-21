import type { SkillNames, Tier } from "../types/OSRS"


const baseUrl = 'https://oldschool.runescape.wiki/images'

export const getIcon = (name: string) => `${baseUrl}/${name}_icon.png`
export const getImg = (name: string) => `${baseUrl}/${name}.png`

export const getSkillIcon = (skill: SkillNames, detailed = false) => {
  const detail = detailed ? '_%28detail%29' : ''
  return `${baseUrl}/${skill}_icon${detail}.png`
}

export const getTierIcon = (tier: Tier) => {
  const _tier = tier.toLocaleLowerCase()
  return `${baseUrl}/Combat_Achievements_-_${_tier}_tier_icon.png`
}