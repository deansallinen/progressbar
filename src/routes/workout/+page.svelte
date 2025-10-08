<script lang="ts">
	import { resolve } from "$app/paths";
	import { WorkoutStateClass } from "./WorkoutState.svelte";
	import PlateCalculator from "$lib/components/PlateCalculator.svelte";
	import TargetWeight from "$lib/components/TargetWeight.svelte";
	import CompleteSetButton from "$lib/components/CompleteSetButton.svelte";
	import { onMount } from "svelte";
	import { db } from "../../db";
	import { liveQuery } from "dexie";
	import { getSettingsState } from "../settings/SettingsState.svelte";

	const { settings } = getSettingsState();

	let program;

	onMount(() => {
		program = liveQuery(() => db.programs.get($settings.activeProgramId));
	});
</script>

<main>
	{#if activeWorkout}
		<h1>{activeWorkout.workoutName}</h1>
		<hr />
		<form
			onsubmit={(e) => {
				e.preventDefault();
				// if (!workoutState) return;
				console.log("workout completed");
				// workoutState.completeWorkout();
			}}
		>
			{#if activeWorkout.exercises}
				{#each activeWorkout.exercises as exercise}
					{#if exercise}
						<!-- <pre> -->
						<!-- 		{JSON.stringify(exercise, null, 2)} -->
						<!-- 	</pre> -->
						<h2>{exercise.definition.name}</h2>
						<TargetWeight exercise={exercise.definition} />
						<table>
							<thead>
								<tr>
									<th>Set</th>
									<th>Target</th>
									<th>Completed Reps</th>
								</tr>
							</thead>
							<tbody>
								<!-- {#if exercise.definition.warmup} -->
								<!-- 	<tr> -->
								<!-- 		<td>{0}</td> -->
								<!-- 		<td> -->
								<!-- 			<strong> -->
								<!-- 				{state.barWeight} -->
								<!-- 			</strong> -->
								<!-- 			{state.weightUnit} -->
								<!-- 		</td> -->
								<!-- 		<td>10 reps for warmup</td> -->
								<!-- 	</tr> -->
								<!-- {/if} -->
								{#if exercise.sets}
									{#each exercise.sets as set, setIndex}
										{#if set}
											<tr>
												<td>{setIndex + 1}</td>
												<td>
													<div class="">
														<span class="text-nowrap">
															<strong>{set.targetWeight}</strong>
															{activeWorkout.weightUnit}
														</span>
														<PlateCalculator weight={set.targetWeight} />
													</div>
												</td>
												<td>
													<!-- <CompleteSetButton -->
													<!-- 	{state} -->
													<!-- 	{set} -->
													<!-- 	{exercise} -->
													<!-- 	{setIndex} -->
													<!-- /> -->
												</td>
											</tr>
										{/if}
									{/each}
								{/if}
							</tbody>
						</table>
					{/if}
				{/each}
			{/if}
			<button type="submit">Complete Workout</button>
		</form>
	{/if}
</main>
