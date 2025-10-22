<script lang="ts">
	import { db } from "$lib/db";
	import { programs, startProgram } from "$lib/state/program.svelte";

	const getExerciseName = async (exerciseId: number) => {
		const exercise = await db.exercises.get(exerciseId);
		return exercise!.name;
	};
</script>

<main class="container">
	<h1>Browse Programs</h1>
	<p>Select a program to view its details and get started.</p>

	{#each $programs as program}
		{#if program}
			<article>
				<header>
					<hgroup>
						<h2>{program.name}</h2>
						<p>{program.workouts.length} workouts</p>
					</hgroup>
				</header>

				<p>{program.description}</p>

				<div class="grid">
					{#each program.workouts as workout}
						<div>
							<h3>{workout.name}</h3>
							<ul>
								{#each workout.exercises as exercise}
									<li>{await getExerciseName(exercise.exerciseId)}</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
				<footer>
					<button onclick={() => startProgram(program.id)}>
						Start This Program
					</button>
				</footer>
			</article>
		{/if}
	{/each}
</main>
