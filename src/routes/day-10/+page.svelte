<script lang="ts">
	import HolidayPopup from './HolidayPopup.svelte';
	import { onMount } from 'svelte';

	let dialog: HTMLDialogElement;

	onMount(() => {
		setTimeout(() => {
			dialog.showModal();
		}, 3000);
	});
</script>

<HolidayPopup bind:dialog />

<main>
	<h1>Santa's Holiday Greeting Pop-Up</h1>
	<p class="wait-text">Wait for 3 seconds to see the holiday greeting!</p>
</main>

<style>
	main {
		max-width: 800px;
		margin: 40px auto;
		padding: 40px;
		text-align: center;
		background-color: white;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	h1 {
		color: var(--xmas-red);
		margin-bottom: 20px;
	}

	.wait-text {
		color: #333;
	}
</style>
