<script lang="ts">
	import { settings } from "$lib/state/settings.svelte";

	interface Props {
		weight?: number;
	}

	let { weight = 0 }: Props = $props();

	function calculatePlates(targetWeight: number) {
		if (!$settings || targetWeight <= $settings.barWeight) {
			return [];
		}

		let remainingWeight = (targetWeight - $settings.barWeight) / 2;
		const result: { plate: number; count: number }[] = [];

		for (const plate of $settings.availablePlates) {
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
	<div class="flex flex-col mt-1 gap-0 *:py-0 *:my-0">
		{#each plateCalculation as { plate, count }}
			<div
				class="flex text-lg text-gray-400 justify-between gap-1.5 text-nowrap"
			>
				<span class="tabular-nums">{plate}</span>
				<span class="tabular-nums">
					x
					<strong class:text-gray-300={count > 1}>
						{count}
					</strong>
				</span>
			</div>
		{/each}
	</div>
{/if}
