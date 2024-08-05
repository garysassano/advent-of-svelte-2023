<script lang="ts">
	// Props without default values
	const { snowflakeCount, snowflakeSpeed } = $props<{
		snowflakeCount: number;
		snowflakeSpeed: number;
	}>();

	// Array of snowflake characters
	const characters = ['❄', '❅', '❆', '✻', '✼', '❉', '❋'];

	// Snowflake interface definition
	interface Snowflake {
		x: number; // Horizontal position (%)
		y: number; // Vertical position (%)
		character: string; // Snowflake character
		size: number; // Size of the snowflake
		wobble: number; // Factor for horizontal movement
	}

	// State variables
	let snowflakes = $state<Snowflake[]>([]);
	let lastTimestamp = $state(0);

	// Function to create a single snowflake
	function createSnowflake(): Snowflake {
		const isLarge = Math.random() < 0.1; // 10% chance of a large snowflake
		return {
			x: Math.random() * 100,
			y: Math.random() * 100,
			character: characters[Math.floor(Math.random() * characters.length)],
			size: isLarge ? Math.random() * 0.5 + 1 : Math.random() * 0.5 + 0.5, // Large: 1-1.5, Small: 0.5-1
			wobble: Math.random() * 0.5
		};
	}

	// Function to update snowflake positions
	function updateSnowflakes(timestamp: number) {
		const deltaTime = timestamp - lastTimestamp;
		lastTimestamp = timestamp;

		snowflakes = snowflakes.map((flake) => ({
			...flake,
			// Update vertical position with slight size-based speed adjustment
			y: (flake.y + snowflakeSpeed * 0.01 * deltaTime * (1 - (flake.size - 0.5) * 0.1)) % 100,
			// Update horizontal position with sinusoidal movement
			x: (flake.x + Math.sin(timestamp * 0.0002 + flake.wobble) * 0.03 + 100) % 100
		}));

		// Continue the animation loop
		requestAnimationFrame(updateSnowflakes);
	}

	// Effect to create initial snowflakes or update when count changes
	$effect(() => {
		snowflakes = Array(snowflakeCount).fill(null).map(createSnowflake);
	});

	// Effect to start the animation loop
	$effect(() => {
		if (snowflakes.length > 0 && !lastTimestamp) {
			requestAnimationFrame(updateSnowflakes);
		}
	});
</script>

<!-- Snowfall container -->
<div class="snowfall">
	<!-- Render each snowflake -->
	{#each snowflakes as flake}
		<div class="snowflake" style="left: {flake.x}%; top: {flake.y}%; font-size: {flake.size}em;">
			{flake.character}
		</div>
	{/each}
</div>

<style>
	/* Snowfall container styles */
	.snowfall {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1000;
		overflow: hidden;
	}

	/* Individual snowflake styles */
	.snowflake {
		position: absolute;
		color: white;
		text-shadow:
			0 0 5px #c0e0ff,
			0 0 10px #c0e0ff;
		user-select: none;
	}
</style>
