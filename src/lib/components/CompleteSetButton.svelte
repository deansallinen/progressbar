<script lang="ts">
	import type { ActiveSet } from "$lib/db";

	interface Props {
		set: ActiveSet;
		onCompleteSet: (reps: number) => void;
	}

	let { set, onCompleteSet }: Props = $props();

	let workingReps = $state(set.targetReps === Infinity ? 10 : set.targetReps);
	let editing = $state(false);

	const handleComplete = (e: Event) => {
		e.preventDefault();
		editing = false;
		onCompleteSet(workingReps);
	};

	const toggleEditing = () => (editing = !editing);
</script>

{#if set.completedReps !== undefined && !editing}
	<div class="flex justify-end">
		<button
			class="outline secondary"
			onclick={toggleEditing}
			style="padding: 0; border:none;"
		>
			{#if set.completedReps < set.minReps}
				<span class="text-red-300">
					{set.completedReps} reps of {set.minReps}
				</span>
			{:else}
				<ins>
					{set.completedReps} reps
				</ins>
			{/if}
		</button>
	</div>
{:else if editing}
	<div class="flex justify-end items-center gap-2">
		<button
			class="outline"
			aria-label="Decrement Reps"
			type="button"
			onclick={() => workingReps--}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14" /></svg
			>
		</button>
		<button
			class="min-w-12"
			aria-label="Complete Reps"
			type="button"
			onclick={handleComplete}
		>
			{workingReps}
		</button>
		<button
			class="outline"
			aria-label="Increment Reps"
			type="button"
			onclick={() => workingReps++}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-plus-icon lucide-plus"
				><path d="M5 12h14" /><path d="M12 5v14" /></svg
			>
		</button>
	</div>
{:else}
	<!-- Default view -->
	<div class="flex justify-end items-center gap-2">
		<button
			class="outline"
			aria-label="Decrement Reps"
			type="button"
			onclick={() => workingReps--}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14" /></svg
			>
		</button>
		<button
			class="min-w-12"
			aria-label="Complete Reps"
			type="button"
			onclick={handleComplete}
		>
			{workingReps}
		</button>
		<button
			class="outline"
			aria-label="Increment Reps"
			type="button"
			onclick={() => workingReps++}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-plus-icon lucide-plus"
				><path d="M5 12h14" /><path d="M12 5v14" /></svg
			>
		</button>
	</div>
{/if}
