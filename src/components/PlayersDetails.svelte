<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import {
    ContentSwitcher,
    Switch,
  } from 'carbon-components-svelte'
  import type { PlayerData } from '../api/wikisync'
  import { player1Store, player2Store } from '../stores'
  import Skills from './Skills.svelte'

  let selectedIndex = 0
  const switches = [
    { label: 'Skills', disabled: false },
    { label: 'Quests', disabled: true },
    { label: 'Diary Achiev.', disabled: true },
    { label: 'Combat Achiev.', disabled: true },
  ]

  let player1: PlayerData = null
  let player2: PlayerData = null
  let unsubscribePlayer1
  let unsubscribePlayer2

  onMount(() => {
    unsubscribePlayer1 = player1Store.subscribe(value => (player1 = value))
    unsubscribePlayer2 = player2Store.subscribe(value => (player2 = value))

    console.log({ player1, player2 })
  })

  onDestroy(() => {
    unsubscribePlayer1()
    unsubscribePlayer2()
  })
</script>

<ContentSwitcher bind:selectedIndex style="margin-bottom:30px">
  {#each switches as { label, disabled }, i}
    <Switch text="{label}" disabled="{disabled}" />
  {/each}
</ContentSwitcher>

{#if player1 && player2}

  {#if switches[selectedIndex].label == 'Skills'}
    <Skills player1="{player1}" player2="{player2}" />
  {:else}
    <p>Coming soon</p>
  {/if}

{/if}
