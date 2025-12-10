<script>
  import { PeopleStore } from '../utils/Person.store.svelte';
  import ProviderHub from './Provider-Hub.svelte';

  let currentDialogPage = $state(1);
  let showSubmitButton = $state(false);
  let showHomeButton = $state(false);
  let skipSubmit = $state(false);
  let disableNextButton = $state(false);

  function handleScan(event) {
    console.log(event.detail.text);
  }

  let temporaryPerson = $state({ name: '', dob: new Date(), hasID: false, id: -1 });

  function reset() {
    temporaryPerson = { name: '', dob: new Date(), hasID: false, id: -1 };
    currentDialogPage = 1;
    showHomeButton = false;
    showSubmitButton = false;
    skipSubmit = false;
    disableNextButton = false;
  }

  function onSubmit(val) {
    // need to move this to a prop event
    console.log(temporaryPerson);
    if (temporaryPerson.id === -1) {
      PeopleStore.addPerson(temporaryPerson);
    }
    currentDialogPage = 4;
    showHomeButton = true;
    showSubmitButton = false;
    console.log(PeopleStore.People);
  }

  function onGoHome() {
    currentDialogPage = 1;
    showSubmitButton = false;
    skipSubmit = false;
    disableNextButton = false;
    showHomeButton = false;
  }
</script>

<div class="d-flex flex-column h-100 p-3">
  <div class="flex-grow-1">
    <div class="d-flex flex-column">
      <span class="fs-2 border-bottom pb-2 mb-4">Provider: UMADAOP</span>
      {#if currentDialogPage == 1}
        <span class="mb-2"
          >Welcom to the provider check-in view. Here you can look up an individual or register them
          for a new record. This record will be transferable with all resource providers.</span
        >{/if}
      <ProviderHub
        bind:currentPage={currentDialogPage}
        bind:temporaryPerson
        bind:showSubmitButton
        bind:skipSubmit
        bind:disableNextButton
      />
    </div>
  </div>
  {#if currentDialogPage !== 1}
    <footer>
      <div
        class="p-3 border-top d-flex flex-row {skipSubmit
          ? 'justify-content-end'
          : 'justify-content-between'} "
      >
        {#if !skipSubmit}
          {#if currentDialogPage == 2}
            <button class="btn btn-secondary" onclick={() => reset()}>Back to Home</button>
          {:else}
            <button class="btn btn-secondary" onclick={() => currentDialogPage--}>Back</button>
          {/if}
        {/if}

        {#if showSubmitButton && !skipSubmit}
          <button class="btn btn-primary" onclick={() => onSubmit()}>Submit</button>
        {:else if showHomeButton || skipSubmit}
          <button class="btn btn-primary" onclick={() => onGoHome()}>Done</button>
        {:else if currentDialogPage < 4}
          <button
            class="btn btn-primary"
            disabled={disableNextButton}
            onclick={() => currentDialogPage++}>Next</button
          >
        {/if}
      </div>
    </footer>
  {/if}
</div>
