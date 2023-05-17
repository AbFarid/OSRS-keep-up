<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import 'carbon-components-svelte/css/white.css'

  import PlayersForm from './components/PlayersForm.svelte'
  import PlayersDetails from './components/PlayersDetails.svelte'
  import {
    Header,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
    HeaderGlobalAction,
    HeaderUtilities,
  } from 'carbon-components-svelte'
  import { player1Store, player2Store } from './stores'
  import Renew from 'carbon-icons-svelte/lib/Renew.svelte'
  import ArrowsHorizontal from 'carbon-icons-svelte/lib/ArrowsHorizontal.svelte'
  import Logout from 'carbon-icons-svelte/lib/Logout.svelte'
  import { fetchWikiSync, type PlayerData } from './api/wikisync'
  import type { Levels } from './types/OSRS'

  let isSideNavOpen = false

  let player1: PlayerData = null
  let player2: PlayerData = null

  let unsubscribePlayer1
  let unsubscribePlayer2

  onMount(() => {
    unsubscribePlayer1 = player1Store.subscribe(value => (player1 = value))
    unsubscribePlayer2 = player2Store.subscribe(value =>  player2 = value)
  })

  onDestroy(() => {
    unsubscribePlayer1()
    unsubscribePlayer2()
  })

  const refreshPlayers = async () => {
    if (!player1 || !player2) return
    console.log('refreshing')
    const { data: p1 } = await fetchWikiSync(player1.username)
    const { data: p2 } = await fetchWikiSync(player2.username)
    player1Store.set(p1)
    player2Store.set(p2)
  }

  const swapPlayers = () => {
    console.log('swapping')
    const p1 = player1
    const p2 = player2
    player1Store.set(p2)
    player2Store.set(p1)

    // const p1 = player1
    // p1.levels.Smithing = 99
    // player1Store.set(p1)
  }

  const exit = () => {
    localStorage.removeItem('p1_username')
    localStorage.removeItem('p2_username')
    player1 = null
    player2 = null
  }
</script>

<main>
  <Header company="OSRS" platformName="Keep Up" bind:isSideNavOpen>
    <svelte:fragment slot="skip-to-content">
      <SkipToContent />
    </svelte:fragment>
    
    {#if player1 && player2 }
      <HeaderUtilities>
        <HeaderGlobalAction
          aria-label="Settings"
          icon={Renew}
          on:click={refreshPlayers}
        />
        <HeaderGlobalAction
          aria-label="Settings"
          icon={ArrowsHorizontal}
          on:click={swapPlayers}
        />
        <HeaderGlobalAction
          aria-label="Settings"
          icon={Logout}
          on:click={exit}
        />
      </HeaderUtilities>
    {/if}
  </Header>

  <Content>
    <Grid>
      <Row>
        {#if !player1 || !player2}
          <Column>
            <PlayersForm />
          </Column>
        {:else}
          <Column>
            <PlayersDetails/>
          </Column>
        {/if}
      </Row>
    </Grid>
  </Content>
</main>

<style>
</style>
