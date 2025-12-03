import { db, type UserExercise, type UserSettings, type SetHistory, type WorkoutHistory, type TemplateProgram } from '$lib/db';
import { createNoviceProgram, noviceExercises } from '$lib/programs/novice';

/**
 * CSV Export/Import for user data backup
 *
 * Format: Multi-section CSV with headers
 * Sections: [SETTINGS], [EXERCISES], [WORKOUT_HISTORY], [SET_HISTORY], [PROGRAM_STATE]
 */

// Helper to escape CSV values
function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Helper to parse CSV values
function parseCSV(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/""/g, '"');
  }
  return value;
}

// Parse a CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result.map(parseCSV);
}

interface ProgramState {
  currentPhaseIndex: number;
  nextWorkoutIndex: number;
  workoutCount: number;
  phaseWorkoutCount: number;
}

interface ExportData {
  settings: UserSettings | undefined;
  exercises: UserExercise[];
  workoutHistory: WorkoutHistory[];
  setHistory: SetHistory[];
  programState: ProgramState | undefined;
}

async function gatherExportData(): Promise<ExportData> {
  const [settings, exercises, workoutHistory, setHistory, programs] = await Promise.all([
    db.settings.get(1),
    db.exercises.toArray(),
    db.workoutHistory.toArray(),
    db.recordedSets.toArray(),
    db.programs.toArray(),
  ]);

  // Get active program state
  const activeProgram = settings?.activeProgramId
    ? programs.find((p) => p.id === settings.activeProgramId)
    : programs[0];

  const programState = activeProgram
    ? {
        currentPhaseIndex: activeProgram.currentPhaseIndex,
        nextWorkoutIndex: activeProgram.nextWorkoutIndex,
        workoutCount: activeProgram.workoutCount,
        phaseWorkoutCount: activeProgram.phaseWorkoutCount,
      }
    : undefined;

  return { settings, exercises, workoutHistory, setHistory, programState };
}

function dataToCSV(data: ExportData): string {
  const lines: string[] = [];

  // Header with version and timestamp
  lines.push(`# ProgressBar Backup`);
  lines.push(`# Version: 1`);
  lines.push(`# Exported: ${new Date().toISOString()}`);
  lines.push('');

  // Settings section
  lines.push('[SETTINGS]');
  lines.push('id,userName,userWeight,activeProgramId,weightUnit,barWeight,availablePlates');
  if (data.settings) {
    const s = data.settings;
    lines.push(
      [
        escapeCSV(s.id),
        escapeCSV(s.userName),
        escapeCSV(s.userWeight),
        escapeCSV(s.activeProgramId),
        escapeCSV(s.weightUnit),
        escapeCSV(s.barWeight),
        escapeCSV(s.availablePlates?.join(';')),
      ].join(',')
    );
  }
  lines.push('');

  // Exercises section
  lines.push('[EXERCISES]');
  lines.push('id,name,workingWeight,goalWeight,incrementWeight,note,resets,stalls');
  for (const ex of data.exercises) {
    lines.push(
      [
        escapeCSV(ex.id),
        escapeCSV(ex.name),
        escapeCSV(ex.workingWeight),
        escapeCSV(ex.goalWeight),
        escapeCSV(ex.incrementWeight),
        escapeCSV(ex.note),
        escapeCSV(ex.resets),
        escapeCSV(ex.stalls),
      ].join(',')
    );
  }
  lines.push('');

  // Workout History section
  lines.push('[WORKOUT_HISTORY]');
  lines.push('id,programId,workoutIndex,completedAt');
  for (const wh of data.workoutHistory) {
    lines.push(
      [
        escapeCSV(wh.id),
        escapeCSV(wh.programId),
        escapeCSV(wh.workoutIndex),
        escapeCSV(wh.completedAt?.toISOString()),
      ].join(',')
    );
  }
  lines.push('');

  // Set History section
  lines.push('[SET_HISTORY]');
  lines.push('id,workoutHistoryId,exerciseId,setIndex,completedReps,completedWeight,completedAt');
  for (const sh of data.setHistory) {
    lines.push(
      [
        escapeCSV(sh.id),
        escapeCSV(sh.workoutHistoryId),
        escapeCSV(sh.exerciseId),
        escapeCSV(sh.setIndex),
        escapeCSV(sh.completedReps),
        escapeCSV(sh.completedWeight),
        escapeCSV(sh.completedAt?.toISOString()),
      ].join(',')
    );
  }
  lines.push('');

  // Program State section
  lines.push('[PROGRAM_STATE]');
  lines.push('currentPhaseIndex,nextWorkoutIndex,workoutCount,phaseWorkoutCount');
  if (data.programState) {
    const ps = data.programState;
    lines.push(
      [
        escapeCSV(ps.currentPhaseIndex),
        escapeCSV(ps.nextWorkoutIndex),
        escapeCSV(ps.workoutCount),
        escapeCSV(ps.phaseWorkoutCount),
      ].join(',')
    );
  }

  return lines.join('\n');
}

