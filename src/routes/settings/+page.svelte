<script lang="ts">
  import { SettingsState } from "./SettingsState.svelte";

  const state = new SettingsState();
</script>

{#if state.settings}
  {JSON.stringify(state.settings, null, 2)}
{/if}

<div>
  <div class="flex justify-between items-center">
    <!-- <h1>Settings for {me?.profile.name}</h1> -->
  </div>
  <div>
    <section>
      <h2>Profile</h2>
      <label for="name">Name</label>
      <input id="name" type="text" placeholder="Set username" />
      <!-- value={me?.profile?.name ?? ""} -->
      <!-- oninput={state.handleNameChange} -->
    </section>

    <section>
      <h2>Preferences</h2>
      <div>
        <label for="weight-unit" class="label">
          <span>Weight Unit</span>
        </label>
        <select id="weight-unit">
          <!-- value={me.root.settings.weightUnit} -->
          <!-- onchange={state.handleUnitChange} -->
          <option value="lbs">Pounds (lbs)</option>
          <option value="kg">Kilograms (kg)</option>
        </select>
      </div>
    </section>
  </div>
</div>
