<script lang="ts">
	import type { UserExercise } from "$lib/db";

	const props: {
		exercise: UserExercise;
	} = $props();
</script>

{#if props.exercise.goalWeight}
	<progress
		value={props.exercise.workingWeight || 0}
		max={props.exercise.goalWeight}
	>
	</progress>
{/if}
