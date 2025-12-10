<script>
  import { onMount, onDestroy } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import iconUrl from 'leaflet/dist/images/marker-icon.png';
  import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
  // Assuming these are defined in a separate Svelte store file
  import { routes, busStation } from './Routes.store.svelte';
  import { resources } from '../Resources/Resource.store.svelte';
  import { homeMarkerRegistry, markerRegistry } from './Marker.store.svelte';
  import { get } from 'svelte/store';

  // --- 1. FIXED DEFAULT COORDINATE ---
  const defaultLocation = {
    lat: 39.127689, // Default Latitude
    lng: -84.511471, // Default Longitude
  };
  // ----------------------------------------

  let { busRouteSelected = null, resourceRouteSelected = null } = $props();

  const routeData = routes;
  const stationData = busStation;
  const resourceList = resources;

  let map;
  let mapContainer;
  let userMarker;
  let shelterLayerGroup;
  let routeLayerGroup;
  let stationLayerGroup;

  const legendData = [
    { color: '#FF5733', label: 'Mental Health & Substance Use' },
    { color: '#33FF57', label: 'Healthcare' },
    { color: '#3357FF', label: 'Employment Assistance' },
    { color: '#FF33A1', label: 'Identification' },
    { color: '#33FFF6', label: 'Outreach & Drop-in Centers' },
    { color: '#FFC300', label: 'Youth Assistance' },
    { color: '#8D33FF', label: 'Legal Assistance' },
    { color: '#00B8D4', label: 'Eviction Assistance' },
    { color: '#B833FF', label: 'Housing/Eviction Prevention' },
    { color: '#FF6F33', label: 'Free Meals & Pantries' },
    { color: '#4CAF50', label: 'Clothing & Household' },
    { color: '#FFD700', label: 'Additional Resources' },
  ];

  const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });

  const stationIcon = L.divIcon({
    className: 'custom-station-pin',
    html: '<svg fill="#2a75b0" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 20s-7-5.5-7-10c0-3.8 3.2-7 7-7s7 3.2 7 7c0 4.5-7 10-7 10zM10 6c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"/></svg>',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35],
  });

  L.Marker.prototype.options.icon = defaultIcon;

  function onBusRouteSelected(route) {
    console.log(`Route selected: ${route}`);
    busRouteSelected(route);
  }

  function onResourceRouteSelected(route) {
    console.log(`Route selected: ${route}`);
    resourceRouteSelected(route);
  }

  function createHomeControl(mapInstance, homeView) {
    // @ts-ignore
    const HomeControl = L.Control.extend({
      options: {
        position: 'topleft',
      },

      onAdd: function (map) {
        const container = L.DomUtil.create(
          'div',
          'leaflet-bar leaflet-control leaflet-control-custom'
        );

        container.innerHTML = '🏠';

        container.onclick = function () {
          mapInstance.flyTo([homeView.lat, homeView.lng], homeView.zoom, {
            duration: 1.5,
          });
        };

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        return container;
      },
    });

    return new HomeControl();
  }

  function createLegendControl(position, legendItems) {
    // @ts-ignore
    const Legend = L.Control.extend({
      options: {
        position: position || 'bottomright',
      },

      onAdd: function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        let labels = [];

        legendItems.forEach((item) => {
          labels.push(`<i style="background:${item.color};"></i> ${item.label}`);
        });

        div.innerHTML = '<h4>Map Legend</h4>' + labels.join('<br>');

        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);

        return div;
      },

      onRemove: function (map) {},
    });

    return new Legend();
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function plotShelters(userLocation) {
    if (!map || !shelterLayerGroup) return;

    shelterLayerGroup.clearLayers();

    const [userLat, userLon] = userLocation;
    const maxDistanceMiles = 50;

    const markers = {};

    resourceList.forEach((shelter) => {
      if (shelter.Lat && shelter.Lon) {
        const distance = getDistance(userLat, userLon, shelter.Lat, shelter.Lon);
        let shelterIcon;
        if (distance <= maxDistanceMiles) {
          switch (shelter.resourceType) {
            case 'Mental Health & Substance Use':
              shelterIcon = L.divIcon(createPin('#FF5733'));
              break;
            case 'Healthcare':
              shelterIcon = L.divIcon(createPin('#33FF57'));
              break;
            case 'Employment Assistance':
              shelterIcon = L.divIcon(createPin('#3357FF'));
              break;
            case 'Identification':
              shelterIcon = L.divIcon(createPin('#FF33A1'));
              break;
            case 'Outreach & Drop-in Centers':
              shelterIcon = L.divIcon(createPin('#33FFF6'));
              break;
            case 'Youth Assistance':
              shelterIcon = L.divIcon(createPin('#FFC300'));
              break;
            case 'Legal Assistance':
              shelterIcon = L.divIcon(createPin('#8D33FF'));
              break;
            case 'Eviction Assistance':
              shelterIcon = L.divIcon(createPin('#00B8D4'));
              break;
            case 'Housing/Eviction Prevention':
              shelterIcon = L.divIcon(createPin('#B833FF'));
              break;
            case 'Free Meals & Pantries':
              shelterIcon = L.divIcon(createPin('#FF6F33'));
              break;
            case 'Clothing & Household':
              shelterIcon = L.divIcon(createPin('#4CAF50'));
              break;
            case 'Additional Resources':
              shelterIcon = L.divIcon(createPin('#FFD700'));
              break;
            default:
              shelterIcon = L.divIcon(createPin('red'));
              break;
          }

          const marker = L.marker([shelter.Lat, shelter.Lon], { icon: shelterIcon })
            .bindPopup(
              `<div class="border-bottom pb-2 mb-2">
                <b  class="no-select">${shelter.name}</b>
                <br>
                <span class="no-select">${shelter.description}</span>
                <br>
              </div>
              <div class="border-bottom pb-2 mb-2">
                <span class="no-select">Hours: ${shelter.hours}</span>
                <br>
                <a href='tel:${shelter.phone}'>Phone: ${shelter.phone}</a>
                <br>
                <span class="no-select">Address: ${shelter.address}</span>
                <br> 
              </div>              
              <div class="resource-link" data-resource="${shelter.id}"><span class="route-link">Help me get there for free</span> </div>`
            )
            .addTo(shelterLayerGroup);

          marker.on('popupopen', function () {
            const popup = this.getPopup().getElement();

            const resourceLinks = popup.querySelectorAll('.resource-link');
            resourceLinks.forEach((link) => {
              link.onclick = function () {
                const resourceID = this.getAttribute('data-resource');
                onResourceRouteSelected(resourceID);
                console.log('shelter selected: ', resourceID);

                userMarker.closePopup();
              };
            });
          });

          markers[shelter.id] = marker;
        }
      }
    });

    markerRegistry.set(markers);

    const selector = '.leaflet-bottom.leaflet-right';
    const nodeToHide = document.querySelector(selector);
    if (nodeToHide) {
      nodeToHide.style.display = 'none';
    }
  }

  function formatToLeafletCoordinates(customPointsArray) {
    if (!customPointsArray || !Array.isArray(customPointsArray)) {
      return [];
    }
    return customPointsArray.map((point) => [point.Lat, point.Lon]);
  }

  function plotRoutes() {
    if (!map || !routeLayerGroup) return;

    routeLayerGroup.clearLayers();

    routeData.forEach((route) => {
      const latlngs = formatToLeafletCoordinates(route.Points);

      L.polyline(latlngs, {
        color: route.Color || '#000FFF',
        weight: 5,
        opacity: 0.8,
      })
        .bindTooltip(`Route: ${route.routeName}`, { sticky: true })
        .addTo(routeLayerGroup);
    });
  }

  function createPin(color) {
    return {
      className: 'custom-shelter-pin',
      html: `<svg fill="${color}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20s-7-5.5-7-10c0-3.8 3.2-7 7-7s7 3.2 7 7c0 4.5-7 10-7 10zM10 6c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"/>
    </svg>`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -35],
    };
  }

  function addElementToZoomControl(loc) {
    // 1. Find the target container (the parent of the zoom buttons)
    const zoomContainer = document.querySelector(
      '.leaflet-control-zoom.leaflet-bar.leaflet-control'
    );

    if (zoomContainer && map) {
      const homeButton = document.createElement('a');

      homeButton.className = 'leaflet-control-zoom-home leaflet-bar-part leaflet-bar-part-top';

      homeButton.href = '#';
      homeButton.title = 'Return to Starting View';
      homeButton.role = 'button';
      homeButton.setAttribute('aria-label', 'Return to Starting View');

      homeButton.innerHTML = '<span aria-hidden="true">🏠</span>';

      homeButton.onclick = (e) => {
        L.DomEvent.preventDefault(e);
        map.flyTo([loc.initialCenterLat, loc.initialCenterLong], loc.zoom, {
          duration: 1.5,
        });
      };

      zoomContainer.prepend(homeButton);

      const zoomInButton = zoomContainer.querySelector('.leaflet-control-zoom-in');
      if (zoomInButton) {
        zoomInButton.classList.remove('leaflet-bar-part-top');
        zoomInButton.classList.add('leaflet-bar-part');
      }
    } else {
      console.warn('Leaflet map or Zoom Control container not found.');
    }
  }

  onMount(() => {
    const initialCenterLat = defaultLocation.lat;
    const initialCenterLong = defaultLocation.lng;
    const initialZoom = 15;
    const initialLoc = {
      initialCenterLat: initialCenterLat,
      initialCenterLong: initialCenterLong,
      zoom: initialZoom,
    };

    map = L.map(mapContainer).setView([initialCenterLat, initialCenterLong], initialZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '',
    }).addTo(map);

    shelterLayerGroup = L.layerGroup().addTo(map);
    routeLayerGroup = L.layerGroup().addTo(map);
    stationLayerGroup = L.layerGroup().addTo(map);

    const [fixedLat, fixedLng] = [defaultLocation.lat, defaultLocation.lng];

    plotRoutes();
    plotShelters([fixedLat, fixedLng]);

    userMarker = L.marker([fixedLat, fixedLng]).addTo(map);

    const popupHTML = `
      <div class="no-select">
        <b>Vine St & McMillan St Southbound</b><br />
        <p>You are here</p>
        <b>Available Routes:</b>
      </div>
      <ul>
        <li class="route-link" data-route="Metro Plus Inbound">
          <div style="display: flex; flex-direction: row;">
            <div style="width: 1em; height: 1em; background-color: red; margin-right: 0.5em"></div><span>Metro Plus Inbound</span>
          </div>
        </li>
        <li class="route-link" data-route="Avondale Inbound">
          <div style="display: flex; flex-direction: row;">
            <div style="width: 1em; height: 1em; background-color: black; margin-right: 0.5em"></div><span>Avondale Inbound</span>
          </div>
        </li>
        <li class="route-link" data-route="Vine Street Inbound">
          <div style="display: flex; flex-direction: row;">
            <div style="width: 1em; height: 1em; background-color: green; margin-right: 0.5em"></div><span>Vine Street Inbound</span>
          </div>
        </li>
      </ul>
    `;

    userMarker.bindPopup(popupHTML);

    userMarker.on('popupopen', function () {
      const popup = this.getPopup().getElement();

      const routeLinks = popup.querySelectorAll('.route-link');

      routeLinks.forEach((link) => {
        link.onclick = function () {
          const routeName = this.getAttribute('data-route');

          onBusRouteSelected(routeName);

          userMarker.closePopup();
        };
      });
    });

    const userMarkerHub = {};
    userMarkerHub[1] = userMarker;
    homeMarkerRegistry.set(userMarkerHub);

    userMarker.openPopup();

    const resizeObserver = new ResizeObserver(() => {
      if (map) {
        map.invalidateSize();
      }
    });

    resizeObserver.observe(mapContainer);

    addElementToZoomControl(initialLoc);
    const legend = createLegendControl('topright', legendData);
    legend.addTo(map);

    onDestroy(() => {
      if (map) {
        map.remove();
      }
      resizeObserver.disconnect();
    });
  });
</script>

<div class="map-container" bind:this={mapContainer}></div>

<style>
  .map-container {
    height: 100%;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  :global(.custom-station-pin svg) {
    width: 25px;
    height: 25px;
  }

  :global(.custom-shelter-pin svg) {
    width: 25px;
    height: 25px;
  }

  :global(.route-link) {
    cursor: pointer;
    padding: 2px 0;
    list-style: none;
    font-weight: bold;
    color: #007bff;
    text-decoration: underline;
  }

  :global(.info.legend) {
    background: white;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 6px;
    padding: 10px 12px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
  }

  :global(.legend h4) {
    margin-top: 0;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  :global(.legend i) {
    width: 18px;
    height: 18px;
    float: left;
    margin-right: 8px;
    opacity: 1;
    border-radius: 50%;
    border: 1px solid #ccc;
  }

  :global(.leaflet-control-custom) {
    background-color: #fff;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    width: 30px;
    height: 30px;
    font-size: 16px;
  }

  :global(.leaflet-popup-pane) {
    z-index: 2000 !important;
  }

  :global(.leaflet-popup) {
    z-index: 2000 !important;
  }

  :global(.leaflet-control) {
    z-index: 1000;
  }
</style>
