<!-- 
  @component
  A calendar input component
  @param {string} label A label for the input
  @param {date} value the value from the input
 -->
<script>
  let { value = $bindable(null), label = '' } = $props();

  let dateString = $state('');

  $effect(() => {
    if (value instanceof Date) {
      const localDate = new Date(value.getTime());
      dateString = localDate.toISOString().split('T')[0];
    } else if (typeof value === 'string' && value.length === 10) {
      dateString = value;
    } else {
      dateString = '';
    }
  });

  $effect(() => {
    if (dateString) {
      value = new Date(dateString).toISOString().split('T')[0];
    } else if (value !== null) {
      value = null;
    }
  });
</script>

<div class="container mt-3">
  <div class="form-floating mb-3">
    <input
      type="date"
      class="form-control cursor-pointer"
      id="date-input"
      bind:value={dateString}
    />
    <label for="date-input">{label}</label>
  </div>
</div>
