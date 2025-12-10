<script>
  import { get } from 'svelte/store';
  import { markerRegistry } from '../Map/Marker.store.svelte';

  let { resource } = $props();

  function getPin(shelter) {
    switch (shelter.resourceType) {
      case 'Mental Health & Substance Use':
        return '#FF5733';
      case 'Healthcare':
        return '#33FF57';
      case 'Employment Assistance':
        return '#3357FF';
      case 'Identification':
        return '#FF33A1';
      case 'Outreach & Drop-in Centers':
        return '#33FFF6';
      case 'Youth Assistance':
        return '#FFC300';
      case 'Legal Assistance':
        return '#8D33FF';
      case 'Eviction Assistance':
        return '#00B8D4';
      case 'Housing/Eviction Prevention':
        return '#B833FF';
      case 'Free Meals & Pantries':
        return '#FF6F33';
      case 'Clothing & Household':
        return '#4CAF50';
      case 'Additional Resources':
        return '#FFD700';
      default:
        return 'red';
    }
  }

  function showMapPin(shelter) {
    const markers = get(markerRegistry);
    const marker = markers[shelter.id];

    if (marker) {
      marker.openPopup();
      marker._map.panTo(marker.getLatLng());
    }
  }
</script>

{#if resource.Lon !== null && resource.Lat !== null}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="d-flex flex-row align-items-center cursor-pointer"
    onclick={() => showMapPin(resource)}
  >
    <svg
      class="list-pin-icon flex-shrink-0 me-2"
      fill={getPin(resource)}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        d="M10 20s-7-5.5-7-10c0-3.8 3.2-7 7-7s7 3.2 7 7c0 4.5-7 10-7 10zM10 6c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"
      /></svg
    >
    <span class="flex-grow-1 truncate-text-single-line">{resource.name}</span>
  </div>
{:else}
  <div class="d-flex flex-column no-select">
    <div class="border-bottom pb-2 mb-2">
      <span>{resource.name}</span>
    </div>
    <div class="border-bottom pb-2 mb-2">
      <span>{resource.description}</span>
    </div>
    <span>Phone: <a href="tel:{resource.phone}">{resource.phone}</a></span>
    <span>Hours: {resource.hours}</span>
  </div>
{/if}

<style>
  .list-pin-icon {
    width: 32px;
    height: 32px;
    /* Ensure the icon scales properly within its own box */
    display: inline-block;
  }
</style>
