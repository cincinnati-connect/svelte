<script>
  let {
    labelButtonA = '',
    labelButtonB = '',
    onButtonA = null,
    nextButtonDisabled = $bindable(false),
    onButtonB = null,
  } = $props();
</script>

<div class="d-flex flex-column align-items-center">
  <button class="btn btn-primary" onclick={onButtonA}>{labelButtonA}</button>
  <span>Or</span>
  <button class="btn btn-primary" onclick={onButtonB}>{labelButtonB}</button>
</div>
