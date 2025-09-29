<script lang="ts">
	import { onMount } from "svelte";
	import { WorkoutStateClass } from "./WorkoutState.svelte";
	import PlateCalculator from "$lib/components/PlateCalculator.svelte";
	import { resolve } from "$app/paths";

	let state = $state<WorkoutStateClass | null>(null);

	onMount(() => {
		state = new WorkoutStateClass();
	});

	const currentWorkout = $derived(state?.currentWorkout);
	const activeProgram = $derived(state?.activeProgram);
</script>

<main>
	{#if state}
		{#if !currentWorkout || !activeProgram}
			<h1>Workout not found</h1>
			<p>
				Could not load your current workout. Please check your program status.
			</p>
			<a href={resolve("/")}>Back to Dashboard</a>
		{:else}
			<h1>{currentWorkout.name}</h1>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					if (!state) return;
					state.completeWorkout();
				}}
			>
				{#if currentWorkout.exercises}
					{#each currentWorkout.exercises as exercise}
						{#if exercise}
							{@const workingWeight = state.getWorkingWeight(exercise.slug)}
							<fieldset>
								<legend>{exercise.name}</legend>
								<div
									style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;"
								>
									<label for="{exercise.slug}-weight"
										>Target Working Weight (lbs):</label
									>
									<input
										id="{exercise.slug}-weight"
										type="number"
										value={workingWeight}
										oninput={(e) => {
											if (!state) return;
											state.updateWorkingWeight(
												exercise.slug,
												e.currentTarget.valueAsNumber,
											);
										}}
										min="0"
										step="5"
										style="width: 8rem;"
									/>
								</div>
								<table>
									<thead>
										<tr>
											<th>Set</th>
											<th>Target</th>
											<th>Completed Reps</th>
										</tr>
									</thead>
									<tbody>
										{#if exercise.sets}
											{#each exercise.sets as set, setIndex}
												{#if set}
													{@const setWeight = state.calculateSetWeight(
														set,
														workingWeight,
													)}
													<tr>
														<td>{setIndex + 1}</td>
														<td>
															{setWeight} lbs x
															{set.targetReps}
															reps
															<PlateCalculator weight={setWeight} />
														</td>
														<td>
															<input
																type="number"
																placeholder="Reps"
																oninput={(e) => {
																	if (!state) return;
																	state.updateCompletedReps(
																		exercise.slug,
																		setIndex,
																		e.currentTarget.valueAsNumber,
																	);
																}}
																required
															/>
														</td>
													</tr>
												{/if}
											{/each}
										{/if}
									</tbody>
								</table>
							</fieldset>
						{/if}
					{/each}
				{/if}

				<button type="submit">Complete Workout</button>
			</form>
		{/if}
	{/if}
</main>
