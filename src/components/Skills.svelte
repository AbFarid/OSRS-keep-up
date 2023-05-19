<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListSkeleton,
  } from 'carbon-components-svelte'
  import { push } from 'svelte-spa-router'
  import type { PlayerData } from '../api/wikisync'
  import { AllSkills, type Levels, type SkillNames } from '../types/OSRS'
  import { playersStore } from '../stores'

  $: player1 = $playersStore[0]
  $: player2 = $playersStore[1]
  $: loaded = player1 && player2

  type LevelDifference = {
    skill: SkillNames
    difference: number
  }
  let differences: LevelDifference[] = []

  // when players change, calculate the differences between their levels
  $: if (player1 && player2) {
    differences = []

    for (const skill in player1.levels) {
      if (skill == 'Overall') continue
      if (skill in player2.levels) {
        const difference = player2.levels[skill]! - player1.levels[skill]!
        differences.push({ skill: skill as SkillNames, difference })
      }
    }

    differences.sort((a, b) => b.difference - a.difference)
  }
</script>

<div class="narrow">
  {#if !loaded}
    <StructuredListSkeleton rows={15} style="margin-bottom:0" />
  {:else}
    <StructuredList condensed style="margin-bottom:0">
      <StructuredListHead class="centered">
        <StructuredListRow head>
          <StructuredListCell head>
            {player1?.username || '-'}
          </StructuredListCell>
          <StructuredListCell head>Difference</StructuredListCell>
          <StructuredListCell head>
            {player2?.username || '-'}
          </StructuredListCell>
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
  {/if}
</div>

<style scoped lang="scss">
  .narrow {
    max-width: 600px;
    margin: auto;
    display: flex;
    flex-direction: column;
  }
</style>
