<script lang="ts">
	import { onMount } from 'svelte';

	// Types
	type HeartRateEntry = { time: Date; rate: number };

	// Constants
	const MAX_HEART_RATE = 200; // Maximum heart rate to display
	const MIN_HEART_RATE = 40; // Minimum heart rate to display
	const Y_AXIS_STEPS = 4; // Number of steps on Y-axis
	const HISTORY_SIZE = 60; // Number of entries to keep in history
	const UPDATE_INTERVAL = 1000; // Update interval in milliseconds

	// State values
	let heartRateHistory = $state<HeartRateEntry[]>([]);
	let heartRate = $state(0);

	// Derived values
	let averageHeartRate = $derived.by(() => {
		const oneMinuteAgo = new Date(Date.now() - 60000);
		const lastMinuteEntries = heartRateHistory.filter((entry) => entry.time >= oneMinuteAgo);
		if (lastMinuteEntries.length === 0) return 0;
		const sum = lastMinuteEntries.reduce((acc, curr) => acc + curr.rate, 0);
		return Math.round(sum / lastMinuteEntries.length);
	});

	// Helper functions
	function getYPosition(rate: number) {
		return 260 - ((rate - MIN_HEART_RATE) / (MAX_HEART_RATE - MIN_HEART_RATE)) * 260;
	}

	// Data fetching and processing
	async function fetchHeartRate() {
		console.log('Fetching heart rate at:', new Date().toISOString());
		const response = await fetch('https://advent.sveltesociety.dev/data/2023/day-four.json');
		const data = await response.json();
		heartRate = data.heartRate;
		updateHistory(data.heartRate);
	}

	function updateHistory(rate: number) {
		const newEntry = { time: new Date(), rate };
		heartRateHistory = [...heartRateHistory, newEntry].slice(-HISTORY_SIZE);
		console.log('Updated history:', heartRateHistory);
	}

	onMount(() => {
		fetchHeartRate();
		const interval = setInterval(fetchHeartRate, UPDATE_INTERVAL);
		return () => clearInterval(interval);
	});
</script>

<main>
	<h1>🎅 Santa's Heart Rate Monitor (SHRM™)</h1>

	<div class="container">
		<div class="heart-rate-container">
			<div class="heart-rate current">
				<h2>Current Heart Rate ❤️</h2>
				<p>{heartRate} BPM</p>
			</div>
			<div class="heart-rate average">
				<h2>Average Heart Rate (Last Minute) ❤️</h2>
				<p>{averageHeartRate} BPM</p>
			</div>
		</div>

		<div class="history-chart">
			<h2>Heart Rate History 📈</h2>
			<svg width="100%" height="300" viewBox="0 0 600 300">
				<rect x="0" y="0" width="600" height="300" fill="#ffffff" />

				{#each Array(Y_AXIS_STEPS + 1) as _, i}
					{@const y = i * (260 / Y_AXIS_STEPS)}
					{@const label = MAX_HEART_RATE - i * ((MAX_HEART_RATE - MIN_HEART_RATE) / Y_AXIS_STEPS)}
					<line x1="50" y1={y + 20} x2="580" y2={y + 20} stroke="#e0e0e0" stroke-width="1" />
					<text x="45" y={y + 25} text-anchor="end" font-size="12" fill="#333333">{label}</text>
				{/each}

				<line x1="50" y1="280" x2="580" y2="280" stroke="#a0a0a0" stroke-width="1" />

				<text x="50" y="295" text-anchor="start" font-size="12" fill="#333333">60s ago</text>
				<text x="315" y="295" text-anchor="middle" font-size="12" fill="#333333">30s ago</text>
				<text x="580" y="295" text-anchor="end" font-size="12" fill="#333333">Now</text>

				{#each heartRateHistory as { rate }, i}
					<rect
						x={50 + i * (530 / HISTORY_SIZE)}
						y={getYPosition(rate) + 20}
						width={530 / HISTORY_SIZE}
						height={260 - getYPosition(rate)}
						fill="var(--xmas-red)"
						rx="2"
						ry="2"
					/>
				{/each}
			</svg>
		</div>
	</div>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		text-align: center;
	}

	h1 {
		color: var(--xmas-red);
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.heart-rate-container {
		display: flex;
		gap: 20px;
	}

	.heart-rate,
	.history-chart {
		background-color: #f0f0f0;
		border-radius: 8px;
		padding: 15px;
		flex: 1;
	}

	.heart-rate h2,
	.history-chart h2 {
		font-size: 1em;
		margin-bottom: 10px;
		color: #333333;
	}

	.heart-rate p {
		font-size: 2em;
		font-weight: bold;
		color: var(--xmas-red);
	}

	svg {
		background-color: white;
		border: none;
	}

	svg text {
		fill: #333333;
	}

	svg line {
		stroke: #e0e0e0;
	}

	.history-chart {
		background-color: #f0f0f0;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.history-chart h2 {
		margin-bottom: 15px;
		font-size: 1.2em;
		color: #333333;
	}
</style>