export async function exportDataToCSV(): Promise<void> {
  try {
    const data = await gatherExportData();
    const csv = dataToCSV(data);

    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progressbar-backup-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Failed to export data: ${error}`);
  }
}

interface ParsedData {
  settings: Partial<UserSettings> | null;
  exercises: UserExercise[];
  workoutHistory: WorkoutHistory[];
  setHistory: SetHistory[];
  programState: ProgramState | null;
}

function parseCSVData(csv: string): ParsedData {
  // Handle both Unix (LF) and Windows (CRLF) line endings
  const lines = csv.split(/\r?\n/).map((l) => l.trim());
  const result: ParsedData = {
    settings: null,
    exercises: [],
    workoutHistory: [],
    setHistory: [],
    programState: null,
  };

  let currentSection = '';

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) continue;

    // Check for section headers
    if (line.startsWith('[') && line.endsWith(']')) {
      currentSection = line.slice(1, -1);
      continue;
    }

    // Skip header rows (they contain known column names)
    if (
      line.startsWith('id,') ||
      line.startsWith('id,userName') ||
      line.startsWith('id,name,') ||
      line.startsWith('id,programId,workoutIndex') ||
      line.startsWith('id,workoutHistoryId') ||
      line.startsWith('currentPhaseIndex,')
    ) {
      continue;
    }

    const values = parseCSVLine(line);

    switch (currentSection) {
      case 'SETTINGS': {
        const plates = values[6] ? values[6].split(';').map(Number).filter((n) => !isNaN(n)) : [];
        result.settings = {
          id: values[0] !== '' ? parseInt(values[0]) : 1,
          userName: values[1] !== '' ? values[1] : undefined,
          userWeight: values[2] !== '' ? parseFloat(values[2]) : undefined,
          activeProgramId: values[3] !== '' ? parseInt(values[3]) : undefined,
          weightUnit: values[4] !== '' ? values[4] : undefined,
          barWeight: values[5] !== '' ? parseFloat(values[5]) : 45,
          availablePlates: plates,
        };
        break;
      }
      case 'EXERCISES': {
        result.exercises.push({
          id: values[0] !== '' ? parseInt(values[0]) : undefined,
          name: values[1],
          workingWeight: values[2] !== '' ? parseFloat(values[2]) : 0,
          goalWeight: values[3] !== '' ? parseFloat(values[3]) : undefined,
          incrementWeight: values[4] !== '' ? parseFloat(values[4]) : 5,
          note: values[5] !== '' ? values[5] : undefined,
          resets: values[6] !== '' ? parseInt(values[6]) : 0,
          stalls: values[7] !== '' ? parseInt(values[7]) : 0,
        });
        break;
      }
      case 'WORKOUT_HISTORY': {
        result.workoutHistory.push({
          id: values[0] !== '' ? parseInt(values[0]) : undefined,
          programId: values[1] !== '' ? parseInt(values[1]) : 1,
          workoutIndex: values[2] !== '' ? parseInt(values[2]) : 0,
          completedAt: values[3] !== '' ? new Date(values[3]) : undefined,
        });
        break;
      }
      case 'SET_HISTORY': {
        result.setHistory.push({
          id: values[0] !== '' ? parseInt(values[0]) : undefined,
          workoutHistoryId: values[1] !== '' ? parseInt(values[1]) : 0,
          exerciseId: values[2] !== '' ? parseInt(values[2]) : 0,
          setIndex: values[3] !== '' ? parseInt(values[3]) : 0,
          completedReps: values[4] !== '' ? parseInt(values[4]) : 0,
          completedWeight: values[5] !== '' ? parseFloat(values[5]) : 0,
          completedAt: values[6] !== '' ? new Date(values[6]) : new Date(),
        });
        break;
      }
      case 'PROGRAM_STATE': {
        result.programState = {
          currentPhaseIndex: values[0] !== '' ? parseInt(values[0]) : 0,
          nextWorkoutIndex: values[1] !== '' ? parseInt(values[1]) : 0,
          workoutCount: values[2] !== '' ? parseInt(values[2]) : 0,
          phaseWorkoutCount: values[3] !== '' ? parseInt(values[3]) : 0,
        };
        break;
      }
    }
  }

  return result;
}

export async function importDataFromCSV(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text();
    const data = parseCSVData(text);

    // Validate the data
    if (!data.exercises.length && !data.settings && !data.workoutHistory.length) {
      return { success: false, message: 'No valid data found in the CSV file.' };
    }

    // Use a transaction for atomic import
    await db.transaction(
      'rw',
      [db.settings, db.exercises, db.workoutHistory, db.recordedSets, db.programs, db.activeWorkout],
      async () => {
        // Clear all tables first for a clean import
        await db.exercises.clear();
        await db.programs.clear();
        await db.workoutHistory.clear();
        await db.recordedSets.clear();
        await db.activeWorkout.clear();

        // Import exercises with their original IDs using put()
        const exerciseNameToId = new Map<string, number>();

        for (const ex of data.exercises) {
          // Use put() to preserve the original ID
          await db.exercises.put(ex as UserExercise);
          if (ex.id !== undefined) {
            exerciseNameToId.set(ex.name, ex.id);
          }
        }

        // Ensure all required exercises exist for the novice program
        // Add any missing exercises from the default set
        const requiredExercises = noviceExercises.map((e) => e.name);
        for (const name of requiredExercises) {
          if (!exerciseNameToId.has(name)) {
            const defaultExercise = noviceExercises.find((e) => e.name === name);
            if (defaultExercise) {
              const newId = await db.exercises.add({ ...defaultExercise });
              if (newId !== undefined) {
                exerciseNameToId.set(name, newId);
              }
            }
          }
        }

        // Create the program with the preserved exercise IDs
        const noviceProgram = createNoviceProgram((name) => exerciseNameToId.get(name));

        // Apply saved program state if available
        if (data.programState) {
          noviceProgram.currentPhaseIndex = data.programState.currentPhaseIndex;
          noviceProgram.nextWorkoutIndex = data.programState.nextWorkoutIndex;
          noviceProgram.workoutCount = data.programState.workoutCount;
          noviceProgram.phaseWorkoutCount = data.programState.phaseWorkoutCount;
        }

        const programId = await db.programs.put(noviceProgram as TemplateProgram);
        if (programId === undefined) {
          throw new Error('Failed to create program');
        }

        // Import settings, but override activeProgramId to point to the new program
        const settingsToSave = {
          ...(data.settings || {}),
          id: 1,
          activeProgramId: programId,
          // Ensure defaults if not present
          barWeight: data.settings?.barWeight ?? 45,
          availablePlates: data.settings?.availablePlates ?? [45, 25, 10, 5, 2.5],
          weightUnit: data.settings?.weightUnit ?? 'lbs',
        } as UserSettings;
        await db.settings.put(settingsToSave);

        // Import workout history with original IDs, but update programId
        for (const wh of data.workoutHistory) {
          await db.workoutHistory.put({ ...wh, programId: programId } as WorkoutHistory);
        }

        // Import set history with original IDs
        for (const sh of data.setHistory) {
          await db.recordedSets.put(sh as SetHistory);
        }
      }
    );

    return {
      success: true,
      message: `Imported ${data.exercises.length} exercises, ${data.workoutHistory.length} workouts, and ${data.setHistory.length} sets.`,
    };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, message: `Import failed: ${error}` };
  }
}
