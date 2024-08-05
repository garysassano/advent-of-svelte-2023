<script lang="ts">
	import { onMount } from 'svelte';
	import ChildrenState from './ChildrenState.svelte';

	const childrenState = new ChildrenState();

	onMount(() => {
		childrenState.fetchChildren();
	});
</script>

<main>
	<h1>🎅 Santa's Naughty or Nice List</h1>

	<form
		onsubmit={(event) => {
			event.preventDefault();
			childrenState.addChild();
		}}
	>
		<input bind:value={childrenState.newName} placeholder="Child's name" required />
		<input
			type="number"
			bind:value={childrenState.newTally}
			placeholder="Tally"
			min="-100"
			max="100"
			required
		/>
		<button type="submit">Add Child</button>
	</form>

	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Tally</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each childrenState.children as child}
					<tr class={childrenState.getStatus(child.tally).toLowerCase()}>
						<td>{child.name}</td>
						<td>{child.tally}</td>
						<td>{childrenState.getStatus(child.tally)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
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

	h1 {
		text-align: center;
		color: var(--xmas-red);
		margin-bottom: 30px;
	}

	form {
		display: flex;
		gap: 10px;
		margin-bottom: 30px;
	}

	input,
	button {
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
		font-size: 16px;
	}

	button {
		background-color: #4caf50;
		color: white;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #45a049;
	}

	.table-container {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0 8px;
	}

	th,
	td {
		padding: 12px;
		text-align: left;
	}

	th {
		background-color: var(--xmas-red);
		color: white;
		font-weight: bold;
		text-transform: uppercase;
	}

	tr.nice td {
		background-color: rgba(76, 175, 80, 0.1);
	}

	tr.naughty td {
		background-color: rgba(244, 67, 54, 0.1);
	}

	tr td:first-child {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	tr td:last-child {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
</style>
