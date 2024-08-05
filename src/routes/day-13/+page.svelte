<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchTerm = '';
	let weightFilter = 0;
	let sortBy: 'name' | 'weight' = 'name';
	let sortOrder: 'asc' | 'desc' = 'asc';
	let currentPage = 1;
	const deliveriesPerPage = 10;

	$: filteredPresents = data.presents
		.filter(
			(present) =>
				present.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
				present.weight >= weightFilter
		)
		.sort((a, b) => {
			const order = sortOrder === 'asc' ? 1 : -1;
			return sortBy === 'name'
				? order * a.name.localeCompare(b.name)
				: order * (a.weight - b.weight);
		});

	$: deliveries = groupDeliveries(filteredPresents);
	$: totalPages = Math.ceil(deliveries.length / deliveriesPerPage);
	$: paginatedDeliveries = deliveries.slice(
		(currentPage - 1) * deliveriesPerPage,
		currentPage * deliveriesPerPage
	);

	function groupDeliveries(presents: typeof data.presents, maxPerDelivery: number = 100) {
		const deliveries = [];
		for (let i = 0; i < presents.length; i += maxPerDelivery) {
			deliveries.push(presents.slice(i, i + maxPerDelivery));
		}
		return deliveries;
	}

	function changePage(delta: number) {
		currentPage = Math.max(1, Math.min(totalPages, currentPage + delta));
	}
</script>

<div class="container">
	<h1>🎅 Santa's Automated Delivery Planner 🎁</h1>

	<div class="stats">
		<div class="stat-item">
			<h3>👧👦 Total Children</h3>
			<p>{data.stats.totalChildren}</p>
		</div>
		<div class="stat-item">
			<h3>⚖️ Average Weight</h3>
			<p>{data.stats.averageWeight.toFixed(2)} units</p>
		</div>
		<div class="stat-item">
			<h3>🛷 Deliveries</h3>
			<p>{data.stats.numberOfDeliveries}</p>
		</div>
	</div>

	<div class="filters">
		<div class="filter-item">
			<label for="name-search">🔍 Search by child name:</label>
			<input
				id="name-search"
				type="text"
				bind:value={searchTerm}
				placeholder="Enter child's name"
			/>
		</div>
		<div class="filter-item">
			<label for="weight-filter">⚖️ Filter by present weight:</label>
			<input
				id="weight-filter"
				type="number"
				bind:value={weightFilter}
				min="0"
				step="0.1"
				placeholder="Min weight"
			/>
		</div>
		<div class="filter-item">
			<label for="sort-by">Sort by:</label>
			<select id="sort-by" bind:value={sortBy}>
				<option value="name">Child's Name</option>
				<option value="weight">Present Weight</option>
			</select>
		</div>
		<div class="filter-item">
			<label for="sort-order">Order:</label>
			<select id="sort-order" bind:value={sortOrder}>
				<option value="asc">Ascending</option>
				<option value="desc">Descending</option>
			</select>
		</div>
	</div>

	<h2>🎁 Delivery Groups</h2>
	{#each paginatedDeliveries as delivery, index}
		<details>
			<summary
				>Delivery {(currentPage - 1) * deliveriesPerPage + index + 1} ({delivery.length} presents)</summary
			>
			<ul>
				{#each delivery as present}
					<li transition:fade={{ duration: 200 }}>
						<span class="present-name">{present.name}</span>
						<span class="present-weight">{present.weight.toFixed(2)} units</span>
					</li>
				{/each}
			</ul>
		</details>
	{/each}

	<div class="pagination">
		<button on:click={() => changePage(-1)} disabled={currentPage === 1}>Previous</button>
		<span>Page {currentPage} of {totalPages}</span>
		<button on:click={() => changePage(1)} disabled={currentPage === totalPages}>Next</button>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}

	h1,
	h2 {
		color: var(--xmas-red);
		text-align: center;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15px;
		margin-bottom: 20px;
	}

	.stat-item {
		background-color: #ffffff;
		padding: 10px;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.stat-item h3 {
		margin: 0;
		color: #4b5563;
	}

	.stat-item p {
		margin: 5px 0 0;
		font-size: 1.2em;
		font-weight: bold;
		color: var(--xmas-red);
	}

	.filters {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
		margin-bottom: 20px;
	}

	.filter-item {
		display: flex;
		flex-direction: column;
	}

	.filter-item label {
		margin-bottom: 5px;
		font-weight: bold;
		color: #4b5563;
	}

	input,
	select {
		padding: 8px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		background-color: #ffffff;
		width: 100%;
		box-sizing: border-box;
	}

	details {
		margin-bottom: 10px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		overflow: hidden;
		background-color: #ffffff;
	}

	summary {
		padding: 10px;
		background-color: #f9fafb;
		cursor: pointer;
		font-weight: bold;
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
		max-height: 200px;
		overflow-y: auto;
	}

	li {
		padding: 8px 10px;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		justify-content: space-between;
	}

	.present-name {
		font-weight: bold;
	}

	.present-weight {
		color: #6b7280;
	}

	.pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
	}

	button {
		padding: 8px 16px;
		background-color: var(--xmas-red);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		background-color: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
	}
</style>
