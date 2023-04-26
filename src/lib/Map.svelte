<script lang="ts">
    import { onMount } from 'svelte';
    import type { Map, MapOptions, LatLng } from 'googlemaps';
  
    let mapLeft: google.maps.Map;
    let mapRight: google.maps.Map;
  
    onMount(() => {
        if (typeof window === 'undefined') return;
        
      const mapOptions: google.maps.MapOptions = {
        zoom: 16,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
      };
  
      mapLeft = new google.maps.Map(
        document.getElementById('mapLeft') as HTMLElement,
        {
          ...mapOptions,
          center: { lat: 47.0971, lng: 37.5434 }, // Mariupol coordinates
        }
      );
  
      mapRight = new google.maps.Map(
        document.getElementById('mapRight') as HTMLElement,
        {
          ...mapOptions,
          center: { lat: 47.0971, lng: 37.5434 },
        }
      );
  
      mapLeft.setOptions({ imageryStartDate: new Date('2022-01-01') }); // date before the war
      mapRight.setOptions({ imageryStartDate: new Date('2022-04-04') }); // last known updated Google satellite images
    });
  
    function goToLocation(lat: number, lng: number): void {
      const center = new google.maps.LatLng(lat, lng);
      mapLeft.setCenter(center);
      mapRight.setCenter(center);
    }
  </script>
  
  <style>
    .map-container {
      display: flex;
    }
  
    .map {
      height: 400px;
      width: 100%;
    }
  </style>
  
  <div class="map-container">
    <div id="mapLeft" class="map"></div>
    <div id="mapRight" class="map"></div>
  </div>
  
  <!-- <select
  on:change="{(event) => {
    const target = (event.target as HTMLSelectElement);
    const [lat, lng] = target.value.split(',').map(Number);
    goToLocation(lat, lng);
  }}"
>
  <option>Select a location</option>
  <option value="47.0971,37.5434">Mariupol Drama Theater</option>
  <option value="49.9935,36.2304">Kharkiv</option>
  TODO <option value="">Antonov Airport (Hostomel)</option>
   TODO: find more locations in Mariupol, Volnovakha, and other cities
</select> -->