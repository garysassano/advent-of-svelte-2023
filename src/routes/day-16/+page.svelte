<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let grid: number[][];
	let botX = 0;
	let botY = 0;
	let message = '';
	let searchName = '';
	let searchResults: { x: number; y: number; count: number }[] = [];
	let path: [number, number][] = [];
	let uniqueNames: string[] = [];
	let previewGifts: { x: number; y: number }[] = [];
	let matchedLocations: { x: number; y: number }[] = [];
	let selectedGifts: { x: number; y: number; count: number }[] = [];

	$: presents = data.presents || [];
	$: error = data.error;
	$: filteredNames = uniqueNames.filter((name) =>
		name.toLowerCase().startsWith(searchName.toLowerCase())
	);

	onMount(() => {
		console.log('Component mounted');
		console.log('Presents:', presents);

		// Initialize grid with the correct size (20x20)
		grid = Array(20)
			.fill(null)
			.map(() => Array(20).fill(0));

		// Populate the grid
		presents.forEach((present) => {
			if (present.x >= 1 && present.x <= 20 && present.y >= 1 && present.y <= 20) {
				grid[present.y - 1][present.x - 1]++;
			}
		});

		console.log('Grid populated:', grid);

		// Extract unique names from presents
		uniqueNames = [...new Set(presents.map((present) => present.name))];

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				moveBot('U');
				break;
			case 'ArrowDown':
				moveBot('D');
				break;
			case 'ArrowLeft':
				moveBot('L');
				break;
			case 'ArrowRight':
				moveBot('R');
				break;
		}
	}

	function moveBot(command: string) {
		let newX = botX;
		let newY = botY;

		switch (command) {
			case 'U':
				newY = Math.max(0, newY - 1);
				break;
			case 'D':
				newY = Math.min(19, newY + 1);
				break;
			case 'L':
				newX = Math.max(0, newX - 1);
				break;
			case 'R':
				newX = Math.min(19, newX + 1);
				break;
			default:
				message = `Invalid command: ${command}`;
				return;
		}

		botX = newX;
		botY = newY;
		checkForPresents();
	}

	function checkForPresents() {
		const presentsCount = grid[botY][botX];
		const giftsForKid = presents.filter(
			(p) => p.x === botX + 1 && p.y === botY + 1 && p.name === searchName
		);
		const kidGiftsCount = giftsForKid.length;

		if (presentsCount > 0 && kidGiftsCount > 0) {
			const collectedCount = Math.min(presentsCount, kidGiftsCount, 1); // Collect 1 gift at a time
			message = `Found and collected ${collectedCount} present for ${searchName} at this location. ${kidGiftsCount - collectedCount} remaining for ${searchName}.`;
			grid[botY][botX] -= collectedCount; // Decrement the count by the collected amount
		} else if (presentsCount > 0) {
			message = `There are presents at this location, but none for ${searchName}.`;
		} else {
			message = 'No presents at this location';
		}
	}

	function searchForKid(event: Event) {
		event.preventDefault();
		searchResults = [];
		matchedLocations = [];
		selectedGifts = []; // Clear selected gifts
		const exactName = searchName.trim();
		let totalGiftsFound = 0;
		let remainingGifts = 0;

		presents.forEach((present) => {
			if (
				present.name === exactName &&
				present.x >= 1 &&
				present.x <= 20 &&
				present.y >= 1 &&
				present.y <= 20
			) {
				totalGiftsFound++;
				const currentCount = grid[present.y - 1][present.x - 1];
				if (currentCount > 0) {
					remainingGifts++;
					searchResults.push({ x: present.x, y: present.y, count: 1 });
				}
			}
		});

		if (totalGiftsFound === 0) {
			message = `No gifts found for ${exactName}`;
		} else if (remainingGifts === 0) {
			message = `All gifts for ${exactName} have been collected already!`;
		} else {
			message = `Found ${remainingGifts} gift${remainingGifts > 1 ? 's' : ''} in ${searchResults.length} location${searchResults.length > 1 ? 's' : ''}`;
		}
	}

	function toggleGiftSelection(gift: { x: number; y: number; count: number }) {
		const index = selectedGifts.findIndex((g) => g.x === gift.x && g.y === gift.y);
		if (index === -1) {
			selectedGifts = [...selectedGifts, gift];
		} else {
			selectedGifts = selectedGifts.filter((_, i) => i !== index);
		}
		updateMatchedLocations();
	}

	function selectAllGifts() {
		if (selectedGifts.length === searchResults.length) {
			// If all gifts are already selected, deselect all
			selectedGifts = [];
		} else {
			// Otherwise, select all gifts
			selectedGifts = [...searchResults];
		}
		updateMatchedLocations();
	}

	function updateMatchedLocations() {
		if (selectedGifts.length === 0) {
			matchedLocations = [];
		} else {
			matchedLocations = selectedGifts.map((gift) => ({ x: gift.x - 1, y: gift.y - 1 }));
		}
	}

	function collectSelectedGifts() {
		let totalGifts = selectedGifts.reduce((sum, gift) => sum + gift.count, 0);
		let collectedGifts = 0;

		function collectNext(index = 0) {
			if (index >= selectedGifts.length) {
				message = `Collected all ${collectedGifts} selected gifts for ${searchName}.`;
				selectedGifts = [];
				updateMatchedLocations();
				return;
			}

			let gift = selectedGifts[index];
			moveToGift(gift.x, gift.y);

			// Only collect gifts for the searched kid
			let giftsAtLocation = presents.filter(
				(p) => p.x === gift.x && p.y === gift.y && p.name === searchName
			);
			let giftCount = giftsAtLocation.length;

			if (giftCount > 0 && grid[gift.y - 1][gift.x - 1] > 0) {
				grid[gift.y - 1][gift.x - 1]--;
				collectedGifts++;
				setTimeout(() => collectNext(index), 1000);
			} else {
				collectNext(index + 1);
			}
		}

		collectNext();
	}

	function moveToGift(x: number, y: number) {
		botX = x - 1;
		botY = y - 1;
		checkForPresents();
		// Remove the location from matchedLocations after moving to it
		matchedLocations = matchedLocations.filter((loc) => loc.x !== botX || loc.y !== botY);
	}
