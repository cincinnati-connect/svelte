<script>
  import TestGenerator from '../../Test-Generator.svelte';

  let { value = null, additionalText = null } = $props();
</script>

<div class="d-flex flex-column align-items-center justify-content-center no-select">
  <span style="text-align: center" class="fs-1 text-success">Your Pass is ready!</span>
  <span style="text-align: center"
    >Please <a href="#" onclick={() => window.print()}>print</a> or take a picture of your pass</span
  >
  {#if additionalText !== null}
    <span style="text-align: center">{additionalText}</span>
  {/if}
  <div class="m-auto">
    <TestGenerator {value} />
  </div>
</div>
