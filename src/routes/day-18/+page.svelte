<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	interface Question {
		question: string;
		answers: {
			text: string;
			correct: boolean;
		}[];
	}

	let questions: Question[] = data.questions;
	let currentQuestionIndex = 0;
	let score = 0;
	let quizCompleted = false;
	let selectedAnswer: number | null = null;
	let showAnswer = false;

	function handleAnswer(index: number, correct: boolean) {
		if (showAnswer) return;
		selectedAnswer = index;
		showAnswer = true;

		if (correct) {
			score++;
		}
	}

	function nextQuestion() {
		if (currentQuestionIndex < questions.length - 1) {
			currentQuestionIndex++;
			selectedAnswer = null;
			showAnswer = false;
		} else {
			quizCompleted = true;
		}
	}

	function restartQuiz() {
		currentQuestionIndex = 0;
		score = 0;
		quizCompleted = false;
		selectedAnswer = null;
		showAnswer = false;
		questions = [...data.questions].sort(() => Math.random() - 0.5);
	}
</script>

<h1>🎅 North Pole Quiz 🎄</h1>

{#if quizCompleted}
	<div class="quiz-completed">
		<h2>🎉 Quiz Completed! 🎉</h2>
		<p class="final-score">
			You scored <span class="score-value">{score}</span> out of
			<span class="score-value">{questions.length}</span> 🏆
		</p>
		<button on:click={restartQuiz} class="restart-btn">🔄 Restart Quiz</button>
	</div>
{:else}
	<h2>❓ Question {currentQuestionIndex + 1} of {questions.length}</h2>
	<p class="question">{questions[currentQuestionIndex].question}</p>
	<div class="answers">
		{#each questions[currentQuestionIndex].answers as answer, index}
			<button
				on:click={() => handleAnswer(index, answer.correct)}
				class:selected={selectedAnswer === index}
				class:correct={showAnswer && answer.correct}
				class:incorrect={showAnswer && selectedAnswer === index && !answer.correct}
				disabled={showAnswer}
			>
				<span class="answer-text">{answer.text}</span>
				{#if showAnswer && answer.correct}
					<span class="indicator">✅</span>
				{:else if showAnswer && selectedAnswer === index && !answer.correct}
					<span class="indicator">❌</span>
				{/if}
			</button>
		{/each}
	</div>
	<div class="bottom-bar">
		<p class="score">🎯 Score: <span class="score-value">{score}</span></p>
		<button on:click={nextQuestion} class="next-btn" disabled={!showAnswer}>
			Next Question ➡️
		</button>
	</div>
{/if}

<style>
	h1,
	h2 {
		color: var(--xmas-red);
		text-align: center;
	}

	.question {
		font-size: 1.2em;
		margin-bottom: 1em;
		text-align: center;
	}

	.answers {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
		margin-bottom: 20px;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.answers button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		font-size: 16px;
		cursor: pointer;
		background-color: white;
		border: 2px solid var(--xmas-green);
		border-radius: 5px;
		transition: all 0.3s ease;
		min-height: 50px;
		width: 100%;
	}

	.answer-text {
		flex-grow: 1;
		text-align: left;
	}

	.indicator {
		margin-left: 10px;
		font-size: 20px;
	}

	.answers button:hover:not(:disabled) {
		background-color: var(--xmas-green);
		color: white;
	}

	.answers button.selected {
		background-color: #ffd700;
		border-color: #ffd700;
	}

	.answers button.correct {
		background-color: #4caf50;
		border-color: #4caf50;
		color: white;
	}

	.answers button.incorrect {
		background-color: #f44336;
		border-color: #f44336;
		color: white;
	}

	.answers button:disabled {
		cursor: not-allowed;
		opacity: 0.7;
	}

	.bottom-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.score {
		font-weight: bold;
		font-size: 1.2em;
		margin: 0;
	}

	.score-value {
		color: var(--xmas-red);
		font-size: 1.2em;
	}

	.restart-btn,
	.next-btn {
		background-color: var(--xmas-green);
		color: white;
		border: none;
		padding: 10px 20px;
		font-size: 18px;
		border-radius: 5px;
		cursor: pointer;
	}

	.restart-btn:hover,
	.next-btn:hover:not(:disabled) {
		background-color: #006400;
	}

	.restart-btn {
		display: inline-block;
		margin-top: 1em;
	}

	.quiz-completed {
		text-align: center;
		margin-top: 2em;
	}

	.final-score {
		font-size: 1.5em;
		margin: 1em 0;
	}

	.score-value {
		color: var(--xmas-red);
		font-weight: bold;
		font-size: 1.2em;
	}

	/* ... (rest of the styles remain unchanged) */

	/* Add these new styles for better responsiveness */
	@media (max-width: 650px) {
		.answers,
		.bottom-bar {
			max-width: 90%;
		}
	}
</style>
