<script lang="ts">
	import {
		JazzAccount,
		UserProgramInstance,
		UserExerciseState,
		type Program,
	} from "$lib/schema";
	import { AccountCoState } from "jazz-tools/svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { resolve } from "$app/paths";

	const account = new AccountCoState(JazzAccount, {
		resolve: { root: { programs: true, activeProgram: true } },
	});
	const me = $derived(account.current);

	const programId = page.params.programId;

	const program = $derived(
		me?.root.programs.find((p) => p?.$jazz.id === programId) as
			| Program
			| undefined,
	);

	function startProgram() {
		if (!me || !program || !programId) {
			alert("Error: User or program not loaded.");
			return;
		}

		// Create initial state for all unique exercises in the program
		const exerciseSlugs = new Set<string>();
		if (program.workouts) {
			for (const workout of program.workouts) {
				if (!workout?.exercises) continue;
				for (const exercise of workout.exercises) {
					if (exercise) {
						exerciseSlugs.add(exercise.slug);
					}
				}
			}
		}

		const initialExerciseStates = [...exerciseSlugs].map((slug) => {
			return UserExerciseState.create({
				exerciseSlug: slug,
				// Default starting weight, adjust as needed
				currentWorkingWeight: 45,
			});
		});

		const firstWorkout = program.workouts?.[0];
		if (!firstWorkout) {
			alert("Error: Program has no workouts.");
			return;
		}

		const newProgramInstance = UserProgramInstance.create({
			programDefinitionId: programId,
			exerciseStates: initialExerciseStates,
			nextWorkoutSlug: firstWorkout.slug,
		});

		me.root.$jazz.set("activeProgram", newProgramInstance);

		alert(`Program "${program.name}" started!`);
		goto(`/`);
	}
</script>

<main>
	{#if !program}
		<h1>Program not found</h1>
		<p>
			Could not find a program with the ID "{programId}".
		</p>
		<a href={resolve("/programs")}>Back to Programs</a>
	{:else}
		<h1>{program.name}</h1>
		<p>{program.description}</p>

		{#if program.workouts}
			{#each program.workouts as workout}
				{#if workout}
					<article>
						<header>
							<h3>{workout.name}</h3>
						</header>
						<ul>
							{#if workout.exercises}
								{#each workout.exercises as exercise}
									{#if exercise}
										<li>{exercise.name}</li>
									{/if}
								{/each}
							{/if}
						</ul>
					</article>
				{/if}
			{/each}
		{/if}

		<button onclick={startProgram}>Start This Program</button>
	{/if}
</main>
