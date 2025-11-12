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
	<td style="text-align:center;" colspan="3">
		<div class="flex flex-col jutify-right">
			<span class="text-sm">Rest</span>
			<strong class="text-5xl tabular-nums">{formattedTime}</strong>
		</div>
	</td>
</tr>
