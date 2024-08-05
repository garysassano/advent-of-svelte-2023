<script lang="ts">
	import { Map, Marker } from '@beyonk/svelte-mapbox';

	let { data } = $props();
	let santaData = $state(data.santaData);
	let mapComponent: any;
	let accessToken =
		'pk.eyJ1IjoicmljaC1oYXJyaXMiLCJhIjoiY2pzeDd4cjNmMHBtODQ0cWl5czVkMTY4ciJ9.xBTLr8gFCSZg7dqaN_B26Q';

	let currentPosition = $derived.by(() => {
		if (santaData.history.length > 0) {
			const lastLocation = santaData.history[santaData.history.length - 1];
			return [lastLocation.location.lng, lastLocation.location.lat];
		}
		return [0, 0];
	});

	function onMapReady() {
		if (mapComponent && mapComponent.flyTo) {
			mapComponent.flyTo({ center: currentPosition, zoom: 3 });
		}
	}
</script>

<main>
	<h1>🎅 Santa's Sleigh Position Reporting System (SPRS™) 🦌</h1>
	<div class="content-wrapper">
		<div class="map-container">
			<Map
				{accessToken}
				style="mapbox://styles/mapbox/dark-v10"
				center={currentPosition}
				zoom={2}
				bind:this={mapComponent}
				on:ready={onMapReady}
			>
				{#each santaData.history as location, index}
					<Marker
						lat={location.location.lat}
						lng={location.location.lng}
						label={`${location.city}, ${location.region}`}
					>
						<div class="marker" class:current={index === santaData.history.length - 1}>
							{index === santaData.history.length - 1 ? '🎅' : '🎄'}
						</div>
						<div slot="popup" class="popup-content">
							<h3>{location.city}, {location.region}</h3>
							<p>Population: {location.population}</p>
							<p>Presents Delivered: {location.presentsDelivered}</p>
							<p>Arrival Time: {new Date(location.arrival).toLocaleString()}</p>
						</div>
					</Marker>
				{/each}
			</Map>
		</div>

		<div class="info popup-content locations-list">
			<h3>🎄 All Locations Visited</h3>
			<ol reversed>
				{#each santaData.history as location, index (location.id)}
					{@const reverseIndex = santaData.history.length - 1 - index}
					<li>
						<div class="location-info">
							<span class="location"
								>{santaData.history[reverseIndex].city}, {santaData.history[reverseIndex]
									.region}</span
							>
							<span class="arrival-time">
								(Arrived: {new Date(santaData.history[reverseIndex].arrival).toLocaleString()})
							</span>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 20px;
		box-sizing: border-box;
	}

	h1 {
		text-align: center;
		color: #ff0000;
		margin-bottom: 20px;
	}

	.content-wrapper {
		display: flex;
		height: calc(100vh - 100px);
		gap: 20px;
	}

	.map-container {
		flex: 1;
		height: 100%;
	}

	.info {
		flex: 0 0 400px;
		overflow-y: auto;
		margin-bottom: 0;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.marker {
		font-size: 24px;
		cursor: pointer;
	}

	.marker.current {
		font-size: 32px;
	}

	.popup-content {
		background-color: #fff;
		color: #333;
		padding: 15px;
		padding-right: 30px;
	}

	.popup-content h3 {
		margin: 0 0 10px 0;
		font-size: 18px;
	}

	.popup-content p {
		margin: 5px 0;
		font-size: 14px;
	}

	.locations-list {
		background-color: #fff;
	}

	.locations-list ol {
		list-style-type: decimal;
		padding-left: 40px;
		margin: 0;
		color: #333;
	}

	.locations-list li {
		margin-bottom: 10px;
		padding: 5px 0;
		border-bottom: 1px solid #eee;
	}

	.location-info {
		display: flex;
		flex-direction: column;
		padding-left: 5px;
	}

	.location {
		font-weight: bold;
		margin-bottom: 5px;
		color: #333;
	}

	.arrival-time {
		font-size: 0.9em;
		color: #666;
	}

	.info h3 {
		color: var(--xmas-green);
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>
