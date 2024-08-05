import type { PageServerLoad } from './$types';
import presentData from '$lib/payloads/day-13.json';

interface Present {
	name: string;
	weight: number;
}

export const load: PageServerLoad = async () => {
	const presents: Present[] = presentData;

	const totalWeight = presents.reduce((sum, present) => sum + present.weight, 0);
	const averageWeight = totalWeight / presents.length;
	const numberOfDeliveries = Math.ceil(presents.length / 100);

	return {
		presents,
		stats: {
			totalChildren: presents.length,
			averageWeight,
			numberOfDeliveries
		}
	};
};
