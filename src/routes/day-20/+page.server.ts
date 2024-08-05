import type { PageServerLoad } from './$types';
import jokes from '$lib/payloads/day-20.json';

export const load: PageServerLoad = async () => {
	return { jokes };
};
