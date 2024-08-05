<script lang="ts">
	import { format, parseISO } from 'date-fns';
	import ElfDashboard from './ElfDashboard.svelte';
	import ElfCard from './ElfCard.svelte';

	type TaskType = 'CREATED_TOY' | 'WRAPPED_PRESENT';
	type ElfStats = { toys: number; presents: number };
	type ProductivityMap = Record<string, ElfStats>;

	interface Task {
		elf: string;
		task: TaskType;
		minutesTaken: number;
		date: string;
	}

	export let data: { tasks: Task[] };

	let selectedElf: string | undefined = undefined;

	$: [elfProductivity, totalToys, totalPresents] = updateProductivity(data.tasks);

	$: filteredTasks =
		selectedElf !== undefined ? data.tasks.filter((task) => task.elf === selectedElf) : data.tasks;

	$: chartData = processChartData(data.tasks);

	function processChartData(tasks: Task[]) {
		const hourlyData: Record<string, { toys: number; presents: number }> = {};

		tasks.forEach((task) => {
			const hour = format(parseISO(task.date), "yyyy-MM-dd'T'HH:00:00'Z'");
			if (!hourlyData[hour]) {
				hourlyData[hour] = { toys: 0, presents: 0 };
			}
			if (task.task === 'CREATED_TOY') {
				hourlyData[hour].toys++;
			} else if (task.task === 'WRAPPED_PRESENT') {
				hourlyData[hour].presents++;
			}
		});

		return Object.entries(hourlyData).map(([hour, counts]) => ({
			hour,
			toys: counts.toys,
			presents: counts.presents
		}));
	}

	function updateProductivity(tasks: Task[]): [ProductivityMap, number, number] {
		return tasks.reduce(
			([productivity, toys, presents], task) => {
				if (!productivity[task.elf]) {
					productivity[task.elf] = { toys: 0, presents: 0 };
				}

				if (task.task === 'CREATED_TOY') {
					productivity[task.elf].toys++;
					toys++;
				} else if (task.task === 'WRAPPED_PRESENT') {
					productivity[task.elf].presents++;
					presents++;
				}

				return [productivity, toys, presents];
			},
			[{} as ProductivityMap, 0, 0]
		);
	}

	function selectElf(elf: string) {
		selectedElf = selectedElf === elf ? undefined : elf;
	}
</script>

<main>
	<h1 class="dashboard-title">🧝 Elf Productivity Dashboard 📊</h1>

	<div class="global-stats">
		<h2>Overall Productivity</h2>
		<div class="stat-container">
			<div class="stat-box">
				<span class="stat-icon">🧸</span>
				<div class="stat-info">
					<span class="stat-value">{totalToys}</span>
					<span class="stat-label">Toys Created</span>
				</div>
			</div>
			<div class="stat-box">
				<span class="stat-icon">🎁</span>
				<div class="stat-info">
					<span class="stat-value">{totalPresents}</span>
					<span class="stat-label">Presents Wrapped</span>
				</div>
			</div>
		</div>
	</div>

	<div class="chart-container">
		<h2>Hourly Productivity</h2>
		<ElfDashboard data={chartData} />
	</div>

	<div class="dashboard">
		{#each Object.entries(elfProductivity) as [elf, productivity]}
			<ElfCard
				{elf}
				{productivity}
				isSelected={selectedElf === elf}
				onSelect={selectElf}
				filteredTasks={filteredTasks.filter((task) => task.elf === elf)}
			/>
		{/each}
	</div>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	h1,
	h2 {
		color: var(--xmas-red);
		margin-bottom: 15px;
	}

	.global-stats {
		background-color: white;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 20px;
	}

	.stat-container {
		display: flex;
		justify-content: space-around;
		gap: 20px;
	}

	.stat-box {
		display: flex;
		align-items: center;
		background-color: #f0f0f0;
		border-radius: 8px;
		padding: 15px;
		flex: 1;
	}

	.stat-icon {
		font-size: 2.5em;
		margin-right: 15px;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		font-size: 1.8em;
		font-weight: bold;
		color: var(--xmas-red);
	}

	.stat-label {
		font-size: 1em;
		color: #555;
	}

	.chart-container {
		margin-bottom: 30px;
		background-color: white;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dashboard {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin-bottom: 30px;
	}

	.dashboard-title {
		text-align: center;
		font-size: 2.5em;
		margin-bottom: 30px;
		color: var(--xmas-red);
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
