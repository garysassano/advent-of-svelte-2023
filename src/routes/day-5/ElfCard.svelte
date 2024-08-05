<script lang="ts">
	import { format, parseISO } from 'date-fns';

	export let elf: string;
	export let productivity: { toys: number; presents: number };
	export let isSelected: boolean;
	export let onSelect: (elf: string) => void;
	export let filteredTasks: Array<{ task: string; minutesTaken: number; date: string }>;

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onSelect(elf);
		}
	}

	function formatDate(dateString: string): string {
		return format(parseISO(dateString), 'MMM d, yyyy HH:mm:ss');
	}
</script>

<div class="elf-card-container">
	<button
		class="elf-card"
		class:selected={isSelected}
		on:click={() => onSelect(elf)}
		on:keydown={handleKeydown}
	>
		<h2 class="elf-name">{elf}</h2>
		<p>🧸 Toys Created: {productivity.toys}</p>
		<p>🎁 Presents Wrapped: {productivity.presents}</p>
	</button>
	{#if isSelected}
		<div class="elf-tasks">
			<h3 class="tasks-header">Tasks for {elf}</h3>
			<div class="task-list">
				<table>
					<thead>
						<tr>
							<th>Task</th>
							<th>Minutes Taken</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredTasks as task}
							<tr>
								<td class="task-name">{task.task === 'CREATED_TOY' ? '🧸' : '🎁'} {task.task}</td>
								<td>{task.minutesTaken}</td>
								<td>{formatDate(task.date)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<style>
	.elf-card-container {
		width: calc(50% - 10px);
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
	}

	.elf-card {
		background-color: white;
		border-radius: 8px;
		padding: 15px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: background-color 0.3s ease;
		height: auto;
		display: flex;
		flex-direction: column;
	}

	.elf-card h2 {
		margin-top: 0;
		margin-bottom: 10px;
	}

	.elf-card p {
		margin: 5px 0;
	}

	.elf-card:hover {
		background-color: #e0e0e0;
	}

	.elf-card.selected {
		background-color: #d0d0d0;
	}

	.elf-tasks {
		margin-top: 10px;
		background-color: #ffffff;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.task-list {
		max-height: 300px;
		overflow-y: auto;
		margin-top: 10px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f2f2f2;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.elf-name {
		color: var(--xmas-red);
	}

	.tasks-header {
		color: var(--xmas-red);
	}
</style>
