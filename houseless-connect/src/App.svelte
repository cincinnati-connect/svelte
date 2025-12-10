<script>
  import DialogSharedAccessor from './lib/Dialog/Shared/Dialog-Shared-Accessor.svelte';
  import MapHub from './lib/Map/Map-Hub.svelte';
  import Map from './lib/Map/Map.svelte';
  import NavBar from './lib/Nav-Bar/Nav-Bar.svelte';
  import ProviderHome from './lib/Provider/Provider-Home.svelte';
  import ProviderHub from './lib/Provider/Provider-Hub.svelte';
  import ResourceContainer from './lib/Resources/Resource-Container.svelte';
  import TestMainQR from './lib/Test-Main-QR.svelte';
  import { onMount, onDestroy } from 'svelte';

  let currentView = $state('Home');
  let showPortraitWarning = $state(checkOrientation());
  let route = $state({ route: '', routeType: '' });

  function checkOrientation() {
    const isMobile = window.matchMedia('(max-width: 582px)').matches;
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;

    return isMobile && isPortrait;
  }

  function handleOrientationChange() {
    showPortraitWarning = checkOrientation();
  }

  onMount(() => {
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
  });

  onDestroy(() => {
    window.removeEventListener('orientationchange', handleOrientationChange);
    window.removeEventListener('resize', handleOrientationChange);
  });
</script>

<main class="p-2 d-flex flex-column height-full w-100">
  {#if showPortraitWarning}
    <div class="orientation-warning-overlay">
      <div class="popup">
        <h2>Please Rotate Your Device 📱🔄</h2>
        <p>
          This application is best viewed in **horizontal (landscape) mode**. Please rotate your
          phone or tablet to continue.
        </p>
      </div>
    </div>
  {:else}
    <NavBar bind:currentView />
    {#if currentView == 'Home'}
      <div class="d-flex flex-row height-full">
        <MapHub
          routeSelected={(val) => {
            route = val;
            console.log(val);
          }}
        />
        <ResourceContainer />
        <DialogSharedAccessor bind:route dialogType={route.routeType} />
      </div>
    {:else}
      <div class="phone-simulator flex-grow-1">
        <ProviderHome />
      </div>
    {/if}
  {/if}
</main>

<style>
  .popup {
    background-color: white;
    color: black;
    padding: 30px;
    border-radius: 12px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.3s ease-out;
  }

  .popup h2 {
    margin-top: 0;
    color: #4caf50;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .orientation-warning-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .phone-simulator {
    width: 390px;
    border: 12px solid #000;
    border-radius: 40px;
    overflow-y: auto;
    margin: 0 auto; /* center on page */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
</style>
