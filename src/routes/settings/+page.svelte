<script lang="ts">
  import { SettingsState } from "./SettingsState.svelte";

  const settings = new SettingsState();
  const me = $derived(settings.me);
</script>

<div>
  <div class="flex justify-between items-center">
    <h1>Settings for {me?.profile.name}</h1>

    <button onclick={settings.handleLogOut}> Log out </button>
  </div>
  {#if !me}
    <p>Loading your settings...</p>
  {:else}
    <div>
      <section>
        <h2>Profile</h2>
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          value={me?.profile?.name ?? ""}
          oninput={settings.handleNameChange}
          placeholder="Set username"
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
            value={me.root.settings.weightUnit}
            onchange={settings.handleUnitChange}
          >
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>
      </section>

      {#if me?.root.activeProgram}
        {@const program = me.root.activeProgram}
        <section>
          <h2>Targets</h2>
          <ul>
            {#each program.exerciseStates || [] as state}
              <li>
                <label for={state?.exerciseId}>{state?.exerciseId}</label>
                <input
                  id={state?.exerciseId}
                  type="text"
                  value={state?.currentWorkingWeight}
                  oninput={settings.handleTargetChange}
                  placeholder="Set username"
                />
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    </div>
  {/if}

  {#if me?.root.activeProgram}
    <button onclick={settings.stopActiveProgram}>Stop Active Program</button>
  {/if}
</div>
