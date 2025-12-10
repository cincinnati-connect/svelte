<script>
  import TestGenerator from './Test-Generator.svelte';
  import TestScanner from './Test-Scanner.svelte';

  let formData = {
    itemID: '',
    itemName: '',
  };
  let isScanning = false;

  function handleScan(event) {
    formData = event.detail.text; // Fill the form with scanned data
    isScanning = false; // Close scanner
  }
</script>

<main>
  <h1>Inventory App</h1>

  {#if isScanning}
    <TestScanner scan={(val) => handleScan(val)} />
    <button on:click={() => (isScanning = false)}>Cancel Scan</button>
  {:else}
    <div class="form-group">
      <label>Item ID:</label>
      <input bind:value={formData.itemID} placeholder="Scan or type ID" />
      <button on:click={() => (isScanning = true)}>📷 Scan Code</button>
    </div>
    <div class="form-group">
      <label>Item Name:</label>
      <input bind:value={formData.itemName} placeholder="Scan or type name" />
    </div>

    <h3>Generated Code:</h3>
    <TestGenerator value={formData} />
  {/if}
</main>
