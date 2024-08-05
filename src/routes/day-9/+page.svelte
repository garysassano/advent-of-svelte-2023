<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	interface TimeLeft {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	}

	let timeLeft: TimeLeft = $state({ days: 0, hours: 0, minutes: 0, seconds: 0 });
	let mounted = $state(false);

	function calculateTimeLeft(): TimeLeft {
		const christmasEve = new Date(new Date().getFullYear(), 11, 24, 0, 0, 0, 0);
		const now = new Date();
		const difference = christmasEve.getTime() - now.getTime();

		if (difference > 0) {
			return {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60)
			};
		} else {
			return { days: 0, hours: 0, minutes: 0, seconds: 0 };
		}
	}

	function updateCountdown() {
		timeLeft = calculateTimeLeft();
	}

	onMount(() => {
		mounted = true;
		updateCountdown();
		const timer = setInterval(updateCountdown, 1000);
		return () => clearInterval(timer);
	});
</script>

{#if mounted}
	<main in:fade={{ duration: 300 }}>
		<h1 in:fly={{ y: -50, duration: 500 }}>🎅 Santa's Christmas Countdown 🎄</h1>

		<div class="countdown-container">
			{#if mounted}
				{#each Object.entries(timeLeft) as [unit, value]}
					<div class="countdown-item" in:fly={{ y: 50, duration: 500, delay: 300 }}>
						<div class="countdown-value">{value}</div>
						<div class="countdown-unit">{unit}</div>
					</div>
				{/each}
			{/if}
		</div>

		<div class="festive-decorations">
			<div class="snowflake">❄️</div>
			<div class="santa">🎅</div>
			<div class="tree">🎄</div>
			<div class="gift">🎁</div>
		</div>
	</main>
{/if}

<style>
	main {
		max-width: 800px;
		margin: 40px auto;
		padding: 20px;
		text-align: center;
		background-color: #f0f0f0;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	h1 {
		color: var(--xmas-red);
		margin-bottom: 30px;
	}

	.countdown-container {
		display: flex;
		justify-content: center;
		gap: 20px;
		margin-bottom: 40px;
	}

	.countdown-item {
		background-color: #ffffff;
		border-radius: 10px;
		padding: 20px;
		min-width: 100px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.countdown-value {
		font-size: 2.5em;
		font-weight: bold;
		color: var(--xmas-red);
	}

	.countdown-unit {
		font-size: 1em;
		color: #333;
		text-transform: uppercase;
	}

	.festive-decorations {
		position: relative;
		height: 100px;
	}

	.festive-decorations > div {
		position: absolute;
		font-size: 2em;
		animation: float 3s ease-in-out infinite;
	}

	.snowflake {
		left: 10%;
		top: 20%;
		animation-delay: 0s;
	}
	.santa {
		right: 15%;
		top: 10%;
		animation-delay: 0.5s;
	}
	.tree {
		left: 20%;
		bottom: 10%;
		animation-delay: 1s;
	}
	.gift {
		right: 25%;
		bottom: 20%;
		animation-delay: 1.5s;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}
</style>
