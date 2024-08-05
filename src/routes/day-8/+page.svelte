<script lang="ts">
	interface Card {
		id: number;
		imageUrl: string;
		isFlipped: boolean;
		isMatched: boolean;
	}

	// Game state
	let cards: Card[] = $state([]);
	let flippedCards: Card[] = [];
	let matchedPairs = $state(0);
	let moves = $state(0);
	let timer = $state(0);
	let isChecking = false;
	let timerInterval: NodeJS.Timeout;

	const GAME_STATE = ['NotStarted', 'Playing', 'Ended'] as const;
	type GameState = (typeof GAME_STATE)[number];

	let gameState = $state<GameState>('NotStarted');

	// Game logic functions
	function shuffleCards() {
		const cardIds = Array.from({ length: 24 }, (_, i) => i + 1);
		const shuffledIds = [...cardIds, ...cardIds].sort(() => Math.random() - 0.5);
		cards = shuffledIds.map((id) => ({
			id,
			imageUrl: `/cards/${id}.png`,
			isFlipped: false,
			isMatched: false
		}));
		console.log('Cards shuffled, new length:', cards.length);
	}

	function startGame() {
		shuffleCards();
		matchedPairs = 0;
		moves = 0;
		timer = 0;
		gameState = 'Playing';
		timerInterval = setInterval(() => timer++, 1000);
		console.log('Game started, new state:', gameState);
		console.log('Number of cards:', cards.length);
	}

	function flipCard(card: Card) {
		if (
			gameState === 'NotStarted' ||
			card.isFlipped ||
			card.isMatched ||
			flippedCards.length === 2 ||
			isChecking
		)
			return;

		card.isFlipped = true;
		cards = [...cards]; // Trigger reactivity
		flippedCards = [...flippedCards, card];

		if (flippedCards.length === 2) {
			isChecking = true;
			moves++;
			setTimeout(checkMatch, 1000);
		}
	}

	function checkMatch() {
		const [card1, card2] = flippedCards;
		if (card1.id === card2.id) {
			card1.isMatched = card2.isMatched = true;
			matchedPairs++;
			if (matchedPairs === 24) endGame();
		} else {
			card1.isFlipped = card2.isFlipped = false;
		}
		cards = [...cards]; // Trigger reactivity
		flippedCards = [];
		isChecking = false;
	}

	function endGame() {
		clearInterval(timerInterval);
		gameState = 'Ended';
	}

	// Utility functions
	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
</script>

<main>
	<div class="container">
		<h1>🎅 Santa's Deck of Doubles Memory Game</h1>

		{#if gameState === 'NotStarted'}
			<button onclick={startGame}>Start Game</button>
		{:else if gameState === 'Playing'}
			<div class="game-info">
				<p>Moves: {moves}</p>
				<p>Time: {formatTime(timer)}</p>
				<p>Matched Pairs: {matchedPairs}</p>
			</div>
			<div class="card-grid">
				{#if cards.length === 0}
					<p>No cards to display</p>
				{:else}
					{#each cards as card}
						<div
							class="card"
							class:flipped={card.isFlipped}
							class:matched={card.isMatched}
							onclick={() => flipCard(card)}
							onkeydown={(e) => e.key === 'Enter' && flipCard(card)}
							tabindex="0"
							role="button"
						>
							<div class="card-inner">
								<div class="card-front"></div>
								<div class="card-back">
									{#if card.isFlipped}
										<img src={card.imageUrl} alt="Card {card.id}" />
									{/if}
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{:else if gameState === 'Ended'}
			<div class="game-over">
				<h2>Game Over!</h2>
				<p>Your time: {formatTime(timer)}</p>
				<p>Total moves: {moves}</p>
				<button onclick={startGame}>Play Again</button>
			</div>
		{/if}
	</div>
</main>

<style>
	main {
		max-width: 840px; /* Increased to account for container padding */
		margin: 0 auto;
		padding: 20px;
		text-align: center;
	}

	h1 {
		color: var(--xmas-red);
	}

	.game-info {
		display: flex;
		justify-content: space-around;
		margin-bottom: 20px;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: 10px;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	.card {
		aspect-ratio: 2 / 3;
		perspective: 1000px;
		cursor: pointer;
		width: 100%;
		border: none;
	}

	.card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.6s;
		transform-style: preserve-3d;
	}

	.card.flipped .card-inner {
		transform: rotateY(180deg);
	}

	.card-front,
	.card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		border-radius: 4px;
		border: none;
	}

	.card-front {
		background-color: var(--xmas-red);
	}

	.card-back {
		background-color: white;
		transform: rotateY(180deg);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-back img {
		max-width: 90%;
		max-height: 90%;
		object-fit: contain;
	}

	.card.matched {
		opacity: 0.7;
	}

	button {
		margin-top: 20px;
		padding: 10px 20px;
		font-size: 16px;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}

	.game-over {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(255, 255, 255, 0.9);
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.container {
		background-color: white;
		border-radius: 10px;
		padding: 20px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
</style>
