<script>
  let {
    currentPage = $bindable(),
    maxPage,
    canJumpAhead = false,
    canClickNavigate = true,
    canClickAction = null,
    filterList = [],
  } = $props();

  let pages = $state(
    Array(maxPage)
      .fill(0)
      .map((_, i) => i + 1)
  );

  function getPageState(pageNum) {
    if (pageNum < currentPage) {
      return { iconClass: 'bi-circle-fill', isCurrent: false };
    } else if (pageNum === currentPage) {
      return { iconClass: 'bi-record-circle-fill', isCurrent: true };
    } else {
      return { iconClass: 'bi-circle', isCurrent: false };
    }
  }

  $effect(() => {
    pages = Array(maxPage - filterList.length)
      .fill(0)
      .map((_, i) => i + 1);
  });
</script>

<div class="d-flex flex-row me-2 ms-2">
  {#each pages as pageNum, index}
    {@const state = getPageState(pageNum)}
    {#if canClickNavigate}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      {#if canJumpAhead || (!canJumpAhead && pageNum < currentPage)}
        <div
          class="cursor-pointer no-select"
          class:active={state.isCurrent}
          onclick={() => canClickAction(pageNum)}
        >
          <i class="bi {state.iconClass} text-primary"></i>
          <!-- <span>{pageNum}</span> -->
        </div>
      {:else}
        <div class:active={state.isCurrent} class="no-select">
          <i class="bi {state.iconClass} text-primary"></i>
          <!-- <span>{pageNum}</span> -->
        </div>
      {/if}
    {:else}
      <div class:active={state.isCurrent} class="no-select">
        <i class="bi {state.iconClass} text-primary"></i>
        <!-- <span>{pageNum}</span> -->
      </div>
    {/if}

    {#if index < pages.length - 1}
      <div class="me-2" class:completed={pageNum < currentPage}></div>
    {/if}
  {/each}
</div>
