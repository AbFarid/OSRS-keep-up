<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from 'carbon-components-svelte'
  import type { PlayerData } from '../api/wikisync'
  import type { Levels, SkillNames } from '../types/OSRS'
  import { player1Store, player2Store } from '../stores'
  import Skills from './Skills.svelte'

  export let player1: PlayerData = null
  export let player2: PlayerData = null

  // let unsubscribePlayer1
  // let unsubscribePlayer2

  // onMount(() => {
  //   unsubscribePlayer1 = player1Store.subscribe(value => (player1 = value))
  //   unsubscribePlayer2 = player2Store.subscribe(value => (player2 = value))

  //   console.log({ player1, player2 })
  // })

  // onDestroy(() => {
  //   unsubscribePlayer1()
  //   unsubscribePlayer2()
  // })

  let differences: LevelDifference[] = []

  type LevelDifference = {
    skill: SkillNames
    difference: number
  }

  // when players change, calculate the differences between their levels
  $: if (player1 && player2) {
    differences = []

    for (const skill in player1.levels) {
      if (skill == 'Overall') continue
      if (skill in player2.levels) {
        const difference = player2.levels[skill]! - player1.levels[skill]!
        differences.push({  skill: skill as SkillNames, difference })
      }
    }

    differences.sort((a, b) => b.difference - a.difference)
  }
</script>

<StructuredList condensed style="margin-bottom:0">
  <StructuredListHead class="centered">
    <StructuredListRow head>
      <StructuredListCell head>{player1.username}</StructuredListCell>
      <StructuredListCell head>Difference</StructuredListCell>
      <StructuredListCell head>{player2.username}</StructuredListCell>
    </StructuredListRow>
  </StructuredListHead>

  <StructuredListBody>
    {#each differences as { skill, difference } (skill)}
      <StructuredListRow>
        <StructuredListCell noWrap>
          {skill} ({player1.levels[skill]})
        </StructuredListCell>
        <StructuredListCell>{difference}</StructuredListCell>
        <StructuredListCell noWrap>
          {skill} ({player2.levels[skill]})
        </StructuredListCell>
      </StructuredListRow>
    {/each}
  </StructuredListBody>
</StructuredList>