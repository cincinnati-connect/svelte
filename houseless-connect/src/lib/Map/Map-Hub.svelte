<script>
  import { resources } from '../Resources/Resource.store.svelte';
  import Map from './Map.svelte';

  let { routeSelected = null } = $props();

  function onBusRouteSelected(route) {
    routeSelected({ route: route, routeType: 'BusRoute' });
  }

  function onResourceRouteSelected(route) {
    const resourceList = resources;
    const resourceRoute = resourceList[route];
    routeSelected({ route: resourceRoute, routeType: 'ResourceRoute' });
  }

  const updateDimensions = () => {
    setTimeout(() => {
      const app = document.querySelector('#app');
      const navbar = document.querySelector('#nav-bar');
      const resource = document.querySelector('#resource');
      const mapContainer = document.querySelector('.parent-map-container'); // Renamed variable for clarity

      if (mapContainer && app && navbar) {
        console.log('map exists');
        // @ts-ignore
        mapContainer.style.height = `${(app.clientHeight && navbar.clientHeight ? app.clientHeight - navbar.clientHeight - 24 : undefined) ?? 300}px`;
        // @ts-ignore
        mapContainer.style.width = `${(app.clientWidth && resource.clientWidth ? app.clientWidth - resource.clientWidth : undefined) ?? 550}px`;
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
</script>

<div class="parent-map-container">
  <Map
    busRouteSelected={(val) => onBusRouteSelected(val)}
    resourceRouteSelected={(val) => onResourceRouteSelected(val)}
  />
</div>
