<script lang="ts">
	import type { UserExercise } from "$lib/db";

	const props: {
		exercise: UserExercise;
	} = $props();
</script>

<progress value={props.exercise.workingWeight} max={props.exercise.goalWeight}>
</progress>
