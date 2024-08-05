import type { PageServerLoad } from './$types';
import elfnetPosts from '$lib/payloads/day-23.json';

export const load: PageServerLoad = async () => {
	return {
		posts: elfnetPosts
	};
};
