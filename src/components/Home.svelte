<script lang="ts">
  import { push, querystring, location } from 'svelte-spa-router'
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
  import { playersStore, fetching } from '../stores'
  import { parseQueryString } from '../lib/routingUtils'
  //   import { ark_i, ark_v } from '../mocks/players'

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

  let history: string[] = getHistory()
  let p1_username = ''
  let p2_username = ''
  let p1_error = ''
  let p2_error = ''

  $: history_1 = history.filter(u => u != p2_username)
  $: history_2 = history.filter(u => u != p1_username)

  // If usernames in querystring, extract and set them
  $: {
    const { p1_un, p2_un, redirect } = parseQueryString($querystring)
    if (p1_un) p1_username = p1_un
    if (p2_un) p2_username = p2_un

    // If usernames in querystring:
    if (p1_un && p2_un) {
      // For some reason this runs even when at another route,
      // perhaps because component is still mounted,
      // so we need to check if we're actually at home

      if ($location == '/') {
        // 1. Clear querystring leaving only redirect
        let path = '/'
        if (redirect) path += `?redirect=${redirect}`
        push(path)
        // 2. Try to fetch players
        fetchPlayers(p1_username, p2_username)
      }
    }
  }

  const formSubmit = (e: Event) => {
    e.preventDefault()

    p1_error = ''
    p2_error = ''
    if (!p1_username) return (p1_error = 'Enter your username')
    if (!p2_username) return (p2_error = "Enter your friend's username")

    p1_username = p1_username.trim()
    p2_username = p2_username.trim()

    if (p1_username.toLocaleLowerCase() == p2_username.toLocaleLowerCase())
      return (p2_error = "You can't compare yourself to yourself :(")

    fetchPlayers(p1_username, p2_username)
  }

  const fetchPlayers = async (p1_username, p2_username) => {
    if ($fetching) return

    fetching.set(true)
    const { data: player1, error: error1 } = await fetchWikiSync(p1_username)
    const { data: player2, error: error2 } = await fetchWikiSync(p2_username)
    // simulate fetch for 1 second
    // await new Promise(resolve => setTimeout(resolve, 1000))
    fetching.set(false)

    if (error1) p1_error = error1
    if (error2) p2_error = error2

    if (player1 && player2) {
      localStorage.setItem('p1_username', player1.username)
      localStorage.setItem('p2_username', player2.username)
      const players: [PlayerData, PlayerData] = [player1, player2]
      players.forEach(p => saveHistory(p.username))
      playersStore.set(players)
    }

    // There was an error
    else {

    }
  }

</script>

<div class="narrow">
  <Form on:submit={formSubmit}>
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

    {#if !$fetching}
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
