<script lang="ts">
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListSkeleton,
    Tag,
    Popover,
    SkeletonPlaceholder,
  } from 'carbon-components-svelte'
  import type { Levels, SkillNames } from '../types/OSRS'
  import type { PlayerData } from '../api/wikisync'
  import { fetching, playersStore } from '../stores'
  import { getIcon, getSkillIcon } from '../lib/iconUtils'
  import DiffTag from './DiffTag.svelte'
  import { calcCombatLevel } from '../lib/playerUtils'
  import { popoverHoverOpen } from '../lib/utils'

  let player1: PlayerData = null
  let player2: PlayerData = null

  $: player1 = $playersStore[0]
  $: player2 = $playersStore[1]
  $: loaded = player1 && player2 && !$fetching
  $: overallDiff = player2?.levels.Overall - player1?.levels.Overall || 0

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

  $: player1_cb_full = calcCombatLevel(player1?.levels, false)
  $: player2_cb_full = calcCombatLevel(player2?.levels, false)
  $: player1_cb = player1_cb_full?.split('.')[0]
  $: player2_cb = player2_cb_full?.split('.')[0]
</script>

<div id="skills" class="narrow">
  <!-- <StructuredListSkeleton rows={15} style="margin-bottom:0" /> -->

  <StructuredList condensed flush style="margin-bottom:0">
    <StructuredListHead>
      <StructuredListRow head>
        <StructuredListCell head>&nbsp;</StructuredListCell>

        <StructuredListCell head>
          {#if loaded}
            {player1?.username || '-'}
            <div use:popoverHoverOpen class="popoverWrapper">
              <Tag size="sm" type="high-contrast">
                {player1_cb}
              </Tag>

              <Popover caret highContrast>
                <div style="padding: 10px">
                  <div class="imgWrapper fl mr-2">
                    <img
                      src={getIcon('Attack_style')}
                      alt="Attack_style_icon"
                    />
                  </div>
                  {player1_cb_full}
                </div>
              </Popover>
            </div>
          {:else}
            <SkeletonPlaceholder class="fw" style="height: 26px" />
          {/if}
        </StructuredListCell>

        <StructuredListCell head class="centered">Diff.</StructuredListCell>

        <StructuredListCell head>
          {#if loaded}
            {player2?.username || '-'}
            <div use:popoverHoverOpen class="popoverWrapper">
              <Tag size="sm" type="high-contrast">
                {player2_cb}
              </Tag>
              <Popover caret highContrast>
                <div style="padding: 10px">
                  <div class="imgWrapper fl mr-2">
                    <img
                      src={getIcon('Attack_style')}
                      alt="Attack_style_icon"
                    />
                  </div>
                  {player2_cb_full}
                </div>
              </Popover>
            </div>
          {:else}
            <SkeletonPlaceholder class="fw" style="height: 26px" />
          {/if}
        </StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>

    <StructuredListBody>
      <StructuredListRow>
        <StructuredListCell head>
          <div class="imgWrapper fr ml-2">
            <img src={getIcon('Stats')} alt={`Stats_icon`} />
          </div>
        </StructuredListCell>

        <StructuredListCell noWrap>
          <b>Total</b>

          {#if loaded}
            <Tag size="sm" type="gray"><b>{player1.levels.Overall}</b></Tag>
          {:else}
            <SkeletonPlaceholder style="height: 26px; width: 50px" />
          {/if}
        </StructuredListCell>

        <StructuredListCell>
          {#if loaded}
            <DiffTag diff={overallDiff} sm bold />
          {:else}
            <SkeletonPlaceholder
              class="height-adjusted"
              style="height: 26px; width: 40px"
            />
          {/if}
        </StructuredListCell>

        <StructuredListCell noWrap>
          <b>Total</b>
          {#if loaded}
            <Tag size="sm" type="gray"><b>{player2.levels.Overall}</b></Tag>
          {:else}
            <SkeletonPlaceholder style="height: 26px; width: 50px" />
          {/if}
        </StructuredListCell>
      </StructuredListRow>

      {#each differences as { skill, difference } (skill)}
        <StructuredListRow>
          <StructuredListCell head>
            <div class="imgWrapper fr ml-2">
              <img src={getSkillIcon(skill)} alt={`${skill}_icon`} />
            </div>
          </StructuredListCell>

          <StructuredListCell noWrap>
            {skill}

            {#if loaded}
              <Tag size="sm" type="gray">{player1.levels[skill]}</Tag>
            {:else}
              <SkeletonPlaceholder style="height: 26px; width: 40px" />
            {/if}
          </StructuredListCell>

          <StructuredListCell>
            {#if loaded}
              <DiffTag diff={difference} sm />
            {:else}
              <SkeletonPlaceholder
                class="height-adjusted"
                style="height: 26px; width: 40px"
              />
            {/if}
          </StructuredListCell>

          <StructuredListCell noWrap>
            {skill}
            {#if loaded}
              <Tag size="sm" type="gray">{player2.levels[skill]}</Tag>
            {:else}
              <SkeletonPlaceholder style="height: 26px; width: 40px" />
            {/if}
          </StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
</div>

<style scoped lang="scss">
  b {
    font-weight: 600 !important;
  }
  .narrow {
    max-width: 600px;
    margin: auto;
    display: flex;
    flex-direction: column;
  }

  .imgWrapper {
    display: flex;
    width: 25px;
    height: 100%;

    img {
      margin: auto;
    }
  }

  .popoverWrapper {
    top: -2px;
  }
</style>
