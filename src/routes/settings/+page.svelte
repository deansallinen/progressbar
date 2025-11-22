<script lang="ts">
  import { exercises } from "$lib/state/exercise.svelte";
  import { db } from "$lib/db";
  import { startNoviceProgram } from "$lib/programs/novice";
  import {
    settings,
    handleNameChange,
    handleUnitChange,
    handleUserWeightChange,
    handleBarWeightChange,
    handlePlatesChange,
    handleExerciseNumberChange,
  } from "$lib/state/settings.svelte";

  async function resetPrograms() {
    if (
      !confirm(
        "Are you sure you want to reset all programs? This cannot be undone.",
      )
    )
      return;

    try {
      await db.programs.clear();
      await startNoviceProgram();
      alert("Programs reset successfully.");
    } catch (e) {
      console.error(e);
      alert(`Error resetting programs: ${e}`);
    }
  }
</script>

<main class="container">
  {#if $settings}
    <div>
      <div class="flex justify-between items-center">
        <h1>Settings for {$settings.userName}</h1>
      </div>
      <div>
        <section>
          <h2>Profile</h2>
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Set username"
            value={$settings.userName}
            oninput={handleNameChange}
          />

          <label for="user-weight">Body Weight ({$settings.weightUnit})</label>
          <input
            id="user-weight"
            type="number"
            placeholder="Set body weight"
            value={$settings.userWeight}
            oninput={handleUserWeightChange}
          />
        </section>

        <section>
          <h2>Preferences</h2>
          <div>
            <label for="weight-unit" class="label">
              <span>Weight Unit</span>
            </label>
            <select
              id="weight-unit"
              value={$settings.weightUnit}
              onchange={handleUnitChange}
            >
              <option value="lbs">Pounds (lbs)</option>
              <option value="kg">Kilograms (kg)</option>
            </select>
          </div>
        </section>

        <section>
          <h2>Equipment</h2>
          <label for="bar-weight">Bar Weight ({$settings.weightUnit})</label>
          <input
            id="bar-weight"
            type="number"
            placeholder="Set bar weight"
            value={$settings.barWeight}
            oninput={handleBarWeightChange}
          />

          <label for="available-plates"
            >Available Plates (comma-separated)</label
          >
          <input
            id="available-plates"
            type="text"
            placeholder="e.g., 45, 25, 10, 5, 2.5"
            value={$settings.availablePlates?.join(", ") ?? ""}
            oninput={handlePlatesChange}
          />
        </section>

        <section>
          <h2>Exercises</h2>
          {#if $exercises}
            {#each $exercises as exercise (exercise.id)}
              <article>
                <h3>{exercise.name}</h3>
                <label for={`working-weight-${exercise.id}`}
                  >Working Weight ({$settings.weightUnit})</label
                >
                <input
                  id={`working-weight-${exercise.id}`}
                  type="number"
                  value={exercise.workingWeight}
                  oninput={handleExerciseNumberChange(
                    exercise.id!,
                    "workingWeight",
                  )}
                />

                <label for={`goal-weight-${exercise.id}`}
                  >Goal Weight ({$settings.weightUnit})</label
                >
                <input
                  id={`goal-weight-${exercise.id}`}
                  type="number"
                  value={exercise.goalWeight}
                  oninput={handleExerciseNumberChange(
                    exercise.id!,
                    "goalWeight",
                  )}
                />

                <label for={`increment-weight-${exercise.id}`}
                  >Increment Weight ({$settings.weightUnit})</label
                >
                <input
                  id={`increment-weight-${exercise.id}`}
                  type="number"
                  value={exercise.incrementWeight}
                  oninput={handleExerciseNumberChange(
                    exercise.id!,
                    "incrementWeight",
                  )}
                />
              </article>
            {/each}
          {/if}
        </section>

        <section>
          <h2>Danger Zone</h2>
          <button class="secondary" onclick={resetPrograms}>
            Reset Program
          </button>
          <p>
            This will delete all existing programs and restore the default
            Novice program.
          </p>
        </section>
      </div>
    </div>
  {/if}
</main>
