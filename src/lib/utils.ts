
/*
  How to use:
  <div use:popoverHoverOpen class="popoverWrapper">
    <Button>Hover over me</Button>
    <Popover>
      <div style="padding: 10px">Content</div>
    </Popover>
  </div>
*/
export const popoverHoverOpen = (node: HTMLElement) => {
  const popover = node.querySelector('div .bx--popover')

  function changePopoverState(state: boolean) {
    state
      ? popover.classList.add('bx--popover--open')
      : popover.classList.remove('bx--popover--open')
  }

  const openPopover = () => changePopoverState(true)
  const closePopover = () => changePopoverState(false)

  node.addEventListener('mouseenter', openPopover)
  node.addEventListener('mouseleave', closePopover)

  return {
    destroy() {
      node.removeEventListener('mouseenter', openPopover)
      node.removeEventListener('mouseleave', closePopover)
    },
  }
}
