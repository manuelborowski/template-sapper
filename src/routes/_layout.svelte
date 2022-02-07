<script>
	import Nav from '../components/Nav.svelte';
	export let segment;
	import { version } from '../version';
</script>

<div class="fixed top-0 h-16">
<Nav {segment}/>
</div>

<main class="mt-16 bg-white p-8 box-border min-h-[40rem]">
	<slot></slot>
</main>

<footer class="bg-gray-300 p-8 box-border">
	<h1>{@html version}</h1>
</footer>