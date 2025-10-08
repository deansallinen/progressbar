import { getContext, setContext } from "svelte";
import { AppSettings, db, defaultAppSettings, type WeightUnit } from "../../db";
import { liveQuery } from "dexie";

export class SettingsState {
  settings = liveQuery(async () => {
    const appSettings = await db.appSettings.get(1)
    return appSettings ?? defaultAppSettings as AppSettings
  }
  );

  handleNameChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    db.appSettings.update(1, { userName: target.value });
  }

  handleUnitChange = (e: Event) => {
    const newUnit = (e.currentTarget as HTMLSelectElement).value as WeightUnit;
    db.appSettings.update(1, { weightUnit: newUnit });
  }
}

const DEFAULT_KEY = '$_settings_state'

export const getSettingsState = ( key = DEFAULT_KEY) => {
  return getContext<SettingsState>(key)
}
export const setSettingsState = ( key = DEFAULT_KEY) => {
  const settingsState = new SettingsState()
  return setContext(key, settingsState)
}
