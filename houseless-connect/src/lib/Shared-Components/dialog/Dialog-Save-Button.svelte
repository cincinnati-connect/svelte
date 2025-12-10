<!-- 
   @component
   The Dynamic Dialog Save Button Component - This will always close the dialog
   @param {string} dialogButtonSeverity Button coloring, Required Type = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
    @param {string} buttonLabel A label for the button
    @param {} submit A value call back for handling a click event
  -->
<script>
  let {
    buttonLabel = 'Submit',
    dialogButtonSeverity = 'primary',
    submit = null,
    disabled = false,
  } = $props();

  let button;

  if (button) {
    // @ts-ignore
    button.disabled = disabled;
  }
</script>

<button
  type="button"
  class="btn btn-{dialogButtonSeverity}"
  {disabled}
  data-bs-dismiss="modal"
  onclick={submit}
  bind:this={button}>{buttonLabel}</button
>
