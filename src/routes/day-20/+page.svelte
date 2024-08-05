<script lang="ts">
	import { onMount } from 'svelte';

	let { data } = $props();
	const jokes = data.jokes;

	let currentJoke = $state('');
	let synth = $state<SpeechSynthesis | undefined>(undefined);
	let speaking = $state(false);

	const jokesAvailable = $derived(jokes.length > 0);
	const speakButtonDisabled = $derived(!currentJoke || !synth);

	onMount(() => {
		synth = window.speechSynthesis ?? undefined;
	});

	function getRandomJoke() {
		if (jokesAvailable) {
			const randomIndex = Math.floor(Math.random() * jokes.length);
			currentJoke = jokes[randomIndex];
		} else {
			currentJoke = 'No jokes available. Please try again later.';
		}
	}

	function speakJoke() {
		if (!synth || !currentJoke) return;

		if (speaking) {
			synth.cancel();
		} else {
			const utterance = new SpeechSynthesisUtterance(currentJoke);
			utterance.onend = () => (speaking = false);
			synth.speak(utterance);
		}
		speaking = !speaking;
	}
</script>

<main>
	<h1>🎄 Christmas Cracker Jokes 🎅</h1>
	<p>Press the button to get a random Christmas Cracker Joke!</p>

	<div class="button-container">
		<button on:click={getRandomJoke} disabled={!jokesAvailable}>Get Random Joke</button>
		<button on:click={speakJoke} disabled={speakButtonDisabled}>
			{speaking ? 'Stop Speaking' : 'Speak Joke'}
		</button>
	</div>

	{#if currentJoke}
		<div class="joke-container">
			<p>{currentJoke}</p>
		</div>
	{/if}

	{#if !jokesAvailable}
		<p class="error">No jokes available. Please try refreshing the page.</p>
	{/if}
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
		margin-bottom: 20px;
	}

	.button-container {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 20px;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		background-color: var(--xmas-green);
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #006f2e;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.joke-container {
		background-color: white;
		border-radius: 10px;
		padding: 20px;
		margin-top: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.joke-container p {
		font-size: 18px;
		line-height: 1.5;
	}

	.error {
		color: var(--xmas-red);
		font-weight: bold;
		margin-top: 20px;
	}
</style>
