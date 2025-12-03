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
  import {
    deloadExercise,
    deloadAllExercises,
    resetExercise,
    resetAllExercises,
    exportDataToCSV,
    importDataFromCSV,
  } from "$lib/functions";

  let fileInput = $state<HTMLInputElement | null>(null);
  let importStatus = $state<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleExport() {
    try {
      await exportDataToCSV();
    } catch (e) {
      console.error(e);
      alert(`Error exporting data: ${e}`);
    }
  }

  async function handleImport() {
    const file = fileInput?.files?.[0];
    if (!file) {
      alert('Please select a file to import.');
      return;
    }

    if (!confirm('This will replace your current data with the imported data. Are you sure?')) {
      return;
    }

    try {
      const result = await importDataFromCSV(file);
      importStatus = { type: result.success ? 'success' : 'error', message: result.message };

      if (result.success && fileInput) {
        // Clear the file input
        fileInput.value = '';
      }
    } catch (e) {
      console.error(e);
      importStatus = { type: 'error', message: `Error importing data: ${e}` };
    }
  }

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

  async function handleDeloadExercise(exerciseId: number, exerciseName: string) {
    if (
      !confirm(
        `Deload ${exerciseName}? This will reduce the working weight by 10%.`,
      )
    )
      return;

    try {
      await deloadExercise(exerciseId);
    } catch (e) {
      console.error(e);
      alert(`Error deloading exercise: ${e}`);
    }
  }

  async function handleResetExercise(exerciseId: number, exerciseName: string) {
    if (
      !confirm(
        `Reset ${exerciseName}? This will reduce the working weight by 10% and reset the stall counter.`,
      )
    )
      return;

    try {
      await resetExercise(exerciseId);
    } catch (e) {
      console.error(e);
      alert(`Error resetting exercise: ${e}`);
    }
  }

  async function handleDeloadAll() {
    if (
      !confirm(
        "Deload all exercises? This will reduce all working weights by 10%. Useful when returning from injury or sickness.",
      )
    )
      return;

    try {
      await deloadAllExercises();
    } catch (e) {
      console.error(e);
      alert(`Error deloading exercises: ${e}`);
    }
  }

  async function handleResetAll() {
    if (
      !confirm(
        "Reset all exercises? This will reduce all working weights by 10% and reset all stall counters. Use this for long layoffs.",
      )
    )
      return;

    try {
      await resetAllExercises();
    } catch (e) {
      console.error(e);
      alert(`Error resetting exercises: ${e}`);
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

                <div class="grid">
                  <button
                    class="secondary outline"
                    onclick={() => handleDeloadExercise(exercise.id!, exercise.name)}
                  >
                    Deload (-10%)
                  </button>
                  <button
                    class="secondary outline"
                    onclick={() => handleResetExercise(exercise.id!, exercise.name)}
                  >
                    Reset (-10% + clear stalls)
                  </button>
                </div>
              </article>
            {/each}
          {/if}
        </section>

        <section>
          <h2>Recovery</h2>
          <p>
            Use these options when returning from injury, sickness, or a layoff.
          </p>
          <div class="grid">
            <button class="secondary outline" onclick={handleDeloadAll}>
              Deload All Exercises
            </button>
            <button class="secondary outline" onclick={handleResetAll}>
              Reset All Exercises
            </button>
          </div>
          <small>
            <strong>Deload:</strong> Reduces all weights by 10% (keeps stall counters).<br />
            <strong>Reset:</strong> Reduces all weights by 10% and clears stall counters.
          </small>
        </section>

        <section>
          <h2>Backup & Restore</h2>
          <p>Export your data as a CSV file for backup, or import a previously exported file.</p>

          <div class="grid">
            <button class="secondary outline" onclick={handleExport}>
              Export Data
            </button>
            <div>
              <input
                type="file"
                accept=".csv"
                bind:this={fileInput}
                style="display: none;"
                onchange={handleImport}
              />
              <button class="secondary outline" onclick={() => fileInput?.click()}>
                Import Data
              </button>
            </div>
          </div>

          {#if importStatus}
            <p class={importStatus.type === 'success' ? 'success' : 'error'}>
              {importStatus.message}
            </p>
          {/if}

          <small>
            <strong>Export:</strong> Downloads a CSV file with all your exercises, settings, and workout history.<br />
            <strong>Import:</strong> Restores data from a previously exported CSV file. This will replace your current data.
          </small>
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
