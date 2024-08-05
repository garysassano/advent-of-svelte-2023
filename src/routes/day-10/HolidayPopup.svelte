<script lang="ts">
	export let dialog: HTMLDialogElement;

	function handleClose() {
		dialog.close();
	}
</script>

<dialog bind:this={dialog} onclose={handleClose}>
	<div class="popup-content">
		<button class="close-button" onclick={handleClose}>&times;</button>
		<div class="santa-emoji">🎅</div>
		<h2>Merry Christmas!</h2>
		<p>
			Ho ho ho! Wishing you a joyful holiday season filled with love, laughter, and festive cheer!
		</p>
	</div>
</dialog>

<style>
	/* Dialog styles */
	dialog {
		padding: 0;
		border: none;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}

	/* Content styles */
	.popup-content {
		background-color: white;
		padding: 2rem;
		text-align: center;
		max-width: 400px;
		position: relative;
	}

	/* Close button styles */
	.close-button {
		position: absolute;
		top: 15px;
		right: 15px;
		background: none;
		border: none;
		font-size: 36px;
		cursor: pointer;
		color: #333;
		padding: 0;
		width: 36px;
		height: 36px;
		line-height: 36px;
		text-align: center;
		outline: none;
	}

	.close-button:focus {
		outline: none;
	}

	/* Content element styles */
	.santa-emoji {
		font-size: 100px;
		margin-bottom: 1rem;
	}

	h2 {
		color: var(--xmas-red);
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	p {
		color: #333;
		margin-bottom: 1rem;
	}
</style>
