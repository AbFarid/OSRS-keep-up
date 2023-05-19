<script lang="ts">
  import 'carbon-components-svelte/css/white.css'
  import Router, { push, querystring, location } from 'svelte-spa-router'
  import routes from './routes'
  import { clearing, playersStore, swapping } from './stores'
  import { handleRouteChanges, parseQueryString } from './lib/routingUtils'

  import SideNav from './components/SideNav.svelte'
  import Header from './components/Header.svelte'
  import { Content, Grid, Row, Column } from 'carbon-components-svelte'

  let isSideNavOpen = false
  let player1 = $playersStore[0]
  let player2 = $playersStore[1]
  $: loaded = player1 && player2

  // Keep track of qeurysting changes
  let p1_username: string
  let p2_username: string
  let redirectTo: string
  $: {
    // ?p1=Arkantis+V&p2=Arkantis+I
    const { p1_un, p2_un, redirect } = parseQueryString($querystring)
    p1_username = p1_un
    p2_username = p2_un
    redirectTo = redirect
  }

  $: {
    player1 = $playersStore[0]
    player2 = $playersStore[1]

    handleRouteChanges(
      player1,
      player2,
      p1_username,
      p2_username,
      redirectTo,
      $location,
      $swapping,
      $clearing
    )
  }
</script>

<main>
  <Header bind:isSideNavOpen {player1} {player2} />

  {#if loaded}
    <SideNav {isSideNavOpen} querystring={$querystring} location={$location} />
  {/if}

  <Content>
    <Router {routes} />
  </Content>
</main>

<style>
</style>
