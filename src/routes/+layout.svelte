<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import Map from '$lib/Map.svelte';

	// const donateModalComponent : ModalComponent = {
	// 	ref: 'donateModalComponent',
	// 	props: { ' },
	// 	slot: '<p></p>'
	//   };

	const donate: ModalSettings = {
					type: 'alert',
					title: 'Help Ukraine',
					image: '/vilni_request.jpg',
					body: '<p>Vilni Volunteers are collecting 27,000 USD to buy 9x DJI Mavic 3, 2x monoculars and a generator for 30th and 46th brigades stationed in Bakhmut. I\'m trying to help them, so if you like this website, donate to these awesome guys.</p>' 
					+'<p class="my-4">💰Paypal: marynaboroda123@gmail.com</p>'
					+ '<p class="content-center space-x-2 my-4"><a class="btn variant-ghost-tertiary" href = "https://send.monobank.ua/jar/X9BLcbXJu" target="_blank">Monobank jar</a>' 
					+ '<a class="btn variant-ghost-tertiary" href = "https://www.instagram.com/p/Coribcstakg/" target="_blank">Learn more</a>'
					+ '<a class="btn variant-ghost-surface" href = "https://linkpeak.io/l/helpukraine" target="_blank"">Other charities</a></p>', 
				  };



</script>

<svelte:head>
	<title>Ukraine Satellite Imagery Comparison</title>
	<meta name="description" content="See the scars on the cities of Ukraine before and after the russians." />

	<meta property="og:title" content="Ukraine Satellite Imagery Comparison" />
	<meta property="og:description" content="See the scars on the cities of Ukraine before and after the russians." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://ukraine-split-screen.vercel.app/" />
	<meta property="og:image" content="https://pbs.twimg.com/media/FvAChcwXsAASrxF?format=jpg&name=large" />
	<meta property="og:site_name" content="Ukraine Before and After" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Ukraine Satellite Imagery Comparison" />
	<meta name="twitter:description" content="See the scars on the cities of Ukraine before and after the russians." />
	<meta name="twitter:image" content="https://pbs.twimg.com/media/FvAChcwXsAASrxF?format=jpg&name=large" />
</svelte:head>

<!-- App Shell -->
<AppShell>
	
	<svelte:fragment slot="header">
		<Modal let:modalStore />
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Ukraine Before and After</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button
				class="btn btn-sm variant-ghost-surface"
				on:click={() => {
					console.log('Donate modal');
				  modalStore.trigger(donate);
				}}
			  >
				Donate
			  </button>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://twitter.com/KnightMirko"
					target="_blank"
					rel="noreferrer"
				>
					Twitter
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
