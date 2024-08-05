<script lang="ts">
	import Snowfall from '$lib/components/Snowfall.svelte';

	const days = Array.from({ length: 24 }, (_, i) => i + 1);

	function getChallengeName(day: number): string {
		switch (day) {
			case 1:
				return 'Naughty or Nice';
			case 2:
				return 'Merry Munch-o-Meter';
			case 3:
				return 'Jingle Bell Balancer';
			case 4:
				return 'Heart of Christmas';
			case 5:
				return 'Present Progress';
			case 6:
				return 'Misteltoe Metronome';
			case 7:
				return 'Morse Mischief';
			case 8:
				return "Santa's Mysterious Deck of Doubles";
			case 9:
				return "Santa's Final Countdown";
			case 10:
				return 'Pop-up! Spreading the holiday cheer';
			case 11:
				return 'Tinsel Transformers';
			case 12:
				return 'Greetings and salutations';
			case 13:
				return 'Jingle Bell Balancer 2.0';
			case 14:
				return 'Snowfall Symphony';
			case 15:
				return 'Sparkling Snowglobes';
			case 16:
				return 'Lessons from Amazon™';
			case 17:
				return 'Festive Funds';
			case 18:
				return "Santa's Quiz";
			case 19:
				return 'Polar Lights';
			case 20:
				return 'Jingle Jokes';
			case 21:
				return 'Oh the weather outside is frightful';
			case 22:
				return 'Snowflake Silhouettes';
			case 23:
				return 'ElfNet Social';
			case 24:
				return "Santa's Magical Tracker";
			default:
				return 'Coming Soon';
		}
	}

	function isImplemented(day: number): boolean {
		const implementedDays = [1, 12];
		return implementedDays.includes(day);
	}
</script>

<Snowfall snowflakeCount={100} snowflakeSpeed={0.5} />

<main>
	<h1>🎄 Advent of Svelte 2023 🎄</h1>

	<div class="calendar">
		{#each days as day}
			<a href={`/day-${day}`} class="day-card">
				<div class="day-number">{day}</div>
				<div class="challenge-name">{getChallengeName(day)}</div>
			</a>
		{/each}
	</div>
</main>

<style>
	main {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
	}

	h1 {
		color: var(--xmas-red);
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}

	.calendar {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 1rem;
	}

	.day-card {
		background-color: var(--xmas-red);
		border-radius: 8px;
		padding: 1rem;
		text-decoration: none;
		color: #ffffff;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1 / 1;
	}

	.day-card:hover {
		background-color: var(--xmas-green);
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.day-number {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.challenge-name {
		font-size: 0.9rem;
		text-align: center;
	}

	@media (max-width: 1200px) {
		.calendar {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 900px) {
		.calendar {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 600px) {
		.calendar {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
