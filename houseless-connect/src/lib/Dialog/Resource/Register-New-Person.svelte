<script>
  import CalendarInput from '../../Shared-Components/Calendar-Input.svelte';
  import TextInput from '../../Shared-Components/Text-Input.svelte';

  let { newPerson = $bindable() } = $props();
</script>

<div class="d-flex flex-column">
  <span class="fs-4 mb-4 border-bottom">Register a New Person</span>
  <TextInput bind:value={newPerson.name} label="Full Name" />
  <CalendarInput bind:value={newPerson.dob} label="Date of Birth" />
</div>
