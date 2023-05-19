import { writable } from 'svelte/store'
import type { PlayerData } from './api/wikisync'

// export const player1Store = writable(null)
// export const player2Store = writable(null)
export const playersStore = writable([null, null] as [PlayerData, PlayerData])
export const fetching = writable(false)
export const swapping = writable(false)
export const clearing = writable(false)
