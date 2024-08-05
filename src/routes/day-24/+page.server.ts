import type { PageServerLoad } from './$types';
import santaData from '$lib/payloads/day-24.json';

export const load: PageServerLoad = async () => {
	return {
		santaData
	};
};
