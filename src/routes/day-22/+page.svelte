<script lang="ts">
	import Snowflake from './Snowflake.svelte';

	let snowflake = new Snowflake();
</script>

<main>
	<h1>❄️ Magical Snowflake Generator ❄️</h1>
	<div class="input-container">
		<input type="text" bind:value={snowflake.name} placeholder="Enter a name" />
	</div>
	<div class="snowflake-container">
		<div class="svg-wrapper" class:has-snowflake={snowflake.name}>
			{#if !snowflake.name}
				<p>Enter a name to generate a unique snowflake!</p>
			{:else}
				<svg bind:this={snowflake.svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<rect width="100" height="100" fill={snowflake.snowflake_bg_color} />
					<g
						stroke={snowflake.snowflake_color}
						stroke-width={snowflake.stroke_width}
						stroke-linecap="round"
						fill="none"
					>
						{#each snowflake.spokes() as angle}
							<g transform="rotate({angle} 50 50)">
								<path d={snowflake.branch} />
								<path d={snowflake.branch} transform="scale(-1 1) translate(-100 0)" />
							</g>
						{/each}
					</g>
				</svg>
			{/if}
		</div>
	</div>
	<div class="button-container">
		<button on:click={() => snowflake.download()} disabled={!snowflake.name}>
			Download Snowflake
		</button>
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
		text-align: center;
	}
	h1 {
		color: var(--xmas-red);
		margin-bottom: 30px;
	}
	.input-container {
		margin-bottom: 20px;
	}
	input {
		padding: 10px;
		font-size: 16px;
		border: 2px solid var(--xmas-green);
		border-radius: 5px;
		width: 200px;
	}
	.snowflake-container {
		width: 440px;
		height: 440px;
		background-color: #1c1c1c;
		border-radius: 10px;
		margin: 0 auto 20px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.svg-wrapper {
		width: 400px;
		height: 400px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #1c1c1c;
		color: white;
		overflow: hidden;
	}
	.svg-wrapper.has-snowflake {
		background-color: var(--snowflake-bg, #1c1c1c);
	}
	.svg-wrapper :global(svg) {
		max-height: 100%;
		max-width: 100%;
		height: auto;
		width: auto;
	}
	.button-container {
		margin-bottom: 40px;
	}
	button {
		background-color: var(--xmas-green);
		color: white;
		border: none;
		padding: 10px 20px;
		font-size: 16px;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	button:hover {
		background-color: #006400;
	}
	button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
</style>
