<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let cardContainer: HTMLDivElement;
	let draggingElement: HTMLImageElement | undefined = undefined;
	let offsetX: number, offsetY: number;
	let isMovingPlacedDecoration = false;

	// Handle the start of dragging for both new and placed decorations
	function startDragging(event: MouseEvent) {
		const target = event.target as HTMLImageElement;
		if (!target.classList.contains('decoration')) return;

		event.preventDefault();
		const rect = target.getBoundingClientRect();
		offsetX = event.clientX - rect.left;
		offsetY = event.clientY - rect.top;

		isMovingPlacedDecoration = !!target.closest('.card');
		draggingElement = isMovingPlacedDecoration
			? target
			: (target.cloneNode(true) as HTMLImageElement);

		if (!isMovingPlacedDecoration) {
			draggingElement.style.position = 'absolute';
			draggingElement.style.pointerEvents = 'none';
			document.body.appendChild(draggingElement);
		}

		updateDraggingPosition(event);
	}

	// Update the position of the dragged element
	function updateDraggingPosition(event: MouseEvent) {
		if (!draggingElement) return;

		const { clientX, clientY } = event;
		const cardRect = cardContainer.getBoundingClientRect();

		if (isMovingPlacedDecoration) {
			draggingElement.style.left = `${clientX - cardRect.left - offsetX}px`;
			draggingElement.style.top = `${clientY - cardRect.top - offsetY}px`;
		} else {
			draggingElement.style.left = `${clientX - offsetX}px`;
			draggingElement.style.top = `${clientY - offsetY}px`;
		}
	}

	// Handle the end of dragging
	function stopDragging(event: MouseEvent) {
		if (!draggingElement) return;

		const cardRect = cardContainer.getBoundingClientRect();
		const isInsideCard =
			event.clientX > cardRect.left &&
			event.clientX < cardRect.right &&
			event.clientY > cardRect.top &&
			event.clientY < cardRect.bottom;

		if (isInsideCard && !isMovingPlacedDecoration) {
			addDecorationToCard(event, cardRect);
		} else if (!isInsideCard && isMovingPlacedDecoration) {
			cardContainer.removeChild(draggingElement);
		}

		cleanupDragging();
	}

	// Add new decoration to the card
	function addDecorationToCard(event: MouseEvent, cardRect: DOMRect) {
		const newDecoration = draggingElement!.cloneNode(true) as HTMLImageElement;
		Object.assign(newDecoration.style, {
			position: 'absolute',
			left: `${event.clientX - cardRect.left - offsetX}px`,
			top: `${event.clientY - cardRect.top - offsetY}px`,
			pointerEvents: 'auto'
		});
		newDecoration.classList.add('placed-decoration', 'decoration');
		cardContainer.appendChild(newDecoration);
	}

	// Clean up after dragging
	function cleanupDragging() {
		if (draggingElement?.parentNode === document.body) {
			document.body.removeChild(draggingElement);
		}
		draggingElement = undefined;
		isMovingPlacedDecoration = false;
	}

	// Handle mouse interactions on the card
	function handleCardInteraction(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.classList.contains('decoration')) {
			startDragging(event);
		}
	}

	onMount(() => {
		document.addEventListener('mousemove', updateDraggingPosition);
		document.addEventListener('mouseup', stopDragging);
		return () => {
			document.removeEventListener('mousemove', updateDraggingPosition);
			document.removeEventListener('mouseup', stopDragging);
		};
	});
</script>

<main>
	<h1>🎄 Christmas Card Creator 🎅</h1>

	<div class="card-creator">
		<div class="decorations">
			<h2>Decorations</h2>
			{#each data.decorations as decoration}
				<button class="decoration-button" on:mousedown={startDragging}>
					<img
						src={decoration.url}
						alt="Decoration {decoration.id}"
						class="decoration"
						draggable="false"
					/>
				</button>
			{/each}
		</div>

		<div
			class="card"
			bind:this={cardContainer}
			on:mousedown={handleCardInteraction}
			role="button"
			tabindex="0"
		>
			<h2>Your Card</h2>
		</div>
	</div>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	h1 {
		text-align: center;
		color: var(--xmas-red);
	}

	.card-creator {
		display: flex;
		gap: 20px;
	}

	.decorations {
		flex: 1;
		padding: 20px;
		background-color: #f0f0f0;
		border-radius: 10px;
	}

	.decoration {
		width: 100px;
		height: 100px;
		object-fit: contain;
		margin: 10px;
		user-select: none;
		-webkit-user-drag: none;
	}

	.decoration-button {
		background: none;
		border: none;
		padding: 0;
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
	}

	.decoration-button:active {
		cursor: grabbing;
	}

	.card {
		flex: 2;
		height: 600px;
		background-color: #ffffff;
		border: 2px solid var(--xmas-red);
		border-radius: 10px;
		position: relative;
		overflow: hidden;
	}

	h2 {
		text-align: center;
		color: var(--xmas-green);
	}
</style>
