<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Map from '../lib/Map.svelte';
  
  </script>
<main>

	<div class="container h-screen mx-auto flex flex-col justify-center items-center">
		<div class="py-5">
		<h1>Ukraine Satellite Imagery Comparison</h1>
		</div>
		{#if browser}
		  <Map />
		{/if}
	</div>
</main>

<style lang="postcss">

</style>
