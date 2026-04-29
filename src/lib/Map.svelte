<script lang="ts">
  import { onMount } from "svelte";
  import { toastStore } from '@skeletonlabs/skeleton';
  import type { ToastSettings } from '@skeletonlabs/skeleton';
  let mapTop: google.maps.Map;
  let mapBottom: Microsoft.Maps.Map;
  let googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let bingApiKey = import.meta.env.VITE_BING_MAPS_API_KEY;
  let githubToken = import.meta.env.VITE_GITHUB_TOKEN;
  let showSuggestModal = false;
  let suggestName = '';
  let suggestDescription = '';
  let submitting = false;
  let submitCooldown = false;
  let fullscreen = false;
  let showLabels = false;

  type Loc = { name: string; lat: number; lng: number; zoom: number };
  const locationGroups: { city: string; items: Loc[] }[] = [
    {
      city: 'Mariupol',
      items: [
        { name: 'Drama theater', lat: 47.09608780316091, lng: 37.548594984979225, zoom: 16 },
        { name: 'Starokrymske cemetery', lat: 47.13898178118376, lng: 37.48489740832877, zoom: 16 },
        { name: 'Metro store bread line', lat: 47.11829043232631, lng: 37.50278803007427, zoom: 16 },
        { name: 'Epicentr K mall', lat: 47.098173121798325, lng: 37.50222027265384, zoom: 17 },
        { name: 'Child Clinic', lat: 47.1271484, lng: 37.6859701, zoom: 19 },
        { name: 'Maternity hospital', lat: 47.15182764443729, lng: 37.608116383840496, zoom: 19 },
        { name: 'History museum', lat: 47.0928687, lng: 37.5575726, zoom: 19 },
        { name: 'Kuindzhi museum', lat: 47.0934991, lng: 37.5507241, zoom: 19 },
        { name: 'Azovstal steelworks', lat: 47.0925, lng: 37.6131, zoom: 14 },
        { name: 'Destroyed PortCity', lat: 47.11589505454007, lng: 37.50751135491948, zoom: 18 },
        { name: '350 unknown graves, some filled (Manhush)', lat: 47.073021957525, lng: 37.29967261999493, zoom: 18 },
        { name: 'Firing positions (Manhush)', lat: 47.07496052993682, lng: 37.35484725751761, zoom: 17 },
      ],
    },
    {
      city: 'Bakhmut',
      items: [
        { name: 'Intensive Care Hospital', lat: 48.59617006237138, lng: 37.99740525528709, zoom: 18 },
        { name: 'Chasiv Yar', lat: 48.58799307992216, lng: 37.834246642208235, zoom: 18 },
      ],
    },
    {
      city: 'Maryinka',
      items: [
        { name: 'Kindergarten', lat: 47.934670821743985, lng: 37.50297129708892, zoom: 19 },
      ],
    },
    {
      city: 'Popasna',
      items: [
        { name: 'Popasna', lat: 48.63020819962778, lng: 38.373239418150774, zoom: 18 },
      ],
    },
    {
      city: 'Hostomel',
      items: [
        { name: 'Antonov airport', lat: 50.58858316087714, lng: 30.209800244624148, zoom: 16 },
      ],
    },
  ];
  let expanded: Record<string, boolean> = { Mariupol: true };

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
    (window as any).GetMap = () => resolve(true);
    const script = document.createElement("script");
    script.src = `https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=${bingApiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}


  onMount(async () => {
    //console.log("Loading Google Maps API...");
    await loadGoogleMapsAPI();
    //console.log("Google Maps API loaded!");
    await loadBingMapsAPI();
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
          showScalebar: false,
          showZoomButtons: false,
          disableBirdseye: true,
          disableStreetside: true,
          navigationBarMode: Microsoft.Maps.NavigationBarMode?.minified,
          navigationBarOrientation: Microsoft.Maps.NavigationBarOrientation?.horizontal,
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

  function toggleLabels(): void {
    showLabels = !showLabels;
    mapTop.setMapTypeId(showLabels ? 'hybrid' : 'satellite');
  }

  function toggleFullscreen(): void {
    fullscreen = !fullscreen;
    // trigger map resize after layout change
    setTimeout(() => {
      google.maps.event.trigger(mapTop, 'resize');
      mapBottom.setView({ center: mapBottom.getCenter() });
    }, 50);
  }

  async function saveScreenshot(): Promise<void> {
    const center = mapTop.getCenter();
    const lat = center.lat();
    const lng = center.lng();
    const zoom = mapTop.getZoom();

    const t: ToastSettings = { message: 'Capturing screenshot...', background: 'variant-filled-surface' };
    toastStore.trigger(t);

    const width = 640;
    const height = 400;

    const googleUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=satellite&key=${googleApiKey}`;
    const bingUrl = `/api/bing-static?lat=${lat}&lng=${lng}&zoom=${zoom}&w=${width}&h=${height}`;

    try {
      const loadImg = (url: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

      const googleImg = await loadImg(googleUrl);
      let bingImg: HTMLImageElement | null = null;
      try { bingImg = await loadImg(bingUrl); } catch { /* proxy may be down */ }

      const totalHeight = bingImg ? height * 2 : height;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(googleImg, 0, 0, width, height);
      if (bingImg) ctx.drawImage(bingImg, 0, height, width, height);

      const ts = Date.now();
      const filename = `ukraine-${lat.toFixed(4)}-${lng.toFixed(4)}-z${zoom}-${ts}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      const msg = bingImg ? 'Screenshot saved!' : 'Screenshot saved (Google only).';
      const done: ToastSettings = { message: msg, background: 'variant-filled-success' };
      toastStore.trigger(done);
    } catch (e) {
      console.error('Screenshot failed:', e);
      const err: ToastSettings = { message: 'Screenshot capture failed. Check your Google Maps API key.', background: 'variant-filled-warning' };
      toastStore.trigger(err);
    }
  }

  function buildSnippet(name: string, lat: number, lng: number, zoom: number): string {
    const safeName = (name || 'Unnamed').replace(/'/g, "\\'");
    return `{ name: '${safeName}', lat: ${lat}, lng: ${lng}, zoom: ${zoom} },`;
  }

  async function copySnippet(): Promise<void> {
    if (!mapTop) return;
    const center = mapTop.getCenter();
    const snippet = buildSnippet(suggestName.trim() || 'Unnamed', center.lat(), center.lng(), mapTop.getZoom());
    try {
      await navigator.clipboard.writeText(snippet);
      toastStore.trigger({ message: 'Snippet copied to clipboard.', background: 'variant-filled-success' });
    } catch {
      toastStore.trigger({ message: 'Copy failed. Select and copy manually.', background: 'variant-filled-warning' });
    }
  }

  async function submitSuggestion(): Promise<void> {
    if (!suggestName.trim()) return;
    submitting = true;

    const center = mapTop.getCenter();
    const lat = center.lat();
    const lng = center.lng();
    const zoom = mapTop.getZoom();

    const title = `📍 Location suggestion: ${suggestName.trim()}`;
    const snippet = buildSnippet(suggestName.trim(), lat, lng, zoom);
    const body = [
      `**Coordinates:** ${lat}, ${lng}`,
      `**Zoom:** ${zoom}`,
      `**Description:** ${suggestDescription.trim() || 'N/A'}`,
      `**Google Maps link:** https://www.google.com/maps/@${lat},${lng},${zoom}z`,
      ``,
      `<details><summary>Code to add to Map.svelte locationGroups</summary>`,
      ``,
      '```ts',
      snippet,
      '```',
      ``,
      `</details>`,
    ].join('\n');

    try {
      const res = await fetch('https://api.github.com/repos/NamesMark/Ukraine-split-screen/issues', {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body, labels: ['location-suggestion'] }),
      });

      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);

      const t: ToastSettings = { message: 'Location suggested! It will be reviewed shortly.', background: 'variant-filled-success' };
      toastStore.trigger(t);
      showSuggestModal = false;
      suggestName = '';
      suggestDescription = '';
      submitCooldown = true;
      setTimeout(() => { submitCooldown = false; }, 60000);
    } catch (e) {
      const t: ToastSettings = { message: 'Something went wrong. Please try again later.', background: 'variant-filled-error' };
      toastStore.trigger(t);
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:window on:keydown={(e) => { if (e.key === 'Escape' && fullscreen) toggleFullscreen(); }} />

<style>
  select:focus {
    outline: none;
  }
  /* Hide Bing Maps navigation bar / map type selector overlay. */
  :global(.NavBar_Container),
  :global(.NavBar-Container),
  :global(.MapTypeSelector),
  :global(.MapTypeRoot),
  :global(.ZoomControl),
  :global([class*="NavBar"]),
  :global([class*="MapTypeSelector"]) {
    display: none !important;
  }
</style>

<div class="flex w-full h-full" class:fixed={fullscreen} class:inset-0={fullscreen} class:z-40={fullscreen}>
  {#if !fullscreen}
  <div class="flex flex-col w-1/4">
    <div class="location-tree card p-2 overflow-y-auto" style="max-height: 24rem;">
      {#each locationGroups as group}
        <button
          type="button"
          class="group-header w-full text-left px-2 py-1 font-semibold hover:bg-surface-500/20 rounded"
          on:click={() => { expanded[group.city] = !expanded[group.city]; expanded = expanded; }}
        >
          <span class="inline-block w-4">{expanded[group.city] ? '▼' : '▶'}</span>
          {group.city}
          <span class="opacity-60">({group.items.length})</span>
        </button>
        {#if expanded[group.city]}
          <div class="pl-6">
            {#each group.items as loc}
              <button
                type="button"
                class="w-full text-left px-2 py-0.5 text-sm hover:bg-surface-500/20 rounded"
                on:click={() => goToLocation(loc.lat, loc.lng, loc.zoom)}
              >
                {loc.name}
              </button>
            {/each}
          </div>
        {/if}
      {/each}
    </div>
    <div class="flex flex-col gap-2 mt-4 w-full px-1">
      <button class="btn btn-sm variant-filled-primary w-full" on:click={() => { showSuggestModal = true; }}>Suggest Location</button>
      <button class="btn btn-sm variant-filled-secondary w-full" id="screenshotBtn" on:click={saveScreenshot}>📸 Save Screenshot</button>
      <button class="btn btn-sm variant-filled-tertiary w-full" on:click={toggleLabels}>{showLabels ? 'Hide' : 'Show'} Labels</button>
      <button class="btn btn-sm variant-filled-surface w-full" on:click={toggleFullscreen}>Fullscreen</button>
    </div>
  </div>
  {/if}
  <div class="flex flex-col w-full h-full justify-center items-center relative">
    {#if fullscreen}
    <button class="btn btn-sm variant-filled-surface absolute top-2 left-2 z-10 opacity-75 hover:opacity-100" on:click={toggleFullscreen}>✕ Exit</button>
    {/if}
    <!-- Map container: -->
    <div id="mapTop" class="w-full h-1/2"></div>
    <div id="mapBottom" class="w-full h-1/2"></div>
  </div>

</div>

{#if showSuggestModal}
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" on:click|self={() => { showSuggestModal = false; }}>
  <div class="card p-6 w-[30rem] max-w-[95vw] space-y-4">
    <h3>Suggest a Location</h3>
    <label class="label">
      <span>Name *</span>
      <input class="input px-3 py-2" type="text" bind:value={suggestName} placeholder="e.g. Destroyed school" />
    </label>
    <label class="label">
      <span>Description</span>
      <textarea class="textarea px-3 py-2" rows="3" bind:value={suggestDescription} placeholder="What happened here?"></textarea>
    </label>
    <p class="text-sm opacity-60">
      Coordinates: {mapTop ? `${mapTop.getCenter().lat().toFixed(6)}, ${mapTop.getCenter().lng().toFixed(6)}` : '...'} | Zoom: {mapTop ? mapTop.getZoom() : '...'}
    </p>
    {#if mapTop}
      <details class="text-sm">
        <summary class="cursor-pointer opacity-80 hover:opacity-100">Code snippet (click to expand)</summary>
        <pre
          class="mt-2 font-mono text-xs px-3 py-2 rounded bg-surface-700/40 hover:bg-surface-700/60 cursor-pointer select-all"
          style="white-space: pre-wrap; word-break: break-all;"
          title="Click to copy"
          on:click={copySnippet}
        >{buildSnippet(suggestName.trim() || 'Unnamed', mapTop.getCenter().lat(), mapTop.getCenter().lng(), mapTop.getZoom())}</pre>
      </details>
    {/if}
    <div class="flex gap-2 justify-end">
      <button class="btn variant-ghost-surface" on:click={() => { showSuggestModal = false; }}>Cancel</button>
      <button class="btn variant-ghost-primary" on:click={copySnippet}>📋 Copy snippet</button>
      <button
        class="btn variant-filled-primary"
        on:click={submitSuggestion}
        disabled={submitting || submitCooldown || !suggestName.trim()}
      >
        {#if submitting}Submitting...{:else if submitCooldown}Wait 60s{:else}Submit issue{/if}
      </button>
    </div>
  </div>
</div>
{/if}
