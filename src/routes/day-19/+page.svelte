<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;

	let lightCount = $state(20);
	let lightSize = $state(10);
	let blinkSpeed = $state(500);
	let colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
	let selectedColors = $state(['#ff0000', '#00ff00', '#0000ff']);
	let pattern = $state('sequential');

	type Light = {
		x: number;
		y: number;
		color: string;
		on: boolean;
	};

	let lights = $state<Light[]>([]);

	let currentTime = $state(Date.now());
	let currentLightPosition = $state(0);
	let lastUpdateTime = $state(Date.now());
	let alternateState = $state(false);

	function createLights() {
		const newLights: Light[] = [];
		for (let i = 0; i < lightCount; i++) {
			newLights.push({
				x: ((canvas?.width ?? 800) / lightCount) * (i + 0.5),
				y: (canvas?.height ?? 200) / 2,
				color: selectedColors[i % selectedColors.length],
				on: true
			});
		}
		lights = newLights;
	}

	$effect(() => {
		createLights();
	});

	function updateAndDrawLights() {
		if (ctx) {
			const currentTime = Date.now();
			const timeDiff = currentTime - lastUpdateTime;

			if (timeDiff >= blinkSpeed) {
				if (pattern === 'sequential') {
					currentLightPosition = (currentLightPosition + 1) % lightCount;
				} else if (pattern === 'alternate') {
					alternateState = !alternateState;
				}
				lastUpdateTime = currentTime;
			}

			updateLights();
			drawLights();
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		createLights();
		animate();

		return () => {
			cancelAnimationFrame(animationId);
		};
	});

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		updateAndDrawLights();
		animationId = requestAnimationFrame(animate);
	}

	function drawLights() {
		lights.forEach((light) => {
			if (light.on) {
				ctx.beginPath();
				ctx.arc(light.x, light.y, lightSize, 0, Math.PI * 2);
				ctx.fillStyle = light.color;
				ctx.fill();
			}
		});
	}

	function updateLights() {
		lights.forEach((light, index) => {
			switch (pattern) {
				case 'sequential':
					light.on = index === currentLightPosition;
					break;
				case 'alternate':
					light.on = alternateState ? index % 2 === 0 : index % 2 === 1;
					break;
				case 'random':
					light.on = Math.random() < 0.5;
					break;
				case 'allOn':
					light.on = true;
					break;
			}
		});
	}

	function handleColorChange(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		selectedColors[index] = input.value;
		selectedColors = [...selectedColors];
	}

	function addColor() {
		if (selectedColors.length < colors.length) {
			selectedColors = [...selectedColors, colors[selectedColors.length]];
		}
	}

	function removeColor() {
		if (selectedColors.length > 1) {
			selectedColors = selectedColors.slice(0, -1);
		}
	}
</script>

<main>
	<h1>🎄 Santa's Christmas Light Simulator 🎄</h1>

	<div class="simulator">
		<canvas bind:this={canvas} width="800" height="200"></canvas>
	</div>

	<div class="controls">
		<div class="control-group">
			<label for="lightCount">Number of Lights:</label>
			<input type="range" id="lightCount" bind:value={lightCount} min="5" max="50" step="1" />
			<span>{lightCount}</span>
		</div>

		<div class="control-group">
			<label for="lightSize">Light Size:</label>
			<input type="range" id="lightSize" bind:value={lightSize} min="5" max="20" step="1" />
			<span>{lightSize}px</span>
		</div>

		<div class="control-group">
			<label for="blinkSpeed">Blink Speed:</label>
			<input type="range" id="blinkSpeed" bind:value={blinkSpeed} min="100" max="2000" step="100" />
			<span>{blinkSpeed}ms</span>
		</div>

		<div class="control-group">
			<label for="pattern">Pattern:</label>
			<select id="pattern" bind:value={pattern}>
				<option value="sequential">Sequential</option>
				<option value="alternate">Alternate</option>
				<option value="random">Random</option>
				<option value="allOn">All On</option>
			</select>
		</div>

		<div class="control-group">
			<fieldset>
				<legend>Colors:</legend>
				<div class="color-pickers">
					{#each selectedColors as color, index}
						<input
							type="color"
							value={color}
							oninput={(event) => handleColorChange(event, index)}
						/>
					{/each}
					<button onclick={addColor} disabled={selectedColors.length >= colors.length}>+</button>
					<button onclick={removeColor} disabled={selectedColors.length <= 1}>-</button>
				</div>
			</fieldset>
		</div>
	</div>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		background-color: #f0f0f0;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	h1 {
		text-align: center;
		color: var(--xmas-red);
		margin-bottom: 30px;
	}

	.simulator {
		background-color: #333;
		border-radius: 10px;
		padding: 20px;
		margin-bottom: 20px;
	}

	canvas {
		width: 100%;
		height: 200px;
		background-color: #222;
		border-radius: 5px;
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
	}

	.control-group {
		display: flex;
		flex-direction: column;
	}

	label {
		margin-bottom: 5px;
		font-weight: bold;
	}

	input[type='range'],
	select {
		width: 100%;
		margin-bottom: 5px;
	}

	.color-pickers {
		display: flex;
		gap: 5px;
		align-items: center;
	}

	input[type='color'] {
		width: 30px;
		height: 30px;
		padding: 0;
		border: none;
		border-radius: 50%;
		overflow: hidden;
	}

	button {
		background-color: var(--xmas-green);
		color: white;
		border: none;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		font-size: 18px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
</style>
