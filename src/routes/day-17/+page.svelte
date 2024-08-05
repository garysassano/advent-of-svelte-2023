<script lang="ts">
	import { onMount } from 'svelte';

	let budget = 0;
	let items: Array<{ name: string; cost: number }> = [];
	let newItemName = '';
	let newItemCost = '';
	let totalSpent = 0;
	let remaining = 0;

	function setBudget() {
		remaining = budget;
		localStorage.setItem('elfBudget', budget.toString());
		localStorage.setItem('elfItems', JSON.stringify(items));
		updateTotals(); // Add this line to update totals when budget is set
	}

	function addItem() {
		if (newItemName && newItemCost) {
			const cost = parseFloat(newItemCost);
			items = [...items, { name: newItemName, cost }];
			newItemName = '';
			newItemCost = '';
			updateTotals();
			localStorage.setItem('elfItems', JSON.stringify(items));
		}
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
		updateTotals();
		localStorage.setItem('elfItems', JSON.stringify(items));
	}

	function updateTotals() {
		totalSpent = items.reduce((sum, item) => sum + item.cost, 0);
		remaining = budget - totalSpent;
	}

	onMount(() => {
		const storedBudget = localStorage.getItem('elfBudget');
		const storedItems = localStorage.getItem('elfItems');

		if (storedBudget) {
			budget = parseFloat(storedBudget);
		}

		if (storedItems) {
			items = JSON.parse(storedItems);
			updateTotals();
		}
	});
</script>

<div class="container">
	<h1>🧝 Elf Christmas Shopping Tracker 🎄</h1>

	<div class="form-section">
		<label for="budget">Set Your Budget:</label>
		<div class="input-group">
			<input type="number" id="budget" bind:value={budget} min="0" step="0.01" />
			<button on:click={setBudget}>Set Budget</button>
		</div>
	</div>

	<div class="form-section">
		<label for="gift-name">Add Gift:</label>
		<div class="input-group">
			<input type="text" id="gift-name" placeholder="Gift name" bind:value={newItemName} />
			<input type="number" placeholder="Cost" bind:value={newItemCost} min="0" step="0.01" />
			<button on:click={addItem}>Add Gift</button>
		</div>
	</div>

	<div class="items-list">
		<h2>🎁 Gift List:</h2>
		{#each items as item, index}
			<div class="item">
				<span>🎀 {item.name} - ${item.cost.toFixed(2)}</span>
				<button on:click={() => removeItem(index)}>❌</button>
			</div>
		{/each}
	</div>

	<div class="summary">
		<p>💰 Total Budget: ${budget.toFixed(2)}</p>
		<p>💸 Total Spent: ${totalSpent.toFixed(2)}</p>
		<p class:over-budget={remaining < 0}>
			{remaining >= 0 ? '🎉' : '⚠️'} Remaining: ${remaining.toFixed(2)}
		</p>
	</div>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	h1 {
		color: var(--xmas-red);
		text-align: center;
		font-size: 2rem;
		margin-bottom: 1.5rem;
	}

	.form-section {
		margin-bottom: 20px;
	}

	.input-group {
		display: flex;
		gap: 5px;
		margin-top: 5px;
	}

	input,
	button {
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	button {
		background-color: var(--xmas-green);
		color: white;
		border: none;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		opacity: 0.9;
	}

	.items-list {
		margin-top: 20px;
	}

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		padding: 10px;
		background-color: #f8f9fa;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.item button {
		background-color: transparent;
		color: inherit;
		border: none;
		font-size: 1.2rem;
		padding: 0;
		cursor: pointer;
	}

	.item button:hover {
		opacity: 0.7;
	}

	.summary {
		margin-top: 20px;
		font-weight: bold;
		padding: 15px;
		background-color: #ecf0f1;
		border-radius: 4px;
	}

	.over-budget {
		color: var(--xmas-red);
	}
</style>
