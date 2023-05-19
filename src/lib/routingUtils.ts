import Router, { push, querystring, location } from 'svelte-spa-router'
import { clearing, playersStore, swapping } from '../stores'
import type { PlayerData } from '../api/wikisync'

export function parseQueryString(queryString: string) {
  // Remove the leading '?' if it's there
  if (queryString[0] === '?') {
    queryString = queryString.substring(1)
  }

  // Parse the query string
  const params = new URLSearchParams(queryString)

  // Get the parameter values
  let p1_un = params.get('p1')
  let p2_un = params.get('p2')
  let redirect = params.get('redirect')

  // Replace '+' and '_' with space
  if (p1_un) p1_un = p1_un.replace(/[+_]/g, ' ')
  if (p2_un) p2_un = p2_un.replace(/[+_]/g, ' ')

  return { p1_un, p2_un, redirect }
}

export function createQueryString(p1_un: string, p2_un: string) {
  const params = new URLSearchParams({ p1: p1_un, p2: p2_un })

  // Replace '+' signs with '%20'
  return params.toString().replace(/\+/g, '%20')
}

export function handleRouteChanges(
  player1: PlayerData,
  player2: PlayerData,
  p1_username: string,
  p2_username: string,
  redirectTo: string,
  $location: string,
  $swapping: boolean,
  $clearing: boolean,
) {
  // 1. Players are in store and params are in URL
  if (player1 && player2 && p1_username && p2_username) {

    // Players in store match params
    if (
      player1.username === p1_username &&
      player2.username === p2_username
    ) {
      console.log('Players in store match params')
      // Not currently on details, so navigate there
      if ($location === '/') {
        const queryString = createQueryString(player1.username, player2.username)
        push(`/${redirectTo || 'skills'}?${queryString}`)
      }
      // Else, already on a details page so do nothing
    }

    // Players in store don't match params
    else {
      console.log("Players in store don't match params")
      // Special condition for when players have been swapped
      if (
        player1.username === p2_username &&
        player2.username === p1_username
      ) {
        // If the swap was triggered by the user,
        // Adjust the queryString and set $swapping to false
        if ($swapping) {
          const queryStringSwapped = createQueryString(
            player1.username,
            player2.username
          )
          swapping.set(false)
          push(`${$location}?${queryStringSwapped}`)
        }
        // Else, the swap was triggered by the URL
        // Swap players in store
        else playersStore.set([player2, player1])
      }

      // Navigate to / for autofill and submit
      else if ($location !== '/') {
        // Remove players from store as they are not valid anymore
        playersStore.set([null, null])
        const redirect = $location.replace(/\//g, '') // remove leading slash
        const queryString = createQueryString(p1_username, p2_username)
        push(`/?${queryString}&redirect=${redirect}`)
        // Autofill form with params handled in Home component
      }
    }
  }

  // 2. Players not in store but params are in URL
  else if ((!player1 || !player2) && p1_username && p2_username) {
    console.log('Players not in store but params are in URL')
    // If Exiting, clear params and navigate to /
    if ($clearing) {
      push('/')
      clearing.set(false)
    }

    // Else if not currently on /, navigate there for autofill
    else if ($location !== '/') {
      const queryString = createQueryString(p1_username, p2_username)
      const redirect = $location.replace(/\//g, '') // remove leading slash
      push(`/?${queryString}&redirect=${redirect}`)
    }

    // Else, already on / so do nothing
    // Autofill form with params handled in Home component
  }

  // 3. Players are in store but params not in URL
  else if (player1 && player2 && (!p1_username || !p2_username)) {
    const queryString = createQueryString(player1.username, player2.username)
    // If coming from /, navigate to redirect or to /skills
    let destination = redirectTo || 'skills'
    if ($location === '/') push(`/${destination}?${queryString}`)
    // Else, update params with players in store
    else push(`${$location}?${queryString}`)
  }

  // 4. Neither players are in store nor params are in URL
  else if (!player1 && !player2 && (!p1_username || !p2_username)) {
    // If not currently on /, navigate there
    if ($location !== '/') push('/')
    // Else stay on / route
  }
}