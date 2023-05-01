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
    script.src = `https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=${bingApiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    const waitForMicrosoftMaps = () => {
      if (typeof Microsoft !== "undefined" && typeof Microsoft.Maps.Map !== "undefined") {
        resolve(true);
      } else {
        setTimeout(waitForMicrosoftMaps, 100);
      }
    };

    waitForMicrosoftMaps();
  });
}

  function waitForMicrosoftNamespace(): Promise<void> {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (typeof Microsoft !== "undefined") {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}


  onMount(async () => {
    //console.log("Loading Google Maps API...");
    await loadGoogleMapsAPI();
    //console.log("Google Maps API loaded!");
    await loadBingMapsAPI();
    await waitForMicrosoftNamespace();
    //console.log("Bing Maps API loaded!");
    initMaps();
  });

  async function initMaps(): Promise<void> {
    //console.log("Initializing maps...");
    const mapOptions: google.maps.MapOptions = {
      zoom: 16,
      mapTypeId: "satellite",
      disableDefaultUI: true,
    };

    //console.log("Initializing map... new google.maps.Map()");
    mapTop = new google.maps.Map(
      document.getElementById("mapTop") as HTMLElement,
      {
        ...mapOptions,
        //center: { lat: 47.0971, lng: 37.5434 }, // Mariupol coordinates
        center: {lat:47.09608780316091,lng:37.548594984979225, } // Mariupol Drama theater
      }
    );
    //console.log("Initializing Google map done!");

    //console.log("Initializing map... new Microsoft.Maps.Map()");
    await new Promise<void>((resolve) => {
      const bingMapOptions = {
          center: new Microsoft.Maps.Location(47.09608780316091, 37.548594984979225),
          zoom: 16,
          mapTypeId: Microsoft.Maps.MapTypeId.aerial,
          credentials: bingApiKey,
          showCopyright: false,
          showDashboard: false,
          showLocateMeButton: false,
        };
        //console.log(bingMapOptions);
        mapBottom = new Microsoft.Maps.Map('#mapBottom', bingMapOptions);
        resolve();
  });
    //console.log("Initializing Bing map done!");


    mapTop.addListener('click', (event) => {
      const clickedLatLng = event.latLng;
      const clickedLat = clickedLatLng.lat();
      const clickedLng = clickedLatLng.lng();
      const currentZoom = mapTop.getZoom();
      console.log("Clicked coordinates: ");
      console.log(`${clickedLat},${clickedLng}`);
      console.log(`Current zoom: ${currentZoom}`);
    });

    mapTop.addListener('center_changed', () => {
    const center = mapTop.getCenter();
    const lat = center.lat();
    const lng = center.lng();
    mapBottom.setView({ center: new Microsoft.Maps.Location(lat, lng) });
  });

  mapTop.addListener('zoom_changed', () => {
    const zoom = mapTop.getZoom();
    mapBottom.setView({ zoom: zoom });
  });

  Microsoft.Maps.Events.addHandler(mapBottom, 'viewchangeend', () => {
  const center = mapBottom.getCenter();
  const lat = center.latitude;
  const lng = center.longitude;
  const zoom = mapBottom.getZoom();
  mapTop.setCenter(new google.maps.LatLng(lat, lng));
  mapTop.setZoom(zoom);
});

  }

  function goToLocation(lat: number, lng: number, zoom:number): void {
    const center = new google.maps.LatLng(lat, lng);
    mapTop.setCenter(center);
    mapTop.setZoom(zoom || 18);
    mapBottom.setView({center: new Microsoft.Maps.Location(lat, lng)});
    mapBottom.setView({zoom: zoom || 18});
  }
</script>

<style>
  select:focus {
    outline: none;
  }
</style>

<div class = "flex w-full h-full">
  <select class = "select w-1/4" size="5" value="1"
  on:change="{(event) => {
    const target = event.target;
    const [lat, lng, zoom] = target.value.split(',').map(Number)||[47.09608780316091,37.548594984979225, 16];
    goToLocation(lat, lng, zoom);
  }}"
>
  
  <option disabled>Select a location:</option>
  <option value="47.09608780316091,37.548594984979225">Drama theater</option>
  <option value="47.13898178118376,37.48489740832877,16">Starokrymske cemetery</option>
  <option value="47.11829043232631,37.50278803007427">Metro store bread line</option>
  <option value="47.098173121798325,37.50222027265384,17">Epicentr K mall</option>
  <option value="47.1271484,37.6859701,19">Child Clinic</option>
  <option value="47.15182764443729,37.608116383840496,19">Maternity hospital</option>
  <option value="47.0928687,37.5575726,19">History museum</option>
  <option value="47.0934991,37.5507241,19">Kuindzhi museum</option>
  <option value="50.58858316087714,30.209800244624148,16">Antonov airport (Hostomel)</option>
  <option value="47.073021957525,37.29967261999493,18">350 unknown graves, some filled</option>
  <option value="47.07496052993682,37.35484725751761,17">Firing positions</option>
</select>
  <div class="flex flex-col w-full h-full justify-center items-center">
    <!-- Map container: -->
    <div id="mapTop" class="w-full h-1/2"></div>
    <div id="mapBottom" class="w-full h-1/2"></div>
  </div>

</div>

  
