<script lang="ts">
  import { CaretUp, CaretDown } from "carbon-icons-svelte"
  import { Equal } from "./icons"
  import { Tag } from "carbon-components-svelte"

  export let diff = 0
  export let bold = false
  export let sm = false

  type TagSize = "sm" | "default"
  type TagType = "green" | "red" | "outline" | "magenta" | "purple" | "blue" | "cyan" | "teal" | "gray" | "cool-gray" | "warm-gray" | "high-contrast"

  const getIcon = (difference: number) => {
    if (difference < 0) return CaretUp
    if (difference > 0) return CaretDown
    else return Equal
  }

  const getColor = (difference: number) => {
    if (difference < 0) return 'green'
    if (difference > 0) return 'red'
    else return 'outline'
  }

  $: size = (sm ? 'sm' : 'default') as TagSize
  $: type = getColor(diff) as TagType
  $: icon = getIcon(diff)

  $: classes = 'diff ' + $$restProps.class
  $: if (bold) classes += ' bold'
</script>

<Tag {...$$restProps} {size} {type} {icon} class={classes}>
  { diff != 0 ? Math.abs(diff) : ''}
</Tag>