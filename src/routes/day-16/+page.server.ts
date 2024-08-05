import type { PageServerLoad } from './$types';
import presentsData from '$lib/payloads/day-16.json';

interface Present {
	name: string;
	x: number; // 1-20
	y: number; // 1-20
}

export const load: PageServerLoad = async () => {
	try {
		const presents: Present[] = presentsData;
		console.log('Presents loaded:', presents.length);
		return { presents };
	} catch (error) {
		console.error('Error loading presents:', error);
		return { presents: [], error: 'Failed to load presents' };
	}
};
