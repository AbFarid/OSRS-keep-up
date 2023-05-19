<script>
  import { SideNav, SideNavItems, SideNavLink } from "carbon-components-svelte"
  import { SkillLevelIntermediate, Compass, Music, IbmWatsonKnowledgeCatalog, Trophy } from "carbon-icons-svelte"

  export let isSideNavOpen = false
  export let location = ''
  export let querystring = ''

  // other breakpoint values don't work :(
  let breakpoint = 1056
  let innerWidth = 0
  $: rail = innerWidth > breakpoint ? false : true


  const links = [
    { text: 'Skills', href: `/skills`, icon: SkillLevelIntermediate },
    { text: 'Quests', href: `/quests`, icon: Compass },
    { text: 'Music', href: '/music', icon: Music },
    { text: 'Diary', href: '/diary', icon: IbmWatsonKnowledgeCatalog },
    { text: 'Combat Achievements', href: '/combat', icon: Trophy },
  ]

</script>

<svelte:window bind:innerWidth />

<SideNav bind:isOpen={isSideNavOpen} {rail} expansionBreakpoint={breakpoint}>
  <SideNavItems>

    {#each links as { text, href, icon }}
      <SideNavLink href={`#${href}?${querystring}`} {icon} {text} isSelected={location === href} />
    {/each}

  </SideNavItems>
</SideNav>