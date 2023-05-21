<script lang="ts">
  import {
    Header,
    SkipToContent,
    HeaderUtilities,
    HeaderGlobalAction,
    Loading,
    Button,
  } from 'carbon-components-svelte'
  import { Renew, ArrowsHorizontal, Logout } from 'carbon-icons-svelte'
  import { fetchWikiSync, type PlayerData } from '../api/wikisync'
  import { playersStore, swapping, clearing, fetching } from '../stores'

  export let player1: PlayerData = null
  export let player2: PlayerData = null
  export let isSideNavOpen = false
  $: loaded = !!(player1 && player2)

  const refreshPlayers = async () => {
    if (!loaded || $fetching) return
    console.log('Refreshing players...')
    $fetching = true
    const { data: p1 } = await fetchWikiSync(player1.username)
    const { data: p2 } = await fetchWikiSync(player2.username)
    playersStore.set([p1, p2])
    $fetching = false
    console.log('Players refreshed!')
  }

  const swapPlayers = () => {
    console.log('Swapping players...')
    swapping.set(true)
    playersStore.set([player2, player1])

    // const p1 = player1
    // p1.levels.Smithing = 99
    // player1Store.set(p1)
  }

  const exit = () => {
    console.log('Clearing players...')
    localStorage.removeItem('p1_username')
    localStorage.removeItem('p2_username')
    clearing.set(true)
    playersStore.set([null, null])
  }
</script>

<Header
  company="OSRS"
  platformName="Keep Up!"
  persistentHamburgerMenu={false}
  bind:isSideNavOpen
>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>

  {#if loaded}
    <HeaderUtilities>
      {#if !$fetching}
        <HeaderGlobalAction
          aria-label="Settings"
          icon={Renew}
          on:click={refreshPlayers}
        />
      {:else}
        <div style="padding: 16px">
          <Loading withOverlay={false} small />
        </div>
      {/if}
      <HeaderGlobalAction
        aria-label="Settings"
        icon={ArrowsHorizontal}
        on:click={swapPlayers}
      />
      <HeaderGlobalAction aria-label="Settings" icon={Logout} on:click={exit} />
    </HeaderUtilities>
  {/if}
</Header>
