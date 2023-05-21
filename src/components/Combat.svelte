<script lang="ts">
  import {
    Tag,
    Accordion,
    AccordionItem,
    Tile,
    SkeletonPlaceholder,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListHead,
    StructuredListRow,
    Tab,
    TabContent,
    Tabs,
  } from 'carbon-components-svelte'
  import { tiers, type Tier, type CombatAchievement } from '../types/OSRS'
  import { fetching, playersStore } from '../stores'
  import TYPELESS_CB_ACH from '../data/combat-achievements.json'
  import DiffTag from './DiffTag.svelte'
  import { getImg, getTierIcon } from '../lib/iconUtils'
  import { Checkmark, CheckmarkFilled, Misuse } from 'carbon-icons-svelte'

  const CB_ACH_ALL = TYPELESS_CB_ACH as CombatAchievement[]
  const CB_ACH = {
    Easy: CB_ACH_ALL.filter(a => a.tier == 'Easy'),
    Medium: CB_ACH_ALL.filter(a => a.tier == 'Medium'),
    Hard: CB_ACH_ALL.filter(a => a.tier == 'Hard'),
    Elite: CB_ACH_ALL.filter(a => a.tier == 'Elite'),
    Master: CB_ACH_ALL.filter(a => a.tier == 'Master'),
    Grandmaster: CB_ACH_ALL.filter(a => a.tier == 'Grandmaster'),
  }

  $: player1 = $playersStore[0]
  $: player2 = $playersStore[1]
  $: loaded = player1 && player2 && !$fetching

  $: p1_cbach_all = player1?.combat_achievements.map(id =>
    CB_ACH_ALL.find(ach => ach.id == id)
  )
  $: p2_cbach_all = player2?.combat_achievements.map(id =>
    CB_ACH_ALL.find(ach => ach.id == id)
  )

  $: p1_cbach_count = tiers.reduce((counts, tier) => {
    const count = p1_cbach_all?.filter(a => a.tier == tier).length
    counts[tier] = count
    return counts
  }, {})
  // $: p2_cbach_count = tiers.reduce((counts, tier) => {
  //   const count = p2_cbach_all?.filter(a => a.tier == tier).length
  //   counts[tier] = count
  //   return counts
  // }, {})

  $: catching_up = p2_cbach_all?.filter(a => !p1_cbach_all?.includes(a))
  $: cbach_count_all = player2.combat_achievements.filter(
    a => !player1.combat_achievements.includes(a)
  ).length
  $: cbach_count = tiers.reduce((counts, tier) => {

    const count = p2_cbach_all
      ?.filter(a => a.tier == tier)
      .filter(a => !p1_cbach_all?.includes(a)).length
    counts[tier] = count
    return counts
  }, {})

  const clipTier = (t: Tier) => (t == 'Grandmaster' ? 'Grandm.' : t)
  const tierToClass = (t: Tier) =>
    ({
      Easy: 'bronze',
      Medium: 'steel',
      Hard: 'black',
      Elite: 'rune',
      Master: 'dragon',
      Grandmaster: 'bandos',
    }[t])
</script>

