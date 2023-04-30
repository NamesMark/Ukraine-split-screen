<script lang="ts">
  import { onMount } from "svelte";
  let mapTop: google.maps.Map;
  let mapBottom: Microsoft.Maps.Map;
  let googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let bingApiKey = import.meta.env.VITE_BING_MAPS_API_KEY;

  function loadGoogleMapsAPI() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve(true);
      };
      document.head.appendChild(script);
    });
  }
  function loadBingMapsAPI() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = `https://www.bing.com/api/maps/mapcontrol?key=${bingApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve(true);
      };
      document.head.appendChild(script);
    });
  }

  onMount(async () => {
    console.log("Loading Google Maps API...");
    await loadGoogleMapsAPI();
    console.log("Google Maps API loaded!");
    await loadBingMapsAPI();
    console.log("Bing Maps API loaded!");
    initMaps();
  });

  function initMaps(): void {
    console.log("Initializing maps...");
    const mapOptions: google.maps.MapOptions = {
      zoom: 16,
      mapTypeId: "satellite",
      disableDefaultUI: true,
    };

    console.log("Initializing map... new google.maps.Map()");
    mapTop = new google.maps.Map(
      document.getElementById("mapTop") as HTMLElement,
      {
        ...mapOptions,
        //center: { lat: 47.0971, lng: 37.5434 }, // Mariupol coordinates
        center: {lat:47.09608780316091,lng:37.548594984979225, } // Mariupol Drama theater
      }
    );
    console.log("Initializing map done!");

    const bingMapOptions = {
      center: new Microsoft.Maps.Location(47.09608780316091, 37.548594984979225),
      zoom: 16,
      mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    };
    const bingMap = new Microsoft.Maps.Map(document.getElementById("bingMap"), bingMapOptions);


    mapTop.addListener('click', (event) => {
      const clickedLatLng = event.latLng;
      const clickedLat = clickedLatLng.lat();
      const clickedLng = clickedLatLng.lng();
      const currentZoom = mapTop.getZoom();
      console.log("Clicked coordinates: ");
      console.log(`${clickedLat},${clickedLng}`);
      console.log(`Current zoom: ${currentZoom}`);
    });

  }

  function goToLocation(lat: number, lng: number, zoom:number): void {
    const center = new google.maps.LatLng(lat, lng);
    mapTop.setCenter(center);
    mapTop.setZoom(zoom || 18);
  }
</script>

<style>

</style>

<div class = "flex w-full h-full">
  <select class = "select w-1/4" size="5" value="1"
  on:change="{(event) => {
    const target = event.target;
    const [lat, lng, zoom] = target.value.split(',').map(Number);
    goToLocation(lat, lng, zoom);
  }}"
>
  
  <option disabled>Select a location:</option>
  <option value="47.09608780316091,37.548594984979225">Drama Theater</option>
  <option value="47.13898178118376,37.48489740832877,16">Starokrymske Cemetery</option>
  <option value="47.11829043232631,37.50278803007427">Metro store bread line</option>
  <option value="47.098173121798325,37.50222027265384,17">Epicentr K Mall</option>
  <option value="47.1271484,37.6859701,19">Child Clinic</option>
  <option value="47.15182764443729,37.608116383840496,19">Maternity Hospital</option>
  <option value="47.0928687,37.5575726,19">History museum</option>
  <option value="47.0934991,37.5507241,19">Kuindzhi museum</option>
  <option value="50.58858316087714,30.209800244624148,16">Antonov Airport (Hostomel)</option>
</select>
  <div class="flex flex-col w-full h-full justify-center items-center">
    <!-- Map container: -->
    <div id="mapTop" class="w-full h-1/2 border-red"></div>
    <div id="mapBottom" class="w-full h-1/2 border-green"></div>
  </div>

</div>

  
