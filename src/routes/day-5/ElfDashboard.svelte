<script lang="ts">
	import { createChart } from './elfDashboardAction';
	import type { ChartData, ChartOptions, Plugin } from 'chart.js';
	import 'chartjs-adapter-date-fns';
	import { enUS } from 'date-fns/locale';

	export let data: { hour: string; toys: number; presents: number }[];

	const chartOptions: ChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				type: 'time',
				time: { unit: 'hour', displayFormats: { hour: 'HH:mm' } },
				adapters: { date: { locale: enUS } },
				title: { display: true, text: 'Hour' }
			},
			y: {
				beginAtZero: true,
				title: { display: true, text: 'Count' }
			}
		},
		plugins: { legend: { display: true } }
	};

	let chartData: ChartData;

	$: chartData = {
		datasets: [
			{
				label: '🧸 Toys Created',
				data: data.map((d) => ({ x: new Date(d.hour).getTime(), y: d.toys })),
				backgroundColor: 'rgba(75, 192, 192, 0.8)'
			},
			{
				label: '🎁 Presents Wrapped',
				data: data.map((d) => ({ x: new Date(d.hour).getTime(), y: d.presents })),
				backgroundColor: 'rgba(255, 99, 132, 0.8)'
			}
		]
	};
</script>

<div style="height: 40vh;">
	<canvas use:createChart={{ type: 'bar', data: chartData, options: chartOptions }}></canvas>
</div>
