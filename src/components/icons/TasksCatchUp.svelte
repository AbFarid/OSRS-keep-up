<script>
  export let size = 16

  export let title = undefined

  $: labelled = $$props['aria-label'] || $$props['aria-labelledby'] || title
  $: attributes = {
    'aria-hidden': labelled ? undefined : true,
    role: labelled ? 'img' : undefined,
    // focusable: Number($$props["tabindex"]) === 0 ? true : undefined
  }
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 32 32"
  fill="currentColor"
  preserveAspectRatio="xMidYMid meet"
  width={size}
  height={size}
  {...attributes}
  {...$$restProps}
>
  {#if title}<title>{title}</title>{/if}

  <path d="m23 25.2-2.6-2.6L19 24l4 4 7-7-1.4-1.4-5.6 5.6ZM23 9.2l-2.6-2.6L19 8l4 4 7-7-1.4-1.4L23 9.2ZM12 21.4 10.6 20 8 22.6 5.4 20 4 21.4 6.6 24 4 26.6 5.4 28 8 25.4l2.6 2.6 1.4-1.4L9.4 24l2.6-2.6ZM12 5.4 10.6 4 8 6.6 5.4 4 4 5.4 6.6 8 4 10.6 5.4 12 8 9.4l2.6 2.6 1.4-1.4L9.4 8 12 5.4ZM2 15h28v2H2Z"/>
</svg>
