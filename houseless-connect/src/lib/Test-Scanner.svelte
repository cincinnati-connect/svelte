<script>
  import { onMount, onDestroy } from 'svelte';
  import { Html5Qrcode } from 'html5-qrcode';

  let { scan = null, isActive = $bindable() } = $props();

  let isLoading = $state(true);
  let scannerId = 'reader';
  let html5QrCode;
  let isScanning = false;

  async function startScanner() {
    // Request permission and start scanning
    if (isScanning || !html5QrCode) return;
    isScanning = true;
    isLoading = true;
    html5QrCode = new Html5Qrcode(scannerId);

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    // Start the camera (prefer back camera on mobile)
    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText, decodedResult) => {
          // Success callback
          scan(JSON.parse(decodedText));
          stopScanner(); // Optional: Stop after first successful scan
        },
        (errorMessage) => {
          // Parse error, ignore strictly to avoid log spam
          isScanning = false;
          isLoading = false;
        }
      );

      isLoading = false;
    } catch (err) {
      console.error('Error starting scanner', err);
    }
  }

  async function stopScanner() {
    if (html5QrCode) {
      await html5QrCode.stop();
      html5QrCode.clear();
      isScanning = false;
      isLoading = false;
    }
  }

  onMount(async () => {
    html5QrCode = new Html5Qrcode(scannerId);
    // After initialization, immediately try to start the scanner if isActive is true
    if (isActive) {
      startScanner();
    }
  });

  // 2. Control scanner state reactively based on the prop
  $effect(() => {
    if (isActive) {
      startScanner();
    } else {
      if (isScanning) {
        stopScanner();
      }
    }
  });

  onDestroy(() => {
    stopScanner();
  });
</script>

{#if isLoading}
  <div class="d-flex justify-content-center">
    <div class="spinner-border text-primary" style="width: 5rem; height: 5rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
{/if}

<div id={scannerId} style="width: 100%; max-width: 500px;"></div>

<style>
</style>
