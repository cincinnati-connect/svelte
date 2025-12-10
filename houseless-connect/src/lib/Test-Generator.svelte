<script>
  import QRCode from 'qrcode';
  import JsBarcode from 'jsbarcode';
  import { onMount } from 'svelte';
  import { QrcodeResultFormat } from 'html5-qrcode/esm/core';

  const { value = null, QROrBarCode = 'QR' } = $props();
  let canvasRef;

  function generateQRCode() {
    if (!value || !canvasRef) return;

    clearCanvas();
    canvasRef.width = 200;
    canvasRef.height = 200;

    const jsonify = JSON.stringify(value);

    QRCode.toCanvas(canvasRef, jsonify, { width: 200 }, function (error) {
      if (error) console.error(error);
    });
  }

  function generateBarcode() {
    if (!value || !canvasRef) return;

    clearCanvas();
    canvasRef.removeAttribute('width');
    canvasRef.removeAttribute('height');
    canvasRef.style.width = 'auto';
    canvasRef.style.height = 'auto';

    const jsonify = JSON.stringify(value);

    JsBarcode(canvasRef, jsonify, {
      format: 'CODE128',
      displayValue: false,
    });
  }

  function clearCanvas() {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
  }

  onMount(() => {
    if (QROrBarCode === 'QR') {
      generateQRCode();
    } else {
      generateBarcode();
    }
  });
</script>

<div class="d-flex flex-column">
  <!-- <div class="d-flex flex-row">
    <button class="btn btn-primary" onclick={generateQRCode}>Generate QR</button>
    <button class="btn btn-primary" onclick={generateBarcode}>Generate Barcode</button>
  </div> -->
  <div id="canvas-container">
    <canvas bind:this={canvasRef}></canvas>
  </div>
</div>

<style>
</style>
