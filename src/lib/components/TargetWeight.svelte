<script lang="ts">
  import type { WorkoutStateClass } from "../../routes/workout/WorkoutState.svelte";

  interface Props {
    exercise: {
      name: string;
      slug: string;
    };
    state: WorkoutStateClass;
  }

  const { exercise, state: WorkoutState }: Props = $props();

  let editing = $state(false);
</script>

<div class="flex items-center justify-start gap-2">
  <label for="{exercise.slug}-weight" class="shrink-0"
    >Target Working Weight</label
  >
  <input
    class=""
    id="{exercise.slug}-weight"
    type="number"
    disabled={!editing}
    value={WorkoutState.getWorkingWeight(exercise.slug)}
    oninput={(e) => {
      if (!WorkoutState) return;
      WorkoutState.updateWorkingWeight(
        exercise.slug,
        e.currentTarget.valueAsNumber,
      );
    }}
    min="0"
    step="5"
  />
  {#if !editing}
    <button
      onclick={() => (editing = !editing)}
      type="button"
      class="outline secondary"
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
  {:else}
    <button
      aria-label="Complete Reps"
      type="button"
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
        class="lucide lucide-check-icon lucide-check"
        ><path d="M20 6 9 17l-5-5" /></svg
      >
    </button>
  {/if}
</div>
