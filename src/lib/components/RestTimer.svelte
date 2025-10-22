<script lang="ts">
	let { lastCompletedAt }: { lastCompletedAt: Date } = $props();

	let elapsedMs = $state(0);

	// Effect: Set up and clean up the interval
	$effect(() => {
		const interval = setInterval(() => {
			elapsedMs = new Date().getTime() - lastCompletedAt.getTime();
		}, 1000);

		// Initial calculation
		elapsedMs = new Date().getTime() - lastCompletedAt.getTime();

		// Cleanup function
		return () => {
			clearInterval(interval);
		};
	});

	// Derived: Formatted time (MM:SS)
	const formattedTime = $derived.by(() => {
		const totalSeconds = Math.floor(elapsedMs / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		const pad = (num: number) => String(num).padStart(2, "0");

		return `${pad(minutes)}:${pad(seconds)}`;
	});
</script>

<tr>
	<td class="">Rest</td>
	<td class="" colspan="2">
		<strong class="tabular-nums">{formattedTime}</strong>
	</td>
</tr>
