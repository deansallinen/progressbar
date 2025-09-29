<script lang="ts">
	import { AccountCoState } from "jazz-tools/svelte";
	import {
		Program,
		Workout,
		Exercise,
		ExerciseSet,
		JazzAccount,
	} from "$lib/schema";

	// Subscribe to the current user's account data.
	// We need to resolve `root.programs` so we know where to save the new program.
	const account = new AccountCoState(JazzAccount, {
		resolve: { root: { programs: true } },
	});
	const me = $derived(account.current);

	// Helper function to create a fresh, empty program structure.
	// We use Program.create() so that the nested `workouts` list is a CoList,
	// allowing us to use methods like `$jazz.push()`.
	function createNewProgramState() {
		return Program.create({
			name: "New Training Program",
			description: "",
			workouts: [],
		});
	}

	// Use $state to hold the program being built. It's not saved to the
	// user's account until they click the "Save Program" button.
	let newProgram = $state(createNewProgramState());

	// --- Functions to modify the newProgram state ---

	function addWorkout() {
		newProgram.workouts.$jazz.push(
			Workout.create({
				name: `Workout ${newProgram.workouts.length + 1}`,
				exercises: [],
			}),
		);
	}

	function removeWorkout(workoutIndex: number) {
		newProgram.workouts.$jazz.splice(workoutIndex, 1);
	}

	function addExercise(workout: ReturnType<typeof Workout.create>) {
		workout.exercises.$jazz.push(
			Exercise.create({
				name: `Exercise ${workout.exercises.length + 1}`,
				sets: [],
			}),
		);
	}

	function removeExercise(
		workout: ReturnType<typeof Workout.create>,
		exerciseIndex: number,
	) {
		workout.exercises.$jazz.splice(exerciseIndex, 1);
	}

	function addSet(exercise: ReturnType<typeof Exercise.create>) {
		exercise.sets.$jazz.push(
			ExerciseSet.create({
				weight: 0,
				targetReps: 8,
			}),
		);
	}

	function removeSet(
		exercise: ReturnType<typeof Exercise.create>,
		setIndex: number,
	) {
		exercise.sets.$jazz.splice(setIndex, 1);
	}

	function saveProgram() {
		if (!me) {
			alert("Error: User not loaded.");
			return;
		}
		// Add the fully constructed program to the user's main list.
		me.root.programs.$jazz.push(newProgram);

		alert(`Program "${newProgram.name}" saved!`);

		// Reset the form for the next program.
		newProgram = createNewProgramState();
	}
</script>

<h1>Create New Program</h1>

{#if !me}
	<p>Loading user data...</p>
{:else}
	<form onsubmit={saveProgram}>
		<fieldset>
			<legend>Program Details</legend>
			<div>
				<label for="program-name">Program Name</label>
				<input
					id="program-name"
					type="text"
					value={newProgram.name}
					oninput={(e) => newProgram.$jazz.set("name", e.currentTarget.value)}
					required
				/>
			</div>
			<div>
				<label for="program-desc">Description</label>
				<textarea
					id="program-desc"
					rows="3"
					value={newProgram.description}
					oninput={(e) =>
						newProgram.$jazz.set("description", e.currentTarget.value)}
				></textarea>
			</div>
		</fieldset>

		<section>
			<h2>Workouts</h2>
			{#each newProgram.workouts as workout, workoutIndex}
				<fieldset>
					<legend>
						<label for="workout-name-{workoutIndex}">Workout Name</label>
						<input
							id="workout-name-{workoutIndex}"
							type="text"
							value={workout.name}
							oninput={(e) => workout.$jazz.set("name", e.currentTarget.value)}
						/>
					</legend>
					<button type="button" onclick={() => removeWorkout(workoutIndex)}
						>Remove Workout</button
					>

					<section>
						<h3>Exercises</h3>
						{#each workout.exercises as exercise, exerciseIndex}
							<fieldset>
								<legend>
									<label for="exercise-name-{workoutIndex}-{exerciseIndex}"
										>Exercise Name</label
									>
									<input
										id="exercise-name-{workoutIndex}-{exerciseIndex}"
										type="text"
										value={exercise.name}
										oninput={(e) =>
											exercise.$jazz.set("name", e.currentTarget.value)}
									/>
								</legend>
								<button
									type="button"
									onclick={() => removeExercise(workout, exerciseIndex)}
									>Remove Exercise</button
								>

								<h4>Sets</h4>
								<ol>
									{#each exercise.sets as set, setIndex}
										<li>
											<label
												>Weight:
												<input
													type="number"
													value={set.weight}
													oninput={(e) =>
														set.$jazz.set(
															"weight",
															e.currentTarget.valueAsNumber,
														)}
												/>
											</label>
											<label
												>Reps:
												<input
													type="number"
													value={set.targetReps}
													oninput={(e) =>
														set.$jazz.set(
															"targetReps",
															e.currentTarget.valueAsNumber,
														)}
												/>
											</label>
											<button
												type="button"
												onclick={() => removeSet(exercise, setIndex)}
												>Remove Set</button
											>
										</li>
									{/each}
								</ol>
								<button type="button" onclick={() => addSet(exercise)}
									>Add Set</button
								>
							</fieldset>
						{/each}
						<button type="button" onclick={() => addExercise(workout)}
							>Add Exercise</button
						>
					</section>
				</fieldset>
			{/each}
			<button type="button" onclick={addWorkout}>Add Workout</button>
		</section>

		<footer>
			<button type="submit">Save Program</button>
		</footer>
	</form>
{/if}
