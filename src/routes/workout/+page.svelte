<script lang="ts">
	import { onMount } from "svelte";
	import { resolve } from "$app/paths";
	import { WorkoutStateClass } from "./WorkoutState.svelte";
	import PlateCalculator from "$lib/components/PlateCalculator.svelte";
	import TargetWeight from "$lib/components/TargetWeight.svelte";
	import CompleteSetButton from "$lib/components/CompleteSetButton.svelte";

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

			<hr />

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
							<!-- <pre> -->
							<!-- 	{JSON.stringify(exercise, null, 2)} -->
							<!-- </pre> -->
							<h2>{exercise.name}</h2>
							<TargetWeight {exercise} {state} />

							<table>
								<thead>
									<tr>
										<th>Set</th>
										<th>Target</th>
										<th>Completed Reps</th>
									</tr>
								</thead>
								<tbody>
									{#if exercise.warmup}
										<tr>
											<td>{0}</td>
											<td>
												<strong>
													{state.barWeight}
												</strong>
												{state.weightUnit}
											</td>
											<td>10 reps for warmup</td>
										</tr>
									{/if}
									{#if exercise.sets}
										{#each exercise.sets as set, setIndex}
											{#if set}
												{@const setWeight = state.calculateSetWeight(
													set,
													state.getWorkingWeight(exercise.slug),
												)}
												<tr>
													<td>{setIndex + 1}</td>
													<td>
														<div class="flex flex-col gap-1">
															<span>
																<strong>{setWeight}</strong>
																{state.weightUnit}
																<!-- x {set.targetReps} reps -->
															</span>
															<PlateCalculator weight={setWeight} />
														</div>
													</td>
													<td>
														<CompleteSetButton
															{state}
															{set}
															{exercise}
															{setIndex}
														/>
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
	{/if}
</main>
