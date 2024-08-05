import type { PageServerLoad } from './$types';
import rawData from '$lib/payloads/day-5.json';

export const load: PageServerLoad = async () => {
	try {
		if (!Array.isArray(rawData)) {
			throw new Error('Data is not an array');
		}

		const tasks = rawData.map((item) => {
			if (
				typeof item.elf !== 'string' ||
				(item.task !== 'CREATED_TOY' && item.task !== 'WRAPPED_PRESENT') ||
				typeof item.minutesTaken !== 'number' ||
				typeof item.date !== 'string' ||
				isNaN(Date.parse(item.date))
			) {
				throw new Error('Invalid data format');
			}

			return {
				elf: item.elf,
				task: item.task,
				minutesTaken: item.minutesTaken,
				date: item.date
			};
		});

		return { tasks };
	} catch (error) {
		console.error('Error parsing data:', error);
		return { tasks: [] };
	}
};
