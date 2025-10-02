<script lang="ts">
	interface Props {
		weight?: number;
	}
	let { weight = 0 }: Props = $props();

	const barWeight = 45;
	const plates = [45, 35, 25, 10, 5, 2.5];

	function calculatePlates(targetWeight: number) {
		if (targetWeight <= barWeight) {
			return [];
		}

		let remainingWeight = (targetWeight - barWeight) / 2;
		const result: { plate: number; count: number }[] = [];

		for (const plate of plates) {
			if (remainingWeight >= plate) {
				const count = Math.floor(remainingWeight / plate);
				result.push({ plate, count });
				remainingWeight -= count * plate;
			}
		}

		return result;
	}

	let plateCalculation = $derived(calculatePlates(weight));
</script>

{#if plateCalculation.length > 0}
	<div class="flex flex-col gap-0 *:mb-0 *:py-0 *:text-gray-400">
		{#each plateCalculation as { plate, count }}
			<div class="flex gap-1 text-nowrap tabular-nums">
				<span>{plate}</span><span> x{count}</span>
			</div>
		{/each}
	</div>
{/if}
