import { Chart, registerables } from 'chart.js';
import type { ChartData, ChartOptions, ChartType } from 'chart.js';

// Register all built-in chart types, scales, and plugins
Chart.register(...registerables);

// Function to create and manage a chart
export function createChart(
	node: HTMLCanvasElement,
	{ type, data, options }: { type: ChartType; data: ChartData; options: ChartOptions }
) {
	// Create a new Chart instance
	const chart = new Chart(node, { type, data, options });

	// Return an object with methods to update and destroy the chart
	return {
		// Method to update the chart's data and options
		update({ data, options }: { data: ChartData; options: ChartOptions }) {
			chart.data = data;
			chart.options = options;
			// Apply the updates to the chart
			chart.update();
		},
		// Method to destroy the chart and free up resources
		destroy() {
			chart.destroy();
		}
	};
}
