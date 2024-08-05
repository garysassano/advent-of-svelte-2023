export default class Snowflake {
	name = $state('');
	svg: SVGElement = $state()!;

	// Mulberry32 is a simple pseudo-random number generator
	private mulberry32(a: number) {
		return () => {
			let t = (a += 0x6d2b79f5);
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	// Create a random number generator based on the input name
	random = $derived.by(() => {
		// Convert the name to a number by summing char codes
		const seedNumber = String(this.name)
			.split('')
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return this.mulberry32(seedNumber);
	});

	// Generate snowflake properties based on the random number
	size = $derived(this.random() * 20 + 25);
	stroke_width = $derived(this.random() + 1);
	hue = $derived(Math.floor(this.random() * 360));

	// Generate spokes for the snowflake
	spokes = $derived.by(() => {
		const s = [10, 9, 8, 6].at(Math.floor(this.random() * 4))!;
		return function* () {
			for (let i = 0; i < s; i++) {
				yield (i * 360) / s;
			}
		};
	});

	// Generate the branch pattern for the snowflake
	branch = $derived.by(() => {
		let path = `M 50 50 L 50 ${50 - this.size}`;
		for (
			let i = this.random() * 2 + 3;
			i < this.size;
			i += this.random() * 8 + 2 * this.stroke_width
		) {
			const distance = this.random() * 5 + 5;
			path += ` M 50 ${50 - i} L ${50 - distance} ${50 - i - distance}`;
		}
		return path;
	});

	// Generate colors for the snowflake and background
	snowflake_color = $derived(`hsl(${this.hue}, 80%, 75%)`);
	snowflake_bg_color = $derived(`hsl(${this.hue}, 30%, 30%)`);

	// Function to download the snowflake as an SVG file
	download() {
		// Clone the original SVG
		const trimmedSvg = trimSvg(this.svg as SVGSVGElement);

		// Create a blob and download
		const blob = new Blob([trimmedSvg.outerHTML], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${this.name}-snowflake.svg`;
		link.click();
		URL.revokeObjectURL(url);
	}
}

function trimSvg(svg: SVGSVGElement): SVGSVGElement {
	const trimmedSvg = svg.cloneNode(true) as SVGSVGElement;
	trimmedSvg.setAttribute('viewBox', '0 0 100 100');

	const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
	const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
	clipPath.setAttribute('id', 'square-clip');
	const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	clipRect.setAttribute('width', '100');
	clipRect.setAttribute('height', '100');
	clipPath.appendChild(clipRect);
	defs.appendChild(clipPath);
	trimmedSvg.insertBefore(defs, trimmedSvg.firstChild);

	const snowflakeGroup = trimmedSvg.querySelector('g')!;
	snowflakeGroup.setAttribute('clip-path', 'url(#square-clip)');

	const rect = trimmedSvg.querySelector('rect')!;
	rect.setAttribute('width', '100');
	rect.setAttribute('height', '100');

	return trimmedSvg;
}
