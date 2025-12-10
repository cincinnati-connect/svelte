<script>
  import TestScanner from '../../Test-Scanner.svelte';

  let { isActive = false, handleScan = null } = $props();

  function onhandleScan(event) {
    console.log('qr scanned');
    console.log(event);
    console.log(event.detail);
    console.log(event.detail);
    handleScan(event);
  }
</script>

<TestScanner {isActive} scan={onhandleScan} />
