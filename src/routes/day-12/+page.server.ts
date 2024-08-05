import type { PageServerLoad } from './$types';

interface Decoration {
	id: number;
	url: string;
}

export const load: PageServerLoad = async () => {
	const decorations: Decoration[] = Array.from({ length: 11 }, (_, i) => ({
		id: i + 1,
		url: `/decorations/${i + 1}.png`
	}));

	return { decorations };
};
