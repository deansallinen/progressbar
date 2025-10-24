<script lang="ts">
  import { db, type ActiveExercise } from "$lib/db";
  import { updateActiveWorkoutSets } from "$lib/state/workout.svelte";
  import { liveQuery } from "dexie";

  interface Props {
    exercise: ActiveExercise;
  }

  const { exercise }: Props = $props();

  const setWorkingWeight = async (
    exerciseId: number,
    workingWeight: number,
  ) => {
    await db.exercises.update(exerciseId, { workingWeight });
    await updateActiveWorkoutSets(exerciseId, workingWeight);
  };

  const workingWeight = liveQuery(() =>
    db.exercises.get(exercise.exerciseId).then((e) => e?.workingWeight),
  );

  let editing = $state(false);
</script>

{#if editing}
  <div class="flex items-center justify-end gap-2 flex-1">
    <input
      class=""
      id="{exercise.exerciseId}-weight"
      type="number"
      disabled={!editing}
      value={$workingWeight}
      oninput={(e) => {
        setWorkingWeight(exercise.exerciseId, e.currentTarget.valueAsNumber);
      }}
      min="0"
      step="5"
    />
    <button
      aria-label="Finish editing working weight"
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
  </div>
{:else}
  <button
    onclick={() => (editing = !editing)}
    type="button"
    class="outline secondary"
    aria-label="Edit working weight"
    style="padding: 0; border:none;"
  >
    <span class="text-md text-gray-400">
      @ {$workingWeight}
    </span>
  </button>
{/if}
