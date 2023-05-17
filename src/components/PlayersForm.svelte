<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import {
    TextInput,
    Button,
    Loading,
    Form,
    OverflowMenu,
    OverflowMenuItem,
  } from 'carbon-components-svelte'
  import RecentlyViewed from 'carbon-icons-svelte/lib/RecentlyViewed.svelte'
  import Lightning from 'carbon-icons-svelte/lib/Lightning.svelte'
  import { fetchWikiSync, type PlayerData } from '../api/wikisync'

  import { player1Store, player2Store } from '../stores'
  import { ark_i, ark_v } from '../mocks/players'

  const dispatch = createEventDispatcher()

  function emitPlayers(players: [PlayerData, PlayerData]) {
    dispatch('players', players)
  }

  function getHistory(): string[] {
    const history = localStorage.getItem('history')
    if (!history) return []
    return JSON.parse(history)
  }

  function saveHistory(username: string) {
    const history = getHistory()
    const historyLC = history.map(u => u.toLocaleLowerCase())
    if (historyLC.includes(username.toLocaleLowerCase())) return
    history.push(username)

    if (history.length > 6) history.shift()
    localStorage.setItem('history', JSON.stringify(history))
  }

  let fetching = false
  let history: string[] = getHistory()
  let p1_username = localStorage.getItem('p1_username') || ''
  let p2_username = localStorage.getItem('p2_username') || ''
  let p1_error = ''
  let p2_error = ''

  let history_1 = []
  let history_2 = []
  $: history_1 = history.filter(u => u != p2_username)
  $: history_2 = history.filter(u => u != p1_username)

  const fetchPlayers = async (e?: Event) => {
    if (e) e.preventDefault()

    p1_error = ''
    p2_error = ''

    if (!p1_username) return (p1_error = 'Enter your username')
    if (!p2_username) return (p2_error = "Enter your friend's username")

    if (p1_username.toLocaleLowerCase() == p2_username.toLocaleLowerCase())
      return (p2_error = "You can't compare yourself to yourself :(")

    if (fetching) return
    fetching = true

    const { data: player1, error: error1 } = await fetchWikiSync(p1_username)
    const { data: player2, error: error2 } = await fetchWikiSync(p2_username)

    // simulate fetch for 1 second
    // await new Promise(resolve => setTimeout(resolve, 1000))

    fetching = false

    if (error1) p1_error = error1
    if (error2) p2_error = error2

    if (player1 && player2) {
      localStorage.setItem('p1_username', p1_username)
      localStorage.setItem('p2_username', p2_username)
      saveHistory(p1_username)
      saveHistory(p2_username)
      player1Store.set(player1)
      player2Store.set(player2)
    }

    // TODO: Remove this mock
    // const player1 = ark_v as PlayerData
    // const player2 = ark_i as PlayerData
  }

  // Fetch players on page load if usernames are set
  if (p1_username && p2_username) fetchPlayers()

  // let p1_username = 'Arkantis V'
  // let p2_username = 'Arkantis I'
</script>

<div class="narrow">
  <Form on:submit={fetchPlayers}>
    <div class="input-with-overflow">
      <TextInput
        labelText="Your username"
        placeholder="Ex.: Zezima"
        invalid={!!p1_error}
        invalidText={p1_error}
        bind:value={p1_username}
      />

      {#if history.length > 0}
        <OverflowMenu flipped icon={RecentlyViewed}>
          {#each history_1 as username}
            <OverflowMenuItem
              text={username}
              on:click={() => (p1_username = username)}
            />
          {/each}
        </OverflowMenu>
      {/if}
    </div>

    <div class="input-with-overflow">
      <TextInput
        labelText="Your friend's username"
        placeholder="Ex.: Strong Guard"
        invalid={!!p2_error}
        invalidText={p2_error}
        bind:value={p2_username}
      />

      {#if history.length > 0}
        <OverflowMenu flipped icon={RecentlyViewed}>
          {#each history_2 as username}
            <OverflowMenuItem
              text={username}
              on:click={() => (p2_username = username)}
            />
          {/each}
        </OverflowMenu>
      {/if}
    </div>

    {#if !fetching}
      <Button type="submit" icon={Lightning}>Keep Up!</Button>
    {:else}
      <Button style="padding: 15px 60px" disabled>
        <Loading withOverlay={false} small />
      </Button>
    {/if}
    <!-- <Checkbox id="checkbox-0" labelText="Checkbox Label" checked /> -->
  </Form>
</div>

<style scoped lang="scss">
  .input-with-overflow {
    margin-bottom: 40px;
  }

  .narrow {
    max-width: 300px;
    margin: auto;
    display: flex;
    flex-direction: column;
  }
</style>