</script>

<main>
	<div class="card">
		<h1>🎅 Santa's Gift Hangar 🎄</h1>
		{#if error}
			<p class="error">❌ {error}</p>
		{:else if !grid}
			<p class="loading">🔄 Loading presents...</p>
		{:else}
			{#if message}
				<p class="message">🎉 {message}</p>
			{/if}
			<div class="search-form">
				<form on:submit={searchForKid}>
					<input bind:value={searchName} placeholder="Enter kid's name" list="kid-names" required />
					<datalist id="kid-names">
						{#each filteredNames as name}
							<option value={name} />
						{/each}
					</datalist>
					<button type="submit">🔍 Search for Gifts</button>
				</form>
			</div>
			{#if searchResults.length > 0}
				<div class="search-results">
					<h3>🎁 Gifts for {searchName}:</h3>
					<div class="action-buttons">
						<button class="collect" on:click={collectSelectedGifts}
							>🚚 Collect Selected Gifts</button
						>
						<button class="select-all" on:click={selectAllGifts}>
							{selectedGifts.length === searchResults.length
								? '❌ Deselect All Gifts'
								: '✅ Select All Gifts'}
						</button>
					</div>
					<ul>
						{#each searchResults as result}
							<li>
								<label class="gift-item">
									<input
										type="checkbox"
										checked={selectedGifts.some((g) => g.x === result.x && g.y === result.y)}
										on:change={() => toggleGiftSelection(result)}
									/>
									<span>📍 Location: ({result.x}, {result.y}) - {result.count} gift(s)</span>
								</label>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			<div class="hangar-container">
				<div class="hangar">
					{#each grid as row, y}
						<div class="row">
							{#each row as cell, x}
								<div
									class="cell"
									class:matched-location={matchedLocations.some(
										(loc) => loc.x === x && loc.y === y
									)}
								>
									{#if x === botX && y === botY}
										🤖
									{:else if cell > 0}
										🎁 {#if cell > 1}<span class="counter">x{cell}</span>{/if}
									{:else if matchedLocations.some((loc) => loc.x === x && loc.y === y)}
										<span class="preview-gift">🎁</span>
									{/if}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	main {
		max-width: 1000px;
		margin: 20px auto;
		font-family: 'Arial', sans-serif;
	}

	.card {
		background-color: #f9f9f9;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	h1 {
		text-align: center;
		color: var(--xmas-red);
		margin-top: 0;
		margin-bottom: 20px;
		font-size: 2.5em;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	.search-form {
		margin-bottom: 20px;
	}

	.search-form form {
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	.search-form input {
		width: 60%;
		max-width: 400px;
		padding: 10px;
		font-size: 1em;
		border: 2px solid var(--xmas-green);
		border-radius: 5px;
	}

	.search-form button,
	.search-results button {
		padding: 10px 20px;
		font-size: 1em;
		background-color: var(--xmas-green);
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.search-form button:hover,
	.search-results button:hover {
		background-color: var(--xmas-red);
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
	}

	.search-results {
		margin-bottom: 20px;
		text-align: center;
	}

	.search-results h3 {
		margin-bottom: 10px;
		color: var(--xmas-green);
	}

	.search-results ul {
		list-style-type: none;
		padding: 0;
		max-width: 600px;
		margin: 0 auto;
	}

	.search-results li {
		background-color: white;
		border-radius: 5px;
		padding: 10px;
		margin-bottom: 10px;
		text-align: left;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.search-results li:hover {
		background-color: #f0f0f0;
	}

	.search-results li.selected {
		background-color: rgba(255, 0, 0, 0.2);
		color: black;
		border: 2px solid red;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 20px;
	}

	.collect,
	.select-all {
		font-size: 1em;
		padding: 10px 20px;
	}

	.preview-gift {
		opacity: 1;
		font-size: 0.8em;
	}

	.hangar-container {
		max-width: 100%;
		margin: 0 auto;
	}

	.hangar {
		display: grid;
		grid-template-columns: repeat(20, 1fr);
		gap: 2px;
		max-width: 100%;
		margin: 0 auto;
	}

	.cell {
		aspect-ratio: 1;
		border: 1px solid #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2em;
		position: relative;
		overflow: hidden;
		background-color: white;
		border-radius: 5px;
		transition: all 0.3s ease;
	}

	.cell:hover {
		transform: scale(1.1);
		z-index: 1;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	}

	.counter {
		position: absolute;
		bottom: 2px;
		right: 2px;
		font-size: 0.7em;
		background-color: rgba(255, 255, 255, 0.7);
		padding: 1px 3px;
		border-radius: 3px;
	}

	.message {
		text-align: center;
		font-weight: bold;
		margin-bottom: 20px;
		color: var(--xmas-green);
		font-size: 1.2em;
	}

	.error {
		color: red;
		font-weight: bold;
	}

	.loading {
		text-align: center;
		color: var(--xmas-green);
		font-size: 1.2em;
	}

	@media (max-width: 600px) {
		.search-form form {
			flex-direction: column;
		}

		.search-form input {
			width: 100%;
		}

		.search-results li {
			flex-direction: column;
			align-items: stretch;
		}

		.search-results button {
			margin-top: 10px;
		}
	}

	.matched-location {
		background-color: rgba(255, 0, 0, 0.2);
		border: 2px solid red;
	}

	.gift-item {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
	}

	.gift-item input[type='checkbox'] {
		width: 20px;
		height: 20px;
	}

	.search-results li {
		background-color: white;
		border-radius: 5px;
		padding: 10px;
		margin-bottom: 10px;
		text-align: left;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
