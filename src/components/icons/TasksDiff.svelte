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

  <path
    d="m23 25.2-2.6-2.6L19 24l4 4 7-7-1.4-1.4-5.6 5.6ZM7 9.4 4.4 6.8 3 8.2l4 4 7-7-1.4-1.4L7 9.4ZM12 21.4 10.6 20 8 22.6 5.4 20 4 21.4 6.6 24 4 26.6 5.4 28 8 25.4l2.6 2.6 1.4-1.4L9.4 24l2.6-2.6ZM28 5.4 26.6 4 24 6.6 21.4 4 20 5.4 22.6 8 20 10.6l1.4 1.4L24 9.4l2.6 2.6 1.4-1.4L25.4 8 28 5.4ZM2 15h28v2H2Z"
  />
</svg>
