<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	function formatTimestamp(timestamp: string): string {
		return new Date(timestamp).toLocaleString();
	}
</script>

<main>
	<h1>🧝 ElfNet 🎄</h1>

	{#each data.posts as post}
		<div class="post">
			<h2>{post.author}</h2>
			<p class="timestamp">{formatTimestamp(post.timestamp)}</p>
			<p>{post.content}</p>
			<p class="likes">❤️ {post.likes}</p>

			{#if post.comments.length > 0}
				<h3>Comments:</h3>
				{#each post.comments as comment}
					<div class="comment">
						<h4>{comment.author}</h4>
						<p class="timestamp">{formatTimestamp(comment.timestamp)}</p>
						<p>{comment.content}</p>
						<p class="likes">❤️ {comment.likes}</p>
					</div>
				{/each}
			{/if}
		</div>
	{/each}
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: Arial, sans-serif;
	}

	h1 {
		color: #ff0000; /* Assuming --xmas-red is red */
		text-align: center;
		margin-bottom: 20px;
	}

	.post {
		background-color: #f0f0f0;
		border-radius: 10px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.comment {
		background-color: #ffffff;
		border-radius: 5px;
		padding: 10px;
		margin-top: 10px;
	}

	.timestamp {
		color: #666;
		font-size: 0.8em;
	}

	.likes {
		font-weight: bold;
	}

	h2,
	h3,
	h4 {
		margin-bottom: 5px;
	}

	p {
		margin: 5px 0;
	}
</style>
