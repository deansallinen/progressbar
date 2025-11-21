<script lang="ts">
	import { resolve } from "$app/paths";
	import { db } from "$lib/db";
	import { getActiveProgram } from "$lib/state/program.svelte";
	import { exercises } from "$lib/state/exercise.svelte";
	import ExerciseProgress from "$lib/components/ExerciseProgress.svelte";

	const program = await getActiveProgram();
	const activeWorkout = await db.activeWorkout.get(1);
	const workoutHistory = await db.workoutHistory.toArray();
</script>

<main class="container">
	<section>
		<div class="flex justify-between items-baseline">
			<h2>Active Program</h2>
		</div>

		{#if program}
			<article>
				<header>
					<hgroup>
						<h3>{program.name}</h3>
						<p>{program.phases[program.currentPhaseIndex].name}</p>
					</hgroup>
					<p>{workoutHistory.length} workouts completed</p>
				</header>

				{#if activeWorkout}
					<p>Continue {activeWorkout.name}</p>
					<footer>
						<a href={resolve("/workout")} role="button">Continue</a>
					</footer>
				{:else}
					{@const currentPhase = program.phases[program.currentPhaseIndex]}
					{@const workout = currentPhase.workouts[program.nextWorkoutIndex]}
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
			</article>
		{/if}
	</section>

	<section>
		<h2>Progress</h2>
		<article>
			<ul>
				{#each $exercises as exercise}
					<li style="list-style-type:none;">
						<h3>
							{exercise.name}
						</h3>
						<ExerciseProgress {exercise} />
						<!-- <progress value={exercise.workingWeight} max={exercise.goalWeight}> -->
						<!-- </progress> -->
					</li>
				{/each}
			</ul>
		</article>
	</section>
</main>
