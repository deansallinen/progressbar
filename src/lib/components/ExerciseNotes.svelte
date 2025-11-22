<script lang="ts">
	import { db, type UserExercise } from "$lib/db";
	import { liveQuery } from "dexie";

	const props: {
		exercise: UserExercise;
	} = $props();

	let editing = $state(false);
	const toggleEditing = () => (editing = !editing);

	const setNoteText = async (text: string) => {
		await db.exercises.update(props.exercise.id, { note: text });
	};

	const noteText = liveQuery(() =>
		db.exercises.get(props.exercise.id).then((e) => e?.note),
	);
</script>

{#if editing}
	<div>
		Notes
		<span class="flex items-start gap-2">
			<input
				type="text"
				value={$noteText}
				oninput={(e) => {
					setNoteText(e.currentTarget.value);
				}}
			/>
			<button onclick={toggleEditing}>Done</button>
		</span>
	</div>
{:else}
	<button
		class="secondary outline"
		style="padding: 0; border:none;"
		onclick={toggleEditing}>Notes: <span>{$noteText}</span></button
	>
{/if}
