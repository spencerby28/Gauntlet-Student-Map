<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Gauntlet Map</title>
	<link rel="manifest" href="/site.webmanifest">
</svelte:head>

{@render children()}
