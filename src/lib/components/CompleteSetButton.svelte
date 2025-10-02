<script lang="ts">
  import type { ExerciseSet } from "$lib/schema";
  import type { WorkoutStateClass } from "../../routes/workout/WorkoutState.svelte";

  interface Props {
    state: WorkoutStateClass;
    exercise: {
      name: string;
      slug: string;
    };
    setIndex: number;
    set: ExerciseSet;
  }

  const {
    exercise,
    state: WorkoutState,
    set: exerciseSet,
    setIndex,
  }: Props = $props();

  let editing = $state(false);
</script>

<!-- {JSON.stringify(exerciseSet, null, 2)} -->

{#if !exerciseSet.completedReps}
  {#if !editing}
    <!-- Default view -->
    <div class="flex items-center gap-2">
      <input
        type="number"
        class="w-0"
        readonly
        placeholder={`${exerciseSet.targetReps} reps`}
        oninput={(e) => {
          if (!WorkoutState) return;
          WorkoutState.updateCompletedReps(
            exercise.slug,
            setIndex,
            e.currentTarget.valueAsNumber,
          );
        }}
      />
      <button
        class="outline secondary"
        type="button"
        onclick={() => (editing = !editing)}
        aria-label="Edit Reps"
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
          class="lucide lucide-pencil-icon lucide-pencil"
          ><path
            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
          /><path d="m15 5 4 4" /></svg
        >
      </button>
      <button
        aria-label="Complete Reps"
        type="button"
        onclick={() => {
          exerciseSet.$jazz.set("completedReps", exerciseSet.targetReps);
        }}
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
          class="lucide lucide-check-icon lucide-check"
          ><path d="M20 6 9 17l-5-5" /></svg
        >
      </button>
    </div>
  {:else}
    <!-- Editing -->
    <div class="flex gap-2 items-center">
      <input
        type="number"
        placeholder="Enter reps"
        required
        oninput={(e) => {
          exerciseSet.$jazz.set("completedReps", e.currentTarget.valueAsNumber);
        }}
      />
      <button
        aria-label="Complete Reps"
        type="button"
        class="secondary outline"
        onclick={() => (editing = !editing)}
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
    </div>
  {/if}
{:else if exerciseSet.completedReps}
  <span class="badge success">{exerciseSet.completedReps} reps</span>
{:else}
  <span class="badge warning">In Progress</span>
{/if}
