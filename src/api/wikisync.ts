import type { Quests, AchievementDiaries, Levels } from '../types/OSRS'

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

    const data = await response.json()
    return { data }
    
  } catch (error) {
    console.error(`Error fetching data for user: ${username}`, error)
    return { error: error.message }
  }
}
