<script>
  import TextInput from '../../Shared-Components/Text-Input.svelte';
  import SuccessScreenQR from '../Shared/Success-Screen-QR.svelte';

  let { currentPage = $bindable(1), canSubmit = $bindable(false), route } = $props();
  let activeTab = $state('Card');

  let card = $state({
    cardNumber: '',
    cardExpiration: '',
    cardSecurityCode: '',
    cardHolderName: '',
  });

  $effect(() => {
    const allFieldsFilled =
      card.cardNumber.trim().length > 0 &&
      card.cardExpiration.trim().length > 0 &&
      card.cardSecurityCode.trim().length > 0 &&
      card.cardHolderName.trim().length > 0;

    canSubmit = (allFieldsFilled && activeTab == 'Card') || activeTab == 'Cash';
  });
</script>

{#if currentPage == 1}
  <div class="d-flex flex-column">
    <span class="fs-3">Route: {route.route}</span>
    <span class="fs-3">Price: ${(Math.random() * 100).toFixed(2)}</span>
    <span class="fs-4">Payment Method:</span>
    <ul class="nav nav-tabs">
      <li class="nav-item no-select cursor-pointer">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_missing_attribute -->
        <a class="nav-link" class:active={activeTab == 'Card'} onclick={() => (activeTab = 'Card')}
          >Card</a
        >
      </li>
      <li class="nav-item no-select cursor-pointer">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_missing_attribute -->
        <a class="nav-link" class:active={activeTab == 'Cash'} onclick={() => (activeTab = 'Cash')}
          >Cash</a
        >
      </li>
    </ul>
    <div>
      {#if activeTab == 'Card'}
        <div class="d-flex flex-column">
          <TextInput
            bind:value={card.cardNumber}
            label="Card Number"
            placeholder="XXXX XXXX XXXX XXXX"
          />
          <div class="d-flex flex-row">
            <TextInput
              bind:value={card.cardExpiration}
              label="Expiration Date (MM/YY)"
              placeholder="MM/YY"
            />
            <TextInput bind:value={card.cardSecurityCode} label="Security Code (CVC)" />
          </div>
          <TextInput bind:value={card.cardHolderName} label="Card Holder Name" />
        </div>
      {:else}
        <span class="fs-4">Please insert cash</span>
      {/if}
    </div>
  </div>
{:else if currentPage == 2}
  <SuccessScreenQR value={card} />
{/if}
