<script>
  import { PeopleStore } from '../../utils/Person.store.svelte';
  import CheckRegistration from '../Shared/Check-Registration.svelte';
  import DialogScan from '../Shared/Dialog-Scan.svelte';
  import SuccessScreenQR from '../Shared/Success-Screen-QR.svelte';
  import PersonLookup from './Person-Lookup.svelte';
  import RegisterNewPerson from './Register-New-Person.svelte';

  let {
    currentPage = $bindable(1),
    canSubmit = $bindable(false),
    disableNextButton = $bindable(),
    filteredPages = $bindable([]),
    temporaryPerson = $bindable(),
    route,
  } = $props();

  let isActive = $state(false);
  canSubmit = true;

  disableNextButton = true;
  let scanOrSearch = $state('Scan');
  let lookUpOrRegister = $state('LookUp');

  function handleScanOrSearch(val) {
    currentPage = 3;
    scanOrSearch = val;
    disableNextButton = false;
    if (val == 'Scan') {
      filteredPages = [];
    } else {
      filteredPages = [];
    }
  }

  function handleLookupOrRegister(val) {
    currentPage = 2;
    lookUpOrRegister = val;
    disableNextButton = false;
    if (val == 'Lookup') {
      filteredPages = [4];
    } else {
      filteredPages = [3];
    }
  }

  function temporaryPersonSelected(val) {
    temporaryPerson = val;
    currentPage = 4;
  }

  function handleScan(event) {
    console.log(event);
    const person = PeopleStore.findPersonWithoutID(event);
    if (person) {
      currentPage = 4;
      isActive = false;
      temporaryPerson = person;
    } else {
      alert('No user found, try again');
      currentPage = 2;
      isActive = false;
    }
  }

  $effect(() => {
    if (
      currentPage == 1 ||
      (currentPage == 2 && lookUpOrRegister == 'Lookup') ||
      (currentPage == 3 && lookUpOrRegister == 'Lookup')
    ) {
      disableNextButton = true;
    } else {
      disableNextButton = false;
    }

    if (currentPage == 3 && scanOrSearch === 'Scan') {
      isActive = true;
    } else {
      isActive = false;
    }

    console.log(currentPage, lookUpOrRegister);
    if (
      (currentPage == 3 && lookUpOrRegister == 'Register') ||
      (currentPage == 4 && lookUpOrRegister == 'Lookup')
    ) {
      canSubmit = true;
    }
  });
</script>

<div class="d-flex flex-column">
  <span class="fs-4" class:mb-4={currentPage !== 1}>Resource Connection</span>
  {#if currentPage == 1}
    <span class="mb-4"
      >To register for a free bus ticket and get registered for an appointment with {route.route
        .name}, please follow the prompts. If you are already registered with Cincinnati Connect,
      you can look yourself up. If you are new to Cincinnati Connect, please register to begin
      signing up for services. Your information will be fully transferable between services.</span
    >
    <CheckRegistration
      bind:nextButtonDisabled={disableNextButton}
      labelButtonA="Look Me Up"
      labelButtonB="Register to Sign-Up for Services"
      onButtonA={() => handleLookupOrRegister('Lookup')}
      onButtonB={() => handleLookupOrRegister('Register')}
    />
  {:else if currentPage === 2}
    {#if lookUpOrRegister == 'Lookup'}
      <CheckRegistration
        bind:nextButtonDisabled={disableNextButton}
        labelButtonA="Scan"
        labelButtonB="Search"
        onButtonA={() => handleScanOrSearch('Scan')}
        onButtonB={() => handleScanOrSearch('Search')}
      />
    {:else}
      <RegisterNewPerson bind:newPerson={temporaryPerson} />
    {/if}
  {:else if (currentPage == 4 && lookUpOrRegister == 'Lookup') || (currentPage == 3 && lookUpOrRegister == 'Register')}
    <div class="d-flex flex-column">
      <span class="fs-5">Confirm Your Identity</span>
      <span>{temporaryPerson.name}</span>
      <span>{temporaryPerson.dob}</span>
    </div>
  {:else if currentPage === 3}
    {#if lookUpOrRegister !== 'Lookup'}{:else}
      <!-- <span>scan or search? {scanOrSearch}</span> -->
      {#if scanOrSearch === 'Scan'}
        <DialogScan handleScan={(event) => handleScan(event)} {isActive} />
      {:else}
        <PersonLookup personSelected={(val) => temporaryPersonSelected(val)} />
      {/if}
    {/if}
  {:else if currentPage == 5 || (currentPage == 4 && lookUpOrRegister == 'Register')}
    <SuccessScreenQR
      additionalText="You will use this pass to board the bus and to check in at {route.route.name}"
      value={temporaryPerson}
    />
  {/if}
</div>
