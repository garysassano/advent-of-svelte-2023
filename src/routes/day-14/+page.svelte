<script lang="ts">
	import Snowfall from '$lib/components/Snowfall.svelte';

	let snowflakeCount = $state(100);
	let snowflakeSpeed = $state(1);
</script>

<div class="container">
	<div class="card">
		<h1>Snowfall Simulator</h1>

		<div class="controls">
			<label>
				Snowflakes: {snowflakeCount}
				<input type="range" bind:value={snowflakeCount} min="10" max="500" step="10" />
			</label>
			<label>
				Speed: {snowflakeSpeed.toFixed(1)}
				<input type="range" bind:value={snowflakeSpeed} min="0.1" max="2" step="0.1" />
			</label>
		</div>
	</div>
</div>

<Snowfall {snowflakeCount} {snowflakeSpeed} />

<style>
	.container {
		display: flex;
		justify-content: center;
		padding-top: 2rem;
	}

	.card {
		background-color: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(5px);
		border-radius: 10px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		max-width: 400px;
		width: 100%;
	}

	h1 {
		color: var(--xmas-red);
		text-align: center;
		margin-top: 0;
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--xmas-green);
		font-weight: bold;
		width: 100%;
	}

	input[type='range'] {
		width: 100%;
		margin-top: 0.5rem;
	}
</style>