<div id="combat">
  <h1>Combat Achievements</h1>

  <div class="versus">
    {#if loaded}
      <h4>{player1.username}</h4>
      <h5>vs.</h5>
      <h4>{player2.username}</h4>
    {:else}
      <SkeletonPlaceholder />
      <h5>vs.</h5>
      <SkeletonPlaceholder />
    {/if}
  </div>

  <div class="grid">
    <Tile class="fh fw tile half-width">
      <div style="display: flex">
        <img
          src={getImg('Combat_achievements_detail')}
          alt="Combat_achievements_icon"
          width="80px"
          class="ma mt-2 pr-2"
        />
      </div>

      <h3 class="mt-4">Total</h3>

      {#if loaded}
        <div class="section mt-1">
          <Tag>
            {p1_cbach_all.length} / {CB_ACH_ALL.length}
          </Tag>

          {#if cbach_count_all == 0}
            <Tag type="green" icon={Checkmark} />
          {:else}
            <DiffTag diff={cbach_count_all} />
          {/if}
        </div>
      {:else}
        <SkeletonPlaceholder class="fw mt-1" style="height: 32px" />
      {/if}
    </Tile>

    {#each tiers as tier}
      <Tile class="fh fw tile">
        <!--  {tierToClass(tier)} -->
        <div class="section">
          <div class="imgWrapper mr-2">
            <img src={getTierIcon(tier)} alt={`${tier}_icon`} />
          </div>
          <h6>{clipTier(tier)}</h6>
        </div>

        {#if loaded}
          <div class="section mt-3">
            <Tag size="sm" class="mr-1">
              <!--  {tierToClass(tier)} -->
              {p1_cbach_count[tier]} / {CB_ACH[tier].length}
            </Tag>

            {#if cbach_count[tier] == 0}
              <Tag size="sm" type="green" icon={Checkmark} />
            {:else}
              <DiffTag sm diff={cbach_count[tier]} />
            {/if}
          </div>
        {:else}
          <SkeletonPlaceholder class="fw" style="height: 20px" />
        {/if}
      </Tile>
    {/each}
  </div>

  <Tile class="p0 mt-3">
    <Tabs type="container" autoWidth>
      <Tab label="Catch up" />
      {#each tiers as tier}
        <Tab label={clipTier(tier)} />
      {/each}

      <svelte:fragment slot="content">
        <TabContent>
          <StructuredList class="fw mb-0" condensed>
            <StructuredListHead>
              <StructuredListRow>
                <StructuredListCell head>Task</StructuredListCell>

                <StructuredListCell head class="ta-c" style="min-width: 120px">
                  {#if loaded}
                    {player1?.username || '-'}
                  {:else}
                    <SkeletonPlaceholder class="fw" style="height: 20px" />
                  {/if}
                </StructuredListCell>

                <StructuredListCell head class="ta-c" style="min-width: 120px">
                  {#if loaded}
                    {player2?.username || '-'}
                  {:else}
                    <SkeletonPlaceholder class="fw" style="height: 20px" />
                  {/if}
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>

            {#if loaded}
              <StructuredListBody>
                {#each catching_up as ach}
                  <StructuredListRow>
                    <StructuredListCell class="ta-l">
                      <div class="task">
                        <div class="section">
                          <h6>{ach.name}</h6>
                          <Tag
                            class="ml-2 bold {tierToClass(ach.tier)}"
                            size="sm"
                          >
                            {ach.tier}
                          </Tag>

                          <Tag
                            type="outline"
                            size="sm"
                            class="ml-2 bold"
                            style="opacity:0.3"
                          >
                            {ach.type}
                          </Tag>
                        </div>

                        {ach.description}
                      </div>
                    </StructuredListCell>

                    <StructuredListCell class="icon-offset">
                      {#if p1_cbach_all.find(a => a.id == ach.id)}
                        <CheckmarkFilled size={24} class="success" />
                      {:else}
                        <Misuse size={24} class="error" />
                      {/if}
                    </StructuredListCell>

                    <StructuredListCell class="icon-offset">
                      {#if p2_cbach_all.find(a => a.id == ach.id)}
                        <CheckmarkFilled size={24} class="success" />
                      {:else}
                        <Misuse size={24} class="error" />
                      {/if}
                    </StructuredListCell>
                  </StructuredListRow>
                {/each}
              </StructuredListBody>
            {:else}
              <StructuredListBody>
                {#each Array(5) as row}
                  <StructuredListRow>
                    <StructuredListCell class="ta-l fw">
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    </StructuredListCell>
                    <StructuredListCell class="ta-l">
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    </StructuredListCell>
                    <StructuredListCell class="ta-l">
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    </StructuredListCell>
                  </StructuredListRow>
                {/each}
                <StructuredListRow style=" opacity:0.3">
                  <StructuredListCell class="ta-l">
                    <SkeletonPlaceholder class="fw" style="height: 20px" />
                  </StructuredListCell>
                  <StructuredListCell class="ta-l">
                    <SkeletonPlaceholder class="fw" style="height: 20px" />
                  </StructuredListCell>
                  <StructuredListCell class="ta-l">
                    <SkeletonPlaceholder class="fw" style="height: 20px" />
                  </StructuredListCell>
                </StructuredListRow>
              </StructuredListBody>
            {/if}
          </StructuredList>
        </TabContent>

        {#each tiers as tier}
          <TabContent>
            <StructuredList class="fw mb-0" condensed>
              <StructuredListHead>
                <StructuredListRow>
                  <StructuredListCell head>Task</StructuredListCell>

                  <StructuredListCell
                    head
                    class="ta-c"
                    style="min-width: 120px"
                  >
                    {#if loaded}
                      {player1?.username || '-'}
                    {:else}
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    {/if}
                  </StructuredListCell>

                  <StructuredListCell
                    head
                    class="ta-c"
                    style="min-width: 120px"
                  >
                    {#if loaded}
                      {player2?.username || '-'}
                    {:else}
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    {/if}
                  </StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>

              {#if loaded}
                <StructuredListBody>
                  {#each CB_ACH[tier] as ach}
                    <StructuredListRow>
                      <StructuredListCell class="ta-l">
                        <div class="task">
                          <div class="section">
                            <h6>{ach.name}</h6>

                            <Tag
                              type="outline"
                              size="sm"
                              class="ml-2 bold"
                              style="opacity:0.4"
                            >
                              {ach.type}
                            </Tag>
                          </div>

                          {ach.description}
                        </div>
                      </StructuredListCell>

                      <StructuredListCell class="icon-offset">
                        {#if p1_cbach_all.find(a => a.id == ach.id)}
                          <CheckmarkFilled size={24} class="success" />
                        {:else}
                          <Misuse size={24} class="error" />
                        {/if}
                      </StructuredListCell>

                      <StructuredListCell class="icon-offset">
                        {#if p2_cbach_all.find(a => a.id == ach.id)}
                          <CheckmarkFilled size={24} class="success" />
                        {:else}
                          <Misuse size={24} class="error" />
                        {/if}
                      </StructuredListCell>
                    </StructuredListRow>
                  {/each}
                </StructuredListBody>
              {:else}
                <StructuredListBody>
                  {#each Array(5) as row}
                    <StructuredListRow>
                      <StructuredListCell class="ta-l fw">
                        <SkeletonPlaceholder class="fw" style="height: 20px" />
                      </StructuredListCell>
                      
                      <StructuredListCell class="ta-l">
                        <SkeletonPlaceholder class="fw" style="height: 20px" />
                      </StructuredListCell>

                      <StructuredListCell class="ta-l">
                        <SkeletonPlaceholder class="fw" style="height: 20px" />
                      </StructuredListCell>
                    </StructuredListRow>
                  {/each}
                  <StructuredListRow style=" opacity:0.3">
                    <StructuredListCell class="ta-l">
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    </StructuredListCell>

                    <StructuredListCell class="ta-l">
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    </StructuredListCell>

                    <StructuredListCell class="ta-l">
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    </StructuredListCell>
                  </StructuredListRow>
                </StructuredListBody>
              {/if}
            </StructuredList>
          </TabContent>
        {/each}
      </svelte:fragment>
    </Tabs>
  </Tile>

  <!-- <br>
  {#each tiers as tier}
    <Tag class="bold {tierToClass(tier)}" >{tier}</Tag>
  {/each} -->

  <!-- <Accordion>
    <AccordionItem>
      <svelte:fragment slot="title">
        <h5>Achievements to Catch Up</h5>
        <div>Subtitle?</div>
      </svelte:fragment>
    </AccordionItem>
  </Accordion> -->
</div>
