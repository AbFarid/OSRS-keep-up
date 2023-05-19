import { type Quests, type AchievementDiaries, type Levels, AllSkills } from '../types/OSRS'

export interface PlayerData {
  username: string
  timestamp: string
  quests: Quests
  levels: Levels
  achievement_diaries: AchievementDiaries
  music_tracks: number[]
  combat_achievements: number[]
  league_tasks: any
}

const patchOverall = (data: PlayerData) => {
  if (data.levels.Overall > 1) return data

  const total = AllSkills.reduce((acc, skill) => {
    return acc + (data.levels[skill] || 0)
  } , 0)

  data.levels.Overall = total
  console.log('patched overall', data)
  return data
}

const baseUrl = 'https://sync.runescape.wiki/runelite/player'

export const fetchWikiSync = async (
  username: string
): Promise<{ data?: PlayerData; error?: string }> => {

  try {
    const response = await fetch(
      `${baseUrl}/${encodeURIComponent(username)}/STANDARD`
    )

    if (!response.ok) {
      const error = await response.json()
      return { error: error.error }
    }

    let data = await response.json()
    data = patchOverall(data)
    return { data }
    
  } catch (error) {
    console.error(`Error fetching data for user: ${username}`, error)
    return { error: error.message }
  }
}
