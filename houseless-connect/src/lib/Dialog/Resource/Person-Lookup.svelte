<script>
  // @ts-nocheck

  import CalendarInput from '../../Shared-Components/Calendar-Input.svelte';
  import TextInput from '../../Shared-Components/Text-Input.svelte';
  import { PeopleStore } from '../../utils/Person.store.svelte';

  let { personSelected = null } = $props();
  let peopleList = PeopleStore.People;
  let searchTerm = $state({
    name: '',
    dob: null,
  });
</script>

<span class="fs-5">Search:</span>
<div class="d-flex flex-row border-bottom">
  <TextInput bind:value={searchTerm.name} label="Full Name" />
  <CalendarInput bind:value={searchTerm.dob} label="Date of Birth" />
</div>
<span class="mb-2 fs-5">Select yourself from the following list:</span>
<div class="d-flex flex-column">
  {#each peopleList as person}
    {#if person.name.toLowerCase().includes(searchTerm.name) && person.dob == searchTerm.dob}
      <div
        class="d-flex flex-row justify-content-between align-items-center border-bottom mb-2 pb-2"
      >
        <div class="d-flex flex-row justify-content-between w-50">
          <span>{person.name}</span>
          <span> {person.dob}</span>
        </div>
        <div>
          <button class="btn btn-primary" onclick={() => personSelected(person)}>This is me</button>
        </div>
      </div>
    {/if}
  {/each}
</div>
