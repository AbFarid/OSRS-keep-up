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
    Button,
  } from 'carbon-components-svelte'
  import { tiers, type Tier, type CombatAchievement } from '../types/OSRS'
  import { fetching, playersStore } from '../stores'
  import TYPELESS_CB_ACH from '../data/combat-achievements.json'
  import DiffTag from './DiffTag.svelte'
  import { getImg, getTierIcon } from '../lib/iconUtils'
  import { Checkmark, CheckmarkFilled, Misuse } from 'carbon-icons-svelte'
  import TasksAll from './icons/TasksAll.svelte'
  import TasksDiff from './icons/TasksDiff.svelte'
  import TasksCatchUp from './icons/TasksCatchUp.svelte'
  import Robot from './pictograms/Robot.svelte'

  const CB_ACH_ALL = TYPELESS_CB_ACH as CombatAchievement[]
  const CB_ACH = {
    Easy: CB_ACH_ALL.filter(a => a.tier == 'Easy'),
    Medium: CB_ACH_ALL.filter(a => a.tier == 'Medium'),
    Hard: CB_ACH_ALL.filter(a => a.tier == 'Hard'),
    Elite: CB_ACH_ALL.filter(a => a.tier == 'Elite'),
    Master: CB_ACH_ALL.filter(a => a.tier == 'Master'),
    Grandmaster: CB_ACH_ALL.filter(a => a.tier == 'Grandmaster'),
  }

  type FilterKinds = 'all' | 'catching_up' | 'different'
  let tasksFilter: FilterKinds = 'catching_up'

  type TierTab = Tier | 'All'
  const tabs: TierTab[] = ['All', ...tiers]

  $: player1 = $playersStore[0]
  $: player2 = $playersStore[1]
  $: loaded = player1 && player2 && !$fetching

  $: p1_cbach_all = player1?.combat_achievements.map(id =>
    CB_ACH_ALL.find(ach => ach.id == id)
  )
  $: p2_cbach_all = player2?.combat_achievements.map(id =>
    CB_ACH_ALL.find(ach => ach.id == id)
  )

  // $: p1_cbach_count = tiers.reduce((counts, tier) => {
  //   const count = p1_cbach_all?.filter(a => a.tier == tier).length
  //   counts[tier] = count
  //   return counts
  // }, {})
  // $: p2_cbach_count = tiers.reduce((counts, tier) => {
  //   const count = p2_cbach_all?.filter(a => a.tier == tier).length
  //   counts[tier] = count
  //   return counts
  // }, {})

  $: cbach_count_all = player2?.combat_achievements.filter(
    a => !player1?.combat_achievements.includes(a)
  ).length
  $: cbach_count = tiers.reduce((counts, tier) => {
    const count = p2_cbach_all
      ?.filter(a => a.tier == tier)
      .filter(a => !p1_cbach_all?.includes(a)).length
    counts[tier] = count
    return counts
  }, {})

  const getTasks = (tab: TierTab) => (tab == 'All' ? CB_ACH_ALL : CB_ACH[tab])

  const filterTasks = (ach: CombatAchievement[], f: FilterKinds) => {
    if (f == 'all') return ach

    // tasks that p2 has completed but p1 hasn't
    if (f == 'catching_up')
      return ach
        .filter(a => p2_cbach_all?.find(a2 => a2.id == a.id))
        .filter(a => !p1_cbach_all?.find(a1 => a1.id == a.id))

    // tasks that are completed by either player, but not both
    if (f == 'different')
      return ach.filter(a => {
        const p1_has = p1_cbach_all?.find(a1 => a1.id == a.id)
        const p2_has = p2_cbach_all?.find(a2 => a2.id == a.id)
        return p1_has || p2_has ? !(p1_has && p2_has) : false
      })
  }

  const clipTier = (t: TierTab) => (t == 'Grandmaster' ? 'GM' : t)
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
      <h4>
        {player1.username}
        <Tag class="ml-1">
          {p1_cbach_all.length} / {CB_ACH_ALL.length}
        </Tag>
      </h4>
      <h5>vs.</h5>
      <h4>
        {player2.username}
        <Tag class="ml-1">
          {p2_cbach_all.length} / {CB_ACH_ALL.length}
        </Tag>
      </h4>
    {:else}
      <SkeletonPlaceholder />
      <h5>vs.</h5>
      <SkeletonPlaceholder />
    {/if}
  </div>

  <div class="grid">
    <!-- Total Combat Achievements -->
    <Tile class="fh fw tile half-width">
      <div class="flex flex-grow">
        <img
          src={getImg('Combat_achievements_detail')}
          alt="Combat_achievements_icon"
          style="max-height: 38px"
          class="ma mt-1"
        />
      </div>

      {#if loaded}
        <div
          class="section mt-2"
          style="align-items: flex-end; margin-bottom: -4px;"
        >
          <!-- <Tag>
            {p1_cbach_all.length} / {CB_ACH_ALL.length}
          </Tag> -->

          <h3 class="mr-2">Total</h3>
          <i class="spacer" />

          {#if cbach_count_all == 0}
            <Tag class="mr-0" type="green" icon={Checkmark} />
          {:else}
            <DiffTag class="mr-0" diff={cbach_count_all} />
          {/if}
        </div>
      {:else}
        <SkeletonPlaceholder class="fw mt-1" style="height: 32px" />
      {/if}
    </Tile>

    <!-- Combat Achievements by Tier -->
    {#each tiers as tier}
      <Tile class="fh fw tile">
        <!--  {tierToClass(tier)} -->
        <div class="section">
          <div class="imgWrapper mr-2">
            <img src={getTierIcon(tier)} alt={`${tier}_icon`} />
          </div>

          <h6 class="mr-2">{clipTier(tier)}</h6>
          <i class="spacer" />

          {#if cbach_count[tier] == 0}
            <Tag class="mr-0" size="sm" type="green" icon={Checkmark} />
          {:else}
            <DiffTag class="mr-0" sm diff={cbach_count[tier]} />
          {/if}
        </div>
        <!-- 
        {#if loaded}
          <div class="section mt-3">
            <Tag size="sm" class="mr-1">

              {p1_cbach_count[tier]} / {CB_ACH[tier].length}
            </Tag>
          </div>
        {:else}
          <SkeletonPlaceholder class="fw" style="height: 20px" />
        {/if} -->
      </Tile>
    {/each}
  </div>

  <Tile class="p0 mt-3">
    <Tabs type="container" autoWidth>
      {#each tabs as tab}
        <Tab label={clipTier(tab)} />
      {/each}

      <svelte:fragment slot="content">
        <!-- Per tier tabs -->
        {#each tabs as tab}
          {@const tasks = getTasks(tab)}
          {@const tasks_filtered = filterTasks(tasks, tasksFilter)}
          <TabContent>
            <div class="fw list-controls">
              <span class="ml-4 mr-2">Showing:</span>

              {#if loaded}
                <Tag>
                  {tasks_filtered?.length || 0} / {tasks.length}
                </Tag>
              {:else}
                <SkeletonPlaceholder style="height: 24px; width: 50px" />
              {/if}

              <i class="spacer" />

              <div class="btn-set mr-2">
                <Button
                  isSelected={tasksFilter == 'catching_up'}
                  kind="ghost"
                  iconDescription="Tasks to catch up"
                  icon={TasksCatchUp}
                  on:click={() => (tasksFilter = 'catching_up')}
                />

                <Button
                  isSelected={tasksFilter == 'different'}
                  kind="ghost"
                  iconDescription="Mismatched tasks"
                  icon={TasksDiff}
                  on:click={() => (tasksFilter = 'different')}
                />

                <Button
                  isSelected={tasksFilter == 'all'}
                  kind="ghost"
                  icon={TasksAll}
                  iconDescription="All tasks"
                  on:click={() => (tasksFilter = 'all')}
                />
              </div>
            </div>

            {#if tasks_filtered?.length}
              <StructuredList class="fw mb-0" condensed>
                <StructuredListHead>
                  <StructuredListRow>
                    <StructuredListCell head>Task</StructuredListCell>

                    <StructuredListCell
                      head
                      class="ta-c"
                      style="min-width: 60px"
                    >
                      You
                      <!-- {#if loaded}
                      {player1?.username || '-'}
                    {:else}
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    {/if} -->
                    </StructuredListCell>

                    <StructuredListCell
                      head
                      class="ta-c"
                      style="min-width: 60px"
                    >
                      Them
                      <!-- {#if loaded}
                      {player2?.username || '-'}
                    {:else}
                      <SkeletonPlaceholder class="fw" style="height: 20px" />
                    {/if} -->
                    </StructuredListCell>
                  </StructuredListRow>
                </StructuredListHead>

                {#if loaded}
                  <StructuredListBody>
                    {#each tasks_filtered as ach}
                      <StructuredListRow>
                        <StructuredListCell class="ta-l">
                          <div class="task">
                            <div class="section">
                              <h6>{ach.name}</h6>

                              {#if tab == 'All'}
                                <Tag
                                  class="ml-2 bold {tierToClass(ach.tier)}"
                                  size="sm"
                                >
                                  {ach.tier}
                                </Tag>
                              {/if}

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
                          <SkeletonPlaceholder
                            class="fw"
                            style="height: 20px"
                          />
                        </StructuredListCell>

                        <StructuredListCell class="ta-l">
                          <SkeletonPlaceholder
                            class="fw"
                            style="height: 20px"
                          />
                        </StructuredListCell>

                        <StructuredListCell class="ta-l">
                          <SkeletonPlaceholder
                            class="fw"
                            style="height: 20px"
                          />
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
            {:else}
              <div class="empty-list-warning">
                <Robot size={64} />

                <div>
                  <h4 class="mb-1">No tasks to show</h4>
                  <h6>Try changing the filter</h6>
                </div>
              </div>
            {/if}
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
