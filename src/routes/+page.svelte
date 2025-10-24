<script lang="ts">
	import { resolve } from "$app/paths";
	import { db } from "$lib/db";
	import { getActiveProgram } from "$lib/state/program.svelte";
	import { getWorkoutSnapshot } from "$lib/state/workout.svelte";

	const program = await getActiveProgram();
	const activeWorkout = await getWorkoutSnapshot();
</script>

<main class="container">
	<h1>Dashboard</h1>

	<div class="flex justify-between items-baseline">
		<h2>My Programs</h2>
		<a href={resolve("/programs")}>All programs</a>
	</div>
	{#if program}
		<article>
			<header>
				<h3>{program.name}</h3>
			</header>

			{#if activeWorkout}
				<p>Continue {activeWorkout.name}</p>
				<footer>
					<a href={resolve("/workout")} role="button">Continue</a>
				</footer>
			{:else}
				{@const workout = program.workouts[program.nextWorkoutIndex]}
				<p>Next workout: {workout.name}</p>

				<ul class="ml-4">
					{#each workout.exercises as { exerciseId }}
						{@const exercise = await db.exercises.get(exerciseId)}
						<li>{exercise?.name} @ {exercise?.workingWeight}</li>
					{/each}
				</ul>

				<footer>
					<a href={resolve("/workout")} role="button">Start workout</a>
				</footer>
			{/if}
		</article>
	{:else}
		<article>
			<header>
				<h2>Welcome to ProgressBar!</h2>
			</header>
			<footer>
				<a href={resolve("/programs")} role="button">Browse Programs</a>
			</footer>
		</article>
	{/if}
</main>
