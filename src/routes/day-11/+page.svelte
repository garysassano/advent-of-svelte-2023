<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let form: ActionData;

	let humanName = '';
</script>

<main>
	<h1>🧝 Elf Name Generator 🎄</h1>

	<form method="POST" action="?/generateElfName" use:enhance>
		<div class="input-container">
			<input
				type="text"
				name="humanName"
				bind:value={humanName}
				placeholder="Enter your human name"
				required
			/>
			<button type="submit">Generate Elf Name</button>
		</div>
	</form>

	{#if form?.success}
		<div class="result">
			<p>Your elf name is:</p>
			<h2 class="elf-name">{form.elfName}</h2>
		</div>
	{:else if form?.message}
		<p class="error">{form.message}</p>
	{/if}
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		text-align: center;
	}

	h1 {
		color: var(--xmas-red);
		margin-bottom: 30px;
	}

	.input-container {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}

	input {
		padding: 10px;
		font-size: 16px;
		border: 2px solid #3498db;
		border-radius: 5px 0 0 5px;
		width: 250px;
	}

	input:focus {
		outline: none;
		box-shadow: inset 0 0 0 2px #3498db;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		background-color: #3498db;
		color: white;
		border: none;
		border-radius: 0 5px 5px 0;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #2980b9;
	}

	.result {
		margin-top: 30px;
	}

	.elf-name {
		font-family: 'Brush Script MT', cursive;
		font-size: 36px;
		color: var(--xmas-green);
		margin-top: 10px;
	}

	.error {
		color: var(--xmas-red);
		margin-top: 10px;
	}
</style>
