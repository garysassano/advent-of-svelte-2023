import type { PageServerLoad } from './$types';

interface WeatherData {
	temperature: number;
	windspeed: number;
	winddirection: number;
	weathercode: number;
}

export const load: PageServerLoad = async ({ url }) => {
	const latitude = url.searchParams.get('lat');
	const longitude = url.searchParams.get('lon');

	if (!latitude || !longitude) {
		return {
			weather: null,
			error: 'Latitude and longitude are required'
		};
	}

	try {
		const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`;
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error('Failed to fetch weather data');
		}

		const data = await response.json();
		const weatherData: WeatherData = data.current_weather;

		return {
			weather: weatherData,
			error: null
		};
	} catch (error) {
		console.error('Error fetching weather data:', error);
		return {
			weather: null,
			error: 'Failed to fetch weather data. Please try again.'
		};
	}
};
