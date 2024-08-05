<script lang="ts">
	import { onMount } from 'svelte';
	import presentsData from '$lib/payloads/day-3.json';

	interface Present {
		name: string;
		weight: number;
	}

	let presents: Present[] = $state([]);
	let selectedPresents: Present[] = $state([]);
	let totalWeight = $derived(selectedPresents.reduce((sum, present) => sum + present.weight, 0));
	const maxWeight = 100;

	onMount(() => {
		presents = presentsData;
	});

	function togglePresent(present: Present) {
		selectedPresents = selectedPresents.some((p) => p.name === present.name)
			? selectedPresents.filter((p) => p.name !== present.name)
			: [...selectedPresents, present];
	}
</script>

<main>
	<h1>🎅 Sleigh Load Balancer (SLB™)</h1>

	<div class="sleigh-info">
		<h2>Current Sleigh Load: <span class="weight">{totalWeight.toFixed(2)} kg</span></h2>
		<div class="progress-container">
			<progress value={totalWeight} max={maxWeight} class:overloaded={totalWeight > maxWeight}
			></progress>
			<span class="progress-text">{totalWeight.toFixed(2)} / {maxWeight} kg</span>
		</div>
		{#if totalWeight > maxWeight}
			<p class="warning">⚠️ Warning: Sleigh overloaded!</p>
		{/if}
	</div>

	<div class="present-container">
		<h2 class="present-title">🎁 Available Presents</h2>
		<div class="present-list">
			{#each presents as present}
				<label class="present-item">
					<input
						type="checkbox"
						checked={selectedPresents.some((p) => p.name === present.name)}
						onchange={() => togglePresent(present)}
					/>
					<span class="present-name">{present.name}</span>
					<span class="present-weight">({present.weight} kg)</span>
				</label>
			{/each}
		</div>
	</div>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		background-color: #f0f0f0;
		color: #333;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	h1,
	h2 {
		color: var(--xmas-red);
		text-align: center;
	}

	.sleigh-info {
		margin-bottom: 30px;
		background-color: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.weight {
		font-weight: bold;
		color: var(--xmas-green);
	}

	.progress-container {
		position: relative;
		margin-top: 10px;
	}

	progress {
		width: 100%;
		height: 25px;
		-webkit-appearance: none;
		appearance: none;
	}

	progress::-webkit-progress-bar {
		background-color: #e0e0e0;
		border-radius: 12px;
	}

	progress::-webkit-progress-value {
		background-color: var(--xmas-green);
		border-radius: 12px;
		transition: width 0.5s ease;
	}

	progress.overloaded::-webkit-progress-value {
		background-color: var(--xmas-red);
	}

	.progress-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-weight: bold;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	.warning {
		color: var(--xmas-red);
		font-weight: bold;
		text-align: center;
		margin-top: 10px;
	}

	.present-container {
		background-color: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.present-title {
		margin-top: 0;
		margin-bottom: 20px;
	}

	.present-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 15px;
	}

	.present-item {
		display: flex;
		align-items: center;
		padding: 10px;
		background-color: #f9f9f9;
		border-radius: 5px;
		transition: background-color 0.3s ease;
	}

	.present-item:hover {
		background-color: #e9e9e9;
	}

	.present-name {
		margin-left: 10px;
		flex-grow: 1;
	}

	.present-weight {
		font-size: 0.9em;
		color: #666;
	}

	input[type='checkbox'] {
		accent-color: var(--xmas-green);
	}
</style>
