<script lang="ts">
	import type { ActiveSet } from "$lib/db";

	let { set, onCompleteSet } = $props<{
		set: ActiveSet;
		onCompleteSet: (reps: number) => void;
	}>();

	let completedReps = $state(set.targetReps);
	let editing = $state(false);

	const handleComplete = (e: Event) => {
		e.preventDefault();
		editing = false;
		onCompleteSet(completedReps);
	};

	const handleCancel = (e: Event) => {
		e.preventDefault();
		completedReps = set.targetReps;
		editing = false;
	};

	const toggleEditing = () => (editing = !editing);
</script>

{#if set.completedReps && !editing}
	<div class="flex justify-end">
		<button
			class="outline secondary"
			onclick={toggleEditing}
			style="padding: 0; border:none;"
		>
			{#if set.completedReps < set.targetReps}
				<span class="text-red-300">
					{set.completedReps} reps
				</span>
			{:else}
				<ins>
					{set.completedReps} reps
				</ins>
			{/if}
		</button>
	</div>
{:else if editing}
	<!-- Editing -->
	<div class="flex gap-2 items-center">
		<input
			type="number"
			placeholder="Enter reps"
			value={set.completedReps || set.targetReps}
			required
			oninput={(e) => {
				e.preventDefault();
				completedReps = e.currentTarget.valueAsNumber;
			}}
		/>
		<button
			aria-label="Cancel editing"
			type="button"
			class="secondary outline"
			onclick={handleCancel}
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
				class="lucide lucide-x-icon lucide-x"
				><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
			>
		</button>
		<button aria-label="Complete Reps" type="button" onclick={handleComplete}>
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
				class="lucide lucide-check-icon lucide-check"
				><path d="M20 6 9 17l-5-5" /></svg
			>
		</button>
	</div>
{:else}
	<!-- Default view -->
	<div class="flex items-center gap-2">
		<input
			type="number"
			class="w-0"
			readonly
			placeholder={`${completedReps} reps`}
			onclick={() => (editing = !editing)}
		/>
		<button aria-label="Complete Reps" type="button" onclick={handleComplete}>
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
				class="lucide lucide-check-icon lucide-check"
				><path d="M20 6 9 17l-5-5" /></svg
			>
		</button>
	</div>
{/if}
