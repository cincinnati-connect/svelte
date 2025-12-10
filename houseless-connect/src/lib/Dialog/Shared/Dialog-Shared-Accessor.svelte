<script>
  import DialogSaveButton from '../../Shared-Components/dialog/Dialog-Save-Button.svelte';
  import EffectBasedDialog from '../../Shared-Components/dialog/Effect-Based-Dialog.svelte';
  import PageProgressIndicator from '../../Shared-Components/Page-Progress-Indicator.svelte';
  import { generateDialogID } from '../../utils/dynamic-dialog-id';
  import { people, PeopleStore } from '../../utils/Person.store.svelte';
  import ResourceHub from '../Resource/Resource-Hub.svelte';
  import RouteHub from '../Route/Route-Hub.svelte';

  let { route = $bindable(), dialogType = $bindable() } = $props();

  let isOpen = $state(false);
  let currentDialogPage = $state(1);
  let canSubmit = $state(false);

  let maxPage = $state(dialogType == 'BusRoute' ? 2 : 5);

  let nextButton;
  let nextButtonDisabled = $state(false);
  let filteredPages = $state([]);
  let temporaryPerson = $state({ name: '', dob: new Date(), hasID: false, id: -1 });

  const form = {};

  const generatedID = generateDialogID();

  function onSubmit(val) {
    // need to move this to a prop event
    console.log(temporaryPerson);
    if (temporaryPerson.id === -1) {
      PeopleStore.addPerson(temporaryPerson);
    }
    temporaryPerson = { name: '', dob: new Date(), hasID: false, id: -1 };

    console.log(PeopleStore.People);
  }

  function close(val) {
    // val = true --> closed from save button
    // val = false --> closed from close button
    console.log('close: ', val);
    isOpen = false;
    route = { route: '', routeType: '' };
    currentDialogPage = 1;
    temporaryPerson = { name: '', dob: new Date(), hasID: false, id: -1 };

    if (isOpen) {
      console.log('true');
    } else {
      console.log('false');
    }
  }

  $effect(() => {
    if (route.route && route.route != '') {
      console.log(route.route);
      isOpen = true;
    }

    if (nextButton) {
      nextButton.disabled = nextButtonDisabled;
    }

    maxPage = dialogType == 'BusRoute' ? 2 : 5;
  });
</script>

{#snippet body()}
  {#if dialogType === 'BusRoute'}
    <RouteHub bind:currentPage={currentDialogPage} bind:canSubmit {route} />
  {:else}
    <ResourceHub
      bind:currentPage={currentDialogPage}
      bind:disableNextButton={nextButtonDisabled}
      bind:filteredPages
      bind:canSubmit
      bind:temporaryPerson
      {route}
    />
  {/if}
{/snippet}

{#snippet footer()}
  <div class="d-flex flex-row justify-content-between align-items-center w-100">
    <div style="width: 80px">
      {#if currentDialogPage == 1}
        <DialogSaveButton
          submit={() => close()}
          buttonLabel="Cancel"
          dialogButtonSeverity="secondary"
        />
      {:else if currentDialogPage != maxPage - filteredPages.length}
        <button class="btn btn-secondary" onclick={() => currentDialogPage--}>Back</button>
      {/if}
    </div>

    {#if maxPage > 2}
      <div>
        <PageProgressIndicator
          currentPage={currentDialogPage}
          maxPage={maxPage - 1}
          canClickAction={(page) => (currentDialogPage = page)}
          filterList={filteredPages}
        />
      </div>
    {/if}

    <div class="d-flex justify-content-end" style="width: 80px">
      {#if currentDialogPage == maxPage - 1 - filteredPages.length}
        <button class="btn btn-success" bind:this={nextButton} onclick={() => currentDialogPage++}
          >{dialogType == 'BusRoute' ? 'Purchase' : 'Submit'}</button
        >
      {:else if currentDialogPage == maxPage - filteredPages.length}
        <DialogSaveButton
          dialogButtonSeverity="success"
          buttonLabel="Done"
          submit={() => onSubmit()}
        />
      {:else}
        <button class="btn btn-success" bind:this={nextButton} onclick={() => currentDialogPage++}
          >Next</button
        >
      {/if}
    </div>
  </div>
{/snippet}

<EffectBasedDialog
  headerText={dialogType === 'BusRoute' ? `Bus: ${route.route}` : `Resource: ${route.route.name}`}
  {body}
  {footer}
  close={(val) => close(val)}
  {generatedID}
  {isOpen}
/>
