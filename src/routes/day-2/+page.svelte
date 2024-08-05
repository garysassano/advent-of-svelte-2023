<script>
	import { fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import CookieCounter from './CookieCounter.svelte';

	const counter = new CookieCounter();
</script>

<main>
	<div class="card">
		<h1>🎅 Santa's Cookie Counter</h1>

		<div class="counter">
			<p class="counter-row">
				<span class="label">Cookies munched:</span>
				<span class="value-container">
					{#key counter.cookieCount}
						<span
							in:fly={{ y: 10, duration: 200, opacity: 0, easing: cubicOut }}
							out:fly={{ y: -10, duration: 200, opacity: 0, easing: cubicOut }}
						>
							{counter.cookieCount}
						</span>
					{/key}
				</span>
			</p>
			<p class="counter-row">
				<span class="label">Santa's mood:</span>
				<span class="value-container">
					{#key counter.santaMood}
						<span
							in:scale={{ duration: 300, start: 0.5, opacity: 0 }}
							out:scale={{ duration: 300, start: 1.5, opacity: 0 }}
						>
							{counter.santaMood}
						</span>
					{/key}
				</span>
			</p>
		</div>

		<div class="buttons">
			<button onclick={() => counter.addCookie()}>Add Cookie</button>
			<button onclick={() => counter.removeCookie()}>Remove Cookie</button>
			<button onclick={() => counter.resetCount()}>Reset Count</button>
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		padding-top: 40px;
	}

	.card {
		background-color: white;
		border-radius: 10px;
		padding: 30px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		display: inline-block;
	}

	h1 {
		color: var(--xmas-red);
		margin-top: 0;
	}

	.counter {
		font-size: 24px;
		margin: 20px 0;
	}

	.counter-row {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 10px 0;
	}

	.label {
		width: 200px;
		text-align: right;
		margin-right: 10px;
	}

	.value-container {
		width: 50px;
		height: 40px;
		display: inline-flex;
		justify-content: flex-start;
		align-items: center;
	}

	.value-container > span {
		position: absolute;
	}

	.buttons {
		display: flex;
		justify-content: center;
		gap: 10px;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		background-color: var(--xmas-red);
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #a51a30;
	}
</style>
