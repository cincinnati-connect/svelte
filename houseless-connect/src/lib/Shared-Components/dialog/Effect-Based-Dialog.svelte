<script>
  import { onMount, onDestroy } from 'svelte';

  let {
    isOpen = false,
    headerText = '',
    body = null,
    footer = null,
    generatedID,
    close = null,
    hasFooter = true,
    dialogHeight = 400,
  } = $props();

  let modalElement;
  let bootstrapModalInstance;

  function onclose() {
    close(true);
  }

  function handleBootstrapClose() {
    bootstrapModalInstance.hide();
    close(false);
  }

  onMount(() => {
    // @ts-ignore
    bootstrapModalInstance = new bootstrap.Modal(modalElement);
    modalElement.addEventListener('hidden.bs.modal', handleBootstrapClose);
  });

  $effect(() => {
    if (!bootstrapModalInstance) return;
    if (isOpen) {
      bootstrapModalInstance.show();
    } else {
      bootstrapModalInstance.hide();
    }
  });

  onDestroy(() => {
    if (modalElement) {
      modalElement.removeEventListener('hidden.bs.modal', handleBootstrapClose);
    }
    if (bootstrapModalInstance) {
      bootstrapModalInstance.dispose();
    }
  });
</script>

{#snippet defaultFooter()}
  <button type="button" class="btn btn-secondary" onclick={onclose}>Close</button>
{/snippet}

<div
  class="modal fade"
  id={generatedID}
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
  bind:this={modalElement}
>
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header no-select">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{headerText}</h1>
        <button type="button" class="btn-close" onclick={onclose} aria-label="Close"></button>
      </div>
      {#if body != null}
        <div class="modal-body" style="min-height: {dialogHeight}px">{@render body()}</div>
      {/if}
      {#if hasFooter}
        <div class="modal-footer">
          {#if footer != null}
            {@render footer()}
          {:else}
            {@render defaultFooter()}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
