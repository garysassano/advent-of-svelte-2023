<script lang="ts">
	import Snowfall from '$lib/components/Snowfall.svelte';

	let snowfallOptions = {
		snowflakeCount: 50,
		snowflakeSpeed: 1
	};

	let globeColor = '#1996c8';

	function updateSnowfall(option: string, value: number) {
		snowfallOptions = { ...snowfallOptions, [option]: value };
	}
</script>

<div class="container">
	<h1>🎄 Magical Snow Globe Creator ❄️</h1>

	<div class="snow-globe-wrapper">
		<div class="snow-globe" style="background-color: {globeColor};">
			<div class="snowfall-container">
				<Snowfall {...snowfallOptions} />
			</div>
		</div>
		<div class="globe-base"></div>
	</div>

	<div class="controls">
		<h2>✨ Customize Your Snow Globe ✨</h2>

		<div class="control-group">
			<label>
				❄️ Snowflake Count:
				<input
					type="range"
					min="1"
					max="200"
					bind:value={snowfallOptions.snowflakeCount}
					on:input={() => updateSnowfall('snowflakeCount', snowfallOptions.snowflakeCount)}
				/>
			</label>
		</div>

		<div class="control-group">
			<label>
				💨 Snowflake Speed:
				<input
					type="range"
					min="0.1"
					max="5"
					step="0.1"
					bind:value={snowfallOptions.snowflakeSpeed}
					on:input={() => updateSnowfall('snowflakeSpeed', snowfallOptions.snowflakeSpeed)}
				/>
			</label>
		</div>

		<div class="control-group">
			<label>
				🎨 Globe Color:
				<input type="color" bind:value={globeColor} />
			</label>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1,
	h2 {
		text-align: center;
		color: var(--xmas-red);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
	}

	.snow-globe-wrapper {
		position: relative;
		margin-bottom: 40px;
	}

	.snow-globe {
		width: 300px;
		height: 300px;
		border-radius: 50%;
		position: relative;
		overflow: hidden;
		box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
		border: 5px solid white;
	}

	.globe-base {
		width: 120px;
		height: 40px;
		background-color: var(--xmas-red);
		margin: -20px auto 0;
		border-radius: 50% / 100% 100% 0 0;
	}

	.snowfall-container {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 300px;
		height: 300px;
		transform: translate(-50%, -50%);
		overflow: hidden;
		border-radius: 50%;
		mask-image: radial-gradient(circle 150px at center, white 100%, transparent 100%);
		-webkit-mask-image: radial-gradient(circle 150px at center, white 100%, transparent 100%);
	}

	.controls {
		background-color: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 20px;
		border-radius: 10px;
		backdrop-filter: blur(5px);
		width: 100%;
		max-width: 400px;
	}

	.control-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}

	input[type='range'] {
		width: 100%;
		appearance: none;
		-webkit-appearance: none;
		background: var(--xmas-red);
		outline: none;
		opacity: 0.7;
		transition: opacity 0.2s;
		border-radius: 5px;
	}

	input[type='range']:hover {
		opacity: 1;
	}

	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		-webkit-appearance: none;
		width: 25px;
		height: 25px;
		background: white;
		cursor: pointer;
		border-radius: 50%;
	}

	input[type='range']::-moz-range-thumb {
		width: 25px;
		height: 25px;
		background: white;
		cursor: pointer;
		border-radius: 50%;
	}

	input[type='color'] {
		width: 100%;
		height: 40px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
