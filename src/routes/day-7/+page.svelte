<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import MorseCodeTranslator from './MorseCode.svelte';

	const translator = new MorseCodeTranslator();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<main in:fade={{ duration: 300 }}>
		<h1 in:fly={{ y: -50, duration: 500 }}>🎅 Santa's Morse Code Translator</h1>

		<div class="translator">
			<div class="input-section">
				<h2>Input Text</h2>
				<textarea bind:value={translator.inputText} placeholder="Enter your message here..."
				></textarea>
			</div>

			<div class="output-section">
				<h2>Morse Code Output</h2>
				<div class="morse-output">{translator.outputMorse}</div>
				<button
					onclick={() => translator.playMorseCode()}
					disabled={translator.isPlaying || !translator.outputMorse}
				>
					{translator.isPlaying ? 'Playing...' : 'Play Morse Code'}
				</button>
			</div>
		</div>
	</main>
{/if}

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}

	h1 {
		color: var(--xmas-red);
		text-align: center;
	}

	.translator {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 20px;
	}

	.input-section,
	.output-section {
		width: 100%;
	}

	textarea {
		width: 100%;
		height: 150px;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
		resize: vertical;
		font-size: 16px;
	}

	.morse-output {
		color: black;
		background-color: #f0f0f0;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 10px;
		min-height: 150px;
		white-space: pre-wrap;
		word-break: break-all;
		font-size: 16px;
	}

	button {
		margin-top: 10px;
		padding: 10px 20px;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
		font-size: 16px;
	}

	button:hover {
		background-color: #45a049;
	}

	button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
</style>
