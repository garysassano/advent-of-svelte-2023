<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let latitude: number | null = null;
	let longitude: number | null = null;
	let loading = true;
	let error: string | null = data.error;
	let weather = data.weather;

	const weatherEmojis: { [key: string]: string } = {
		Clear: '☀️',
		Cloudy: '☁️',
		Fog: '🌫️',
		Rain: '🌧️',
		Snow: '❄️',
		Thunderstorm: '⛈️'
	};

	function getWeatherEmoji(weatherCode: number): string {
		if (weatherCode === 0) return weatherEmojis['Clear'];
		if (weatherCode >= 1 && weatherCode <= 3) return weatherEmojis['Cloudy'];
		if (weatherCode >= 45 && weatherCode <= 48) return weatherEmojis['Fog'];
		if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82))
			return weatherEmojis['Rain'];
		if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86))
			return weatherEmojis['Snow'];
		if (weatherCode >= 95 && weatherCode <= 99) return weatherEmojis['Thunderstorm'];
		return '🎅';
	}

	onMount(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					const url = new URL(window.location.href);
					url.searchParams.set('lat', latitude.toString());
					url.searchParams.set('lon', longitude.toString());
					window.history.replaceState({}, '', url);
					location.reload();
				},
				() => {
					error = 'Unable to retrieve your location. Please enable location services.';
					loading = false;
				}
			);
		} else {
			error = 'Geolocation is not supported by your browser.';
			loading = false;
		}
	});

	$: loading = !(weather || error);
</script>

<main>
	<h1>🎅 Santa's Weather Helper</h1>

	{#if loading}
		<p>Loading weather data... 🎄</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if weather}
		<div class="weather-card">
			<h2>Current Weather {getWeatherEmoji(weather.weathercode)}</h2>
			<p>Temperature: {weather.temperature}°C</p>
			<p>Wind Speed: {weather.windspeed} km/h</p>
			<p>Wind Direction: {weather.winddirection}°</p>
		</div>
	{/if}
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		background-color: #f0f0f0;
		color: #333;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	h1 {
		color: var(--xmas-red);
		margin-bottom: 30px;
	}

	.weather-card {
		background-color: white;
		border-radius: 10px;
		padding: 20px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	h2 {
		color: var(--xmas-green);
		margin-bottom: 20px;
	}

	p {
		font-size: 18px;
		margin-bottom: 10px;
	}

	.error {
		color: var(--xmas-red);
		font-weight: bold;
	}
</style>
