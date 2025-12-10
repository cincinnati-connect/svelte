<script>
  import TextInput from '../Shared-Components/Text-Input.svelte';
  import { resources } from './Resource.store.svelte';
  import Resource from './Resource.svelte';

  let showSearch = $state(false);
  let searchTerm = $state('');

  const resourceStore = resources;

  const resourceTypes = [
    'Mental Health & Substance Use',
    'Healthcare',
    'Employment Assistance',
    'Identification',
    'Outreach & Drop-in Centers',
    'Youth Assistance',
    'Legal Assistance',
    'Eviction Assistance',
    'Housing/Eviction Prevention',
    'Free Meals & Pantries',
    'Clothing & Household',
    'Additional Resources',
  ];

  const updateDimensions = () => {
    setTimeout(() => {
      const app = document.querySelector('#app');
      const navbar = document.querySelector('#nav-bar');
      const resource = document.querySelector('#resource');

      if (resource && app && navbar) {
        // @ts-ignore
        resource.style.height = `${(app.clientHeight && navbar.clientHeight ? app.clientHeight - navbar.clientHeight - 24 : undefined) ?? 300}px`;
      }
    }, 0);
  };

  $effect.pre(() => {
    // 1. Run once immediately to get initial size
    updateDimensions();

    // 2. Add the listener
    window.addEventListener('resize', updateDimensions);

    // 3. Return a cleanup function
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  });

  function enableSearch() {
    if (showSearch) {
      searchTerm = '';
    } else {
    }
    showSearch = !showSearch;
  }
</script>

<!-- <div style="width: 20vw h-100" class="ps-2" id="resource">
  <span class="fs-3">Resources:</span>
  {#each resourceStore as resource, index}
    <div class="w-100 border rounded p-2 {index < resourceStore.length - 1 ? 'mb-2' : ''}">
      <Resource {resource} />
    </div>
  {/each}
</div> -->

<div class="d-flex flex-column ps-2" style="width: 20vw;" id="resource">
  <div class="mb-2">
    <div class="d-flex flex-row justify-content-between">
      <span class="fs-3">Resources:</span>
      <div>
        <button onclick={() => enableSearch()} class="btn btn-{showSearch ? 'danger' : 'primary'}"
          >{#if !showSearch}<i class="bi bi-search"></i>{/if}{!showSearch
            ? 'Search'
            : 'cancel'}</button
        >
      </div>
    </div>
    {#if showSearch}
      <TextInput bind:value={searchTerm} label="Search" />
    {/if}
  </div>
  <div class="flex-grow-1 overflow-auto">
    {#each resourceTypes as resourceType}
      {#if !showSearch || (showSearch && searchTerm === '') || (showSearch && resourceStore.find((resource) => resource.name
                .toLowerCase()
                .includes(searchTerm) && resource.resourceType === resourceType))}
        <div class="mb-1 border-bottom truncate-text-single-line">
          <span class="fs-5">{resourceType}:</span>
        </div>
      {/if}
      {#each resourceStore as resource, index}
        {#if resource.resourceType === resourceType && (!showSearch || (showSearch && searchTerm === '') || (showSearch && resource.name
                .toLowerCase()
                .includes(searchTerm)))}
          <div class="w-100 border rounded p-2 {index < resourceStore.length - 1 ? 'mb-2' : ''}">
            <Resource {resource} />
          </div>
        {/if}
      {/each}
    {/each}
  </div>
</div>
