<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Map from '../lib/Map.svelte';
  
  </script>
<main>

	<div class="container h-full mx-auto flex justify-center items-center">
		<h1>Ukraine Satellite Imagery Comparison</h1>
		{#if browser}
			<Map />
		{/if}
	</div>
</main>

<style lang="postcss">

</style>
