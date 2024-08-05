import type { PageServerLoad, Actions } from './$types';
import namesListData from '$lib/payloads/day-11.json';
import { createHash } from 'node:crypto';

interface NamesList {
	firstNames: string[];
	lastNames: string[];
}

const namesList: NamesList = namesListData;

function hashString(str: string): number {
	const hash = createHash('md5').update(str).digest('hex');
	return parseInt(hash.slice(0, 8), 16);
}

export const load: PageServerLoad = async () => {
	return { namesList };
};

export const actions: Actions = {
	generateElfName: async ({ request }) => {
		const data = await request.formData();
		const humanName = data.get('humanName');

		if (!humanName || humanName.toString().trim() === '') {
			return { success: false, message: 'Please enter a human name' };
		}

		const hash = hashString(humanName.toString().toLowerCase());
		const firstNameIndex = hash % namesList.firstNames.length;
		const lastNameIndex =
			Math.floor(hash / namesList.firstNames.length) % namesList.lastNames.length;

		const firstName = namesList.firstNames[firstNameIndex];
		const lastName = namesList.lastNames[lastNameIndex];

		const elfName = `${firstName} ${lastName}`;

		return { success: true, elfName };
	}
};
