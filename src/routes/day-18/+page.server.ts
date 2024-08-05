import type { PageServerLoad } from './$types';
import questions from '$lib/payloads/day-18.json';

function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export const load: PageServerLoad = async () => {
	// Shuffle the questions array
	const shuffledQuestions = shuffleArray([...questions]);

	// Shuffle the answers for each question
	const questionsWithShuffledAnswers = shuffledQuestions.map((question) => ({
		...question,
		answers: shuffleArray([...question.answers])
	}));

	// Return the first 20 questions
	return {
		questions: questionsWithShuffledAnswers.slice(0, 20)
	};
};
