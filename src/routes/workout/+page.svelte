<script lang="ts">
	import PlateCalculator from "$lib/components/PlateCalculator.svelte";
	import TargetWeight from "$lib/components/TargetWeight.svelte";
	import CompleteSetButton from "$lib/components/CompleteSetButton.svelte";
	import RestTimer from "$lib/components/RestTimer.svelte";
	import { settings } from "$lib/state/settings.svelte";
	import { onMount } from "svelte";
	import ExerciseProgress from "$lib/components/ExerciseProgress.svelte";
	import ExerciseNotes from "$lib/components/ExerciseNotes.svelte";
	import { completeSet, completeWorkout } from "$lib/functions";
	import { createActiveWorkout } from "$lib/functions/createActiveWorkout";
	import { liveQuery } from "dexie";
	import { db } from "$lib/db";

	const activeWorkoutStore = liveQuery(() => db.activeWorkout.get(1));
	const workout = $derived($activeWorkoutStore);

	onMount(() => {
		if (!workout) createActiveWorkout();
	});
</script>

<main class="container pb-12">
	{#if workout}
		<h1>{workout.name}</h1>
		<hr />
		{#each workout.exercises as exercise, exerciseIndex}
			{#if exercise}
				{@const userExercise = await db.exercises.get(exercise.exerciseId)}
				<section>
					<div class="flex gap-2 items-baseline">
						<h2>{exercise.name}</h2>
						<TargetWeight {exercise} />
					</div>
					{#if userExercise}
						<ExerciseProgress exercise={userExercise} />
						<ExerciseNotes exercise={userExercise} />
					{/if}
					<table>
						<thead>
							<tr class="">
								<th>Set</th>
								<th>Weight</th>
								<th>Reps</th>
								<th style="text-align:right;">Completed</th>
							</tr>
						</thead>
						<tbody>
							{#if exercise.sets}
								{#each exercise.sets as set, setIndex}
									{#if set}
										<tr>
											<td class="align-top">{setIndex + 1}</td>
											<td class="align-top">
												<div class="">
													<span class="text-nowrap">
														<strong class="text-xl">{set.targetWeight}</strong>
														{#if $settings}
															{$settings.weightUnit}
														{/if}
													</span>
													{#if !set.completedAt}
														<PlateCalculator weight={set.targetWeight} />
													{/if}
												</div>
											</td>
											<td class="align-top">
												{#if set.targetReps === Infinity}
													AMRAP
												{:else}
													{set.targetReps} reps
												{/if}
											</td>
											<td class="align-top">
												<CompleteSetButton
													{set}
													onCompleteSet={(reps) =>
														completeSet(exerciseIndex, setIndex, reps)}
												/>
											</td>
										</tr>
										{#if set.completedAt && setIndex < exercise.sets.length - 1 && !exercise.sets[setIndex + 1].completedAt}
											<RestTimer lastCompletedAt={set.completedAt} />
										{/if}
									{/if}
								{/each}
							{/if}
						</tbody>
					</table>
				</section>
			{/if}
		{/each}
		<button class="w-full" onclick={completeWorkout}>Complete Workout</button>
	{/if}
</main>
