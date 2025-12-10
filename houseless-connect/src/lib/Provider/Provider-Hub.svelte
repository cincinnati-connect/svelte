<script>
  import PersonLookup from '../Dialog/Resource/Person-Lookup.svelte';
  import RegisterNewPerson from '../Dialog/Resource/Register-New-Person.svelte';
  import CheckRegistration from '../Dialog/Shared/Check-Registration.svelte';
  import DialogScan from '../Dialog/Shared/Dialog-Scan.svelte';
  import TestGenerator from '../Test-Generator.svelte';
  import { PeopleStore } from '../utils/Person.store.svelte';

  let {
    currentPage = $bindable(1),
    disableNextButton = $bindable(false),
    temporaryPerson = $bindable(),
    showSubmitButton = $bindable(),
    skipSubmit = $bindable(),
  } = $props();

  disableNextButton = true;
  let scanOrSearch = $state('null');
  let lookUpOrRegister = $state('null');
  let isActive = $state(false);
  let needsID = $state(false);

  function handleScan(event) {
    console.log(event);
    const person = PeopleStore.findPersonWithoutID(event);
    if (person) {
      skipSubmit = true;
      currentPage = 4;
      isActive = false;
      temporaryPerson = person;
      if (!temporaryPerson.hasID) {
        needsID = true;
        temporaryPerson.hasID = true;
        PeopleStore.updatePerson(temporaryPerson);
      }
    } else {
      alert('No user found, try again');
      currentPage = 2;
      isActive = false;
    }
  }

  function handleScanOrSearch(val) {
    currentPage = 3;
    scanOrSearch = val;
    disableNextButton = false;
  }

  function handleLookupOrRegister(val) {
    currentPage = 2;
    lookUpOrRegister = val;
    disableNextButton = false;
  }

  function temporaryPersonSelected(val) {
    temporaryPerson = val;
    if (!temporaryPerson.hasID) {
      needsID = true;
      temporaryPerson.hasID = true;
      PeopleStore.updatePerson(temporaryPerson);
    }
    currentPage = 4;
    skipSubmit = true;
  }

  $effect(() => {
    if (currentPage == 1) {
      skipSubmit = false;
      disableNextButton = false;
      showSubmitButton = false;
      needsID = false;
    }

    if (currentPage == 1 || currentPage == 2) {
      disableNextButton = true;
    } else {
      disableNextButton = false;
    }

    if (currentPage == 3 && scanOrSearch === 'Scan') {
      isActive = true;
    } else {
      isActive = false;
    }

    if (lookUpOrRegister == 'Lookup') {
      disableNextButton = true;
    }

    if (currentPage == 3 && lookUpOrRegister == 'Register') {
      currentPage = 2;
    }

    if (lookUpOrRegister == 'Register' && currentPage == 2) {
      showSubmitButton = true;
    }
  });
</script>

{#if currentPage === 1}
  <CheckRegistration
    bind:nextButtonDisabled={disableNextButton}
    labelButtonA="Look Me Up"
    labelButtonB="Register New Person"
    onButtonA={() => handleLookupOrRegister('Lookup')}
    onButtonB={() => handleLookupOrRegister('Register')}
  />{:else if currentPage === 2}
  {#if lookUpOrRegister == 'Lookup'}
    <CheckRegistration
      bind:nextButtonDisabled={disableNextButton}
      labelButtonA="Scan ID (or qr code)"
      labelButtonB="Search For Person"
      onButtonA={() => handleScanOrSearch('Scan')}
      onButtonB={() => handleScanOrSearch('Search')}
    />
  {:else}
    <RegisterNewPerson bind:newPerson={temporaryPerson} />
  {/if}
{:else if currentPage === 3}
  <span class="fs-4">Scan ID</span>
  {#if scanOrSearch === 'Scan'}
    <DialogScan handleScan={(event) => handleScan(event)} {isActive} />
  {:else}
    <PersonLookup personSelected={(val) => temporaryPersonSelected(val)} />
  {/if}
{:else if currentPage === 4}
  {#if lookUpOrRegister == 'Register' || needsID}
    {#if needsID}
      <span>{temporaryPerson.name} is all checked in!</span>
    {:else}<span>You are registered!</span>
    {/if}
    <span
      >Here is your ID, take a picture and we will <a href="#" onclick={() => window.print()}
        >Print</a
      > it too!</span
    >
    <TestGenerator value={temporaryPerson} />
  {:else}
    <span>{temporaryPerson.name} is all checked in!</span>
  {/if}
{/if}
