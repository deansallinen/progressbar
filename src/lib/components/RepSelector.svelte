<script lang="ts">
  import type { ActiveSet } from "$lib/db";

  interface Props {
    set: ActiveSet;
    reps: number;
    onRepsChange: (reps: number) => void;
    onUpdateCompletedReps?: (reps: number) => void;
  }

  let { set, reps, onRepsChange, onUpdateCompletedReps }: Props = $props();

  let editing = $state(false);

  const increment = () => onRepsChange(reps + 1);
  const decrement = () => onRepsChange(Math.max(0, reps - 1));

  const startEditing = () => {
    if (set.completedReps !== undefined) {
      onRepsChange(set.completedReps);
    }
    editing = true;
  };

  const saveEdit = () => {
    if (onUpdateCompletedReps) {
      onUpdateCompletedReps(reps);
    }
    editing = false;
  };
</script>

{#if set.completedAt && !editing}
  <!-- Completed: show result, click to edit -->
  <button
    class="outline secondary"
    onclick={startEditing}
    style="padding: 0; border: none;"
    aria-label="Edit completed reps"
  >
    {#if set.completedReps !== undefined && set.completedReps < set.minReps}
      <span class="text-red-300">
        {set.completedReps} reps
      </span>
    {:else}
      <ins>{set.completedReps} reps</ins>
    {/if}
  </button>
{:else if editing}
  <!-- Editing completed reps -->
  <div class="flex items-center gap-1">
    <button
      class="outline"
      aria-label="Decrement Reps"
      type="button"
      onclick={decrement}
    style="padding: 0; margin: 0; border: none;"
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
      aria-label="Save Reps"
      type="button"
      onclick={saveEdit}
    style="margin: 0;"
    >
      {reps}
    </button>
    <button
      class="outline"
      aria-label="Increment Reps"
      type="button"
      onclick={increment}
    style="padding: 0; margin: 0; border: none;"
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
  <!-- Not completed: show selector -->
  <div class="flex items-center gap-1">
    <button
      class="outline"
      aria-label="Decrement Reps"
      type="button"
      onclick={decrement}
    style="padding: 0; margin: 0; border: none;"
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
    <span class="min-w-8 text-center font-bold">{reps}</span>
    <button
      class="outline"
      aria-label="Increment Reps"
      type="button"
      onclick={increment}
    style="padding: 0; margin: 0; border: none;"
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
