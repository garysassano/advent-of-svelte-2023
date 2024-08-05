<script lang="ts">
	import { onMount } from 'svelte';

	// Snowflake interface
	interface Snowflake {
		character: string;
		x: number;
		y: number;
		size: number;
		speed: number;
		amplitude: number;
		step: number;
	}

	// State variables
	let taps = $state<number[]>([]);
	let isActive = $state(false);
	let snowflakes = $state<Snowflake[]>([]);
	let frame: number;
	let resetTimer: NodeJS.Timeout;
	let bpm = $state(0);
	let youtubeVideoId = 'dQw4w9WgXcQ';
	let lastTapTime = 0;
	let pulseDuration = $derived(bpm > 0 ? 60 / bpm : 0);

	// Constants
	const characters = ['❄', '❆', '❅'];
	const MAX_SNOWFLAKE_SIZE = 1.5;
	const MIN_SNOWFLAKE_SPEED = 0.2;
	const MAX_SNOWFLAKE_SPEED = 0.5;
	const RESET_DELAY = 5000;
	const SNOWFLAKE_COUNT = 100;

	// Function to generate snowflakes
	function generateSnowflakes(): Snowflake[] {
		return Array.from({ length: SNOWFLAKE_COUNT }, () => ({
			character: characters[Math.floor(Math.random() * characters.length)],
			x: Math.random() * 100,
			y: -10 - Math.random() * 100,
			size: Math.min(0.5 + Math.random() * 2, MAX_SNOWFLAKE_SIZE),
			speed: MIN_SNOWFLAKE_SPEED + Math.random() * (MAX_SNOWFLAKE_SPEED - MIN_SNOWFLAKE_SPEED),
			amplitude: 0.5 + Math.random() * 1.5,
			step: Math.random() * Math.PI * 2
		})).sort((a, b) => a.size - b.size);
	}

	// Function to update snowflake positions
	function updateSnowflakes() {
		snowflakes = snowflakes.map((flake) => {
			flake.y += flake.speed;
			flake.step += 0.01;

			if (flake.y > 100) {
				flake.y = -10;
				flake.x = Math.random() * 100;
			}

			return flake;
		});
		frame = requestAnimationFrame(updateSnowflakes);
	}

	// Function to handle tap event
	function tap() {
		const now = Date.now();
		taps = [...taps.slice(-3), now];
		calculateBPM();
		isActive = true;
		if (snowflakes.length === 0) {
			snowflakes = generateSnowflakes();
			frame = requestAnimationFrame(updateSnowflakes);
		}
		lastTapTime = now;

		clearTimeout(resetTimer);
		resetTimer = setTimeout(reset, RESET_DELAY);
	}

	// Function to calculate BPM
	function calculateBPM() {
		if (taps.length < 2) return;
		const intervals = taps.slice(1).map((t, i) => t - taps[i]);
		const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
		bpm = Math.round(60000 / averageInterval);
	}

	// Function to reset the BPM counter and snowflakes
	function reset() {
		bpm = 0;
		taps = [];
		isActive = false;
		snowflakes = [];
		lastTapTime = 0;
		cancelAnimationFrame(frame);
		clearTimeout(resetTimer);
	}

	// Lifecycle hook to set up and clean up intervals
	onMount(() => {
		const intervalId = setInterval(() => {
			if (Date.now() - lastTapTime > RESET_DELAY) {
				reset();
			}
		}, 1000);

		return () => {
			cancelAnimationFrame(frame);
			clearTimeout(resetTimer);
			clearInterval(intervalId);
		};
	});
</script>

<!-- Main content -->
<main>
	<h1>🎵 Elf BPM Counter 🎵</h1>

	<div class="content-wrapper">
		<div class="bpm-controls">
			<div class="bpm-display">
				<span class="bpm-value" class:active={isActive} style="--pulse-duration: {pulseDuration}s;">
					{bpm}
				</span>
				<span class="bpm-label">BPM</span>
			</div>

			<div class="button-container">
				<button class="tap-button" onclick={tap}>TAP</button>
				<button class="reset-button" onclick={reset}>RESET</button>
			</div>
		</div>

		<div class="song-selection">
			<h2>Christmas Song Selection</h2>
			<div class="video-container">
				<iframe
					src="https://www.youtube.com/embed/{youtubeVideoId}"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			</div>
		</div>
	</div>

	{#if isActive}
		<div class="snowflakes">
			{#each snowflakes as flake (flake)}
				{@const x = flake.x + Math.sin(flake.step) * flake.amplitude}
				<span class="snowflake" style="left: {x}%; top: {flake.y}%; font-size: {flake.size}em;">
					{flake.character}
				</span>
			{/each}
		</div>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		padding: 20px;
		background-color: var(--background-color);
		color: white;
		font-family: 'Arial', sans-serif;
	}

	h1,
	h2 {
		color: var(--xmas-red);
		text-align: center;
		margin-bottom: 20px;
	}

	h1 {
		font-size: 2.5em;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.content-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 800px;
		gap: 20px;
	}

	.bpm-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: white;
		border-radius: 15px;
		padding: 20px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.bpm-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 15px;
	}

	.bpm-value {
		font-size: 72px;
		color: #000;
		font-weight: bold;
		line-height: 1;
	}

	.bpm-value.active {
		animation: pulse var(--pulse-duration) ease-in-out infinite;
	}

	.bpm-label {
		font-size: 24px;
		color: #000;
	}

	.button-container {
		display: flex;
		gap: 15px;
		width: 100%;
		justify-content: center;
	}

	.tap-button,
	.reset-button {
		font-size: 18px;
		padding: 10px 25px;
		border: none;
		outline: none;
		border-radius: 25px;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: white;
	}

	.tap-button {
		background-color: var(--xmas-green);
	}

	.reset-button {
		background-color: var(--xmas-red);
	}

	.tap-button:hover,
	.reset-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.song-selection {
		background-color: white;
		border-radius: 15px;
		padding: 20px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.video-container {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}

	.snowflakes {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 100;
		overflow: hidden;
	}

	.snowflake {
		position: absolute;
		color: white;
		text-shadow:
			0 0 5px #c0e0ff,
			0 0 10px #c0e0ff,
			0 0 15px #c0e0ff;
		user-select: none;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	@media (max-width: 600px) {
		.bpm-controls {
			padding: 15px;
		}

		.bpm-value {
			font-size: 60px;
		}

		.bpm-label {
			font-size: 20px;
		}

		.button-container {
			flex-direction: column;
			align-items: stretch;
		}

		.tap-button,
		.reset-button {
			width: 100%;
		}
	}
</style>
