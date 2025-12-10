<!-- 
  @component
  A text input
  @param {string} value A bindable value of the input
  @param {string} label A label for the input
  @param {string} placeholder A placeholder for the input
 -->
<script>
  let { value = $bindable(), label = '', placeholder = '' } = $props();
</script>

<div class="container mt-3 mb-1">
  <div class="form-floating">
    <input type="text" class="form-control" {placeholder} id="text-input" bind:value />
    <label for="text-input">{label}</label>
  </div>
</div>
