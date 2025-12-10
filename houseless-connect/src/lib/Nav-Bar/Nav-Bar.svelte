<script>
  import DynamicDialog from '../Shared-Components/dialog/Dynamic-Dialog.svelte';

  let { currentView = $bindable() } = $props();

  function goto(route) {
    currentView = route;
  }
</script>

{#snippet body()}
  <div class="d-flex flex-column">
    <span class="fs-4">Purpose</span>
    <span>
      This application has been designed to improve the overall connection between individuals in
      need and available resources in Cincinnati Ohio. The concept is such that the Bus Station View
      would be a kiosk included at all bus stations and utilize real-time data to connect guests to
      the best and closest resources possible. The program would be free for all guests and be an
      extension of the 211 hotline and Central Access Point.
    </span>
    <span class="fs-4">Bus Station View (Home page)</span>
    <span
      >Cincinnati Connect is a web prototype of a kiosk and mobile application. The main view (Bus
      Station View) provides users with a fully accessible map with a bus station at the center and
      all routes going through it drawn on the map. Additionally all resources shown on the right
      side of the page have information included in all of their respective pins on the map. By
      selecting a resource on the right, you will be instantly taken over to the pin and be able to
      see information about the resource. On the bus stop, you can select a route and will be able
      to purchase a ticket using cash or a credit card. When viewing a resource's pin information,
      you will be able to call the resource if applicable or select the "Help me get their for free"
      link to begin getting connected to the resource. Once you are viewing the reource connection
      pop-up, you can not scan your id (which is created in this application), search your user
      information, or register for services. Upon creating or finding your user, when you click
      submit you will have a bus pass and resource check-in pass created.</span
    >
    <span class="fs-4">Resource Provider View</span>
    <span
      >When using the Resource Provider View, you will notice a simulated mobile phone. The purpose
      is to reflect the use of this application in a mobile context for providers to reduce cost
      while improving quality of work. From this view, the provider can check in a user either by
      searching for their record or scanning their bus pass created in the Bus Station View. The
      provider can also create a new person which will create an id and profile for the guest. If
      the user has not yet had an ID printed, the provider can also print the ID in house to make it
      easier for the guest to schedule follow up appointments.</span
    >
  </div>
{/snippet}

<div id="nav-bar" class="d-flex flex-row justify-content-between border-bottom mb-2">
  <div>
    <span class="fs-1">Cincinnati Connect</span>
  </div>
  <div class="d-flex align-items-center">
    {#if currentView == 'Resource'}
      <button class="btn btn-primary me-2" onclick={() => goto('Home')}
        ><i class="bi bi-arrow-left-right"></i>Bus Station View</button
      >
    {:else if currentView == 'Home'}
      <button class="btn btn-primary me-2" onclick={() => goto('Resource')}>
        <i class="bi bi-arrow-left-right"></i>
        Resource Provider View</button
      >
    {/if}
    <!-- <button class="btn btn-success">About</button> -->
    <DynamicDialog
      headerText="About Cincinnati Connect"
      buttonLabel="About"
      dialogButtonSeverity="success"
      buttonIcon="bi-info-circle"
      {body}
      hasFooter={false}
    />
  </div>
</div>
