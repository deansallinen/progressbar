<script lang="ts">
  import type { ActiveSet } from "$lib/db";

  interface Props {
    set: ActiveSet;
    onCompleteSet: () => void;
  }

  let { set, onCompleteSet }: Props = $props();
</script>

{#if set.completedAt}
  <!-- Already completed -->
  <div class="flex justify-end">
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
      class="lucide lucide-check text-green-500"
      ><path d="M20 6 9 17l-5-5" /></svg
    >
  </div>
{:else}
  <!-- Not completed: show checkmark button -->
  <div class="flex justify-end">
    <button
      class="outline"
      aria-label="Complete Set"
      type="button"
      onclick={onCompleteSet}
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
        class="lucide lucide-check"
        ><path d="M20 6 9 17l-5-5" /></svg
      >
    </button>
  </div>
{/if}
