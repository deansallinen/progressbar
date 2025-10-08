<script lang="ts">
  import { SettingsState } from "./SettingsState.svelte";

  const { settings, handleNameChange, handleUnitChange } = new SettingsState();
</script>

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
    </div>
  </div>
{/if}
