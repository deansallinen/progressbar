import { startWorker } from "jazz-tools/worker";
import { PUBLIC_CATALOG_ID, ProgramCatalog, Program, ExerciseDefinition } from "$lib/schema";
import { rssProgramTemplate } from "$lib/programs/radicallySimpleStrength"; // Assuming you renamed the import
import { Group } from "jazz-tools";

// Make sure to load environment variables if you're not using a framework's runner
// For example, using `dotenv`: require('dotenv').config();

const startCatalogWorker = async () => {
    console.log("Attempting to start catalog worker...");

        console.log("Reading Environment Variables...");
    console.log("PUBLIC_JAZZ_API_KEY:", process.env.PUBLIC_JAZZ_API_KEY);
    console.log("PUBLIC_JAZZ_WORKER_ACCOUNT:", process.env.PUBLIC_JAZZ_WORKER_ACCOUNT);
    console.log("JAZZ_WORKER_SECRET:", process.env.JAZZ_WORKER_SECRET ? "Loaded" : "NOT LOADED"); // Don't log the secret itself!

    const API_KEY = process.env.PUBLIC_JAZZ_API_KEY; // I assume you have this from your .env
    const WORKER_ACCOUNT_ID = process.env.PUBLIC_JAZZ_WORKER_ACCOUNT;
    const WORKER_SECRET = process.env.JAZZ_WORKER_SECRET;

    if (!API_KEY || !WORKER_ACCOUNT_ID || !WORKER_SECRET) {
        console.error("❌ FATAL: Missing required environment variables for the catalog worker.");
        return;
    }

    try {
        // 1. Start the Worker
        const { worker } = await startWorker({
            syncServer: `wss://cloud.jazz.tools/?key=${API_KEY}`,
            accountID: WORKER_ACCOUNT_ID,
            accountSecret: WORKER_SECRET,
        });
        console.log("SUCCESS: Worker started with ID:", worker.$jazz.id);

        // 2. Create and configure a single public Group to own EVERYTHING.
        const catalogGroup = Group.create(worker);
        catalogGroup.makePublic("reader");
        console.log("SUCCESS: Created and configured public group:", catalogGroup.$jazz.id);

        // 3. Upsert the Program Catalog, owned by the public group.
        console.log(`Attempting to upsert ProgramCatalog with unique ID: ${PUBLIC_CATALOG_ID}`);
        const catalog = await ProgramCatalog.upsertUnique({
            unique: PUBLIC_CATALOG_ID,
            owner: catalogGroup, // The group owns the catalog itself
            value: {
                name: 'Public Program Catalog',
                programs: [],
            },
        });

        if (!catalog) {
            console.error("FATAL: 'upsertUnique' returned null. Catalog was NOT created.");
            return;
        }

                await catalog.$jazz.waitForSync(); // [!code ++]

        console.log("SUCCESS: ProgramCatalog upserted with ID:", catalog.$jazz.id);

        // 4. Populate with initial data ONLY if the catalog is empty.
        const loadedCatalog = await catalog.$jazz.ensureLoaded({ resolve: { programs: true }}); // [!code ++]
        if (loadedCatalog.programs.length === 0) {
            console.log("Catalog is empty, populating with default program...");

            const squatDef = ExerciseDefinition.create({ name: "Squat", incrementWeight: 5 }, { owner: catalogGroup });
            const benchDef = ExerciseDefinition.create({ name: "Bench Press", incrementWeight: 5 }, { owner: catalogGroup });
            const deadliftDef = ExerciseDefinition.create({ name: "Deadlift", incrementWeight: 10 }, { owner: catalogGroup });
            const ohpDef = ExerciseDefinition.create({ name: "Overhead Press", incrementWeight: 5 }, { owner: catalogGroup });

            const definitionMap: { [key: string]: ExerciseDefinition } = {
                "Squat": squatDef,
                "Bench Press": benchDef,
                "Deadlift": deadliftDef,
                "Overhead Press": ohpDef,
            };

            const programDataForCreate = {
                ...rssProgramTemplate,
                workouts: rssProgramTemplate.workouts.map(workout => ({
                    ...workout,
                    exercises: workout.exercises.map(exercise => ({
                        ...exercise,
                        definition: definitionMap[exercise.definition.name],
                    }))
                }))
            };

            // Create the program CoValue, also owned by the public group.
            const newProgram = Program.create(programDataForCreate, { owner: catalogGroup });

            // Push the new program into the catalog's list.
            catalog.programs?.$jazz.push(newProgram);

            await catalog.$jazz.waitForSync(); // [!code ++]

            console.log("SUCCESS: Program catalog bootstrapped with initial program.");
        } else {
            console.log("SUCCESS: Catalog already populated, skipping bootstrap.");
        }

        // Final check on permissions
        const role = catalog.$jazz.owner.getRoleOf('everyone');
        if (role === 'reader') {
            console.log("SUCCESS: Permissions verified. Catalog is publicly readable.");
        } else {
            console.warn("WARNING: Permissions check failed. Catalog might not be public. Role of 'everyone' is:", role);
        }

        console.log("Worker setup complete. You can now stop this script.");
        // We might want to keep the worker running if it's a long-running process,
        // but for a one-shot seeding script, this is the end.
        return worker;

    } catch (error) {
        console.error("FATAL: An error occurred during worker startup.", error);
        // Ensure the script exits with an error code if something fails
        process.exit(1);
    }
};

// Execute the function and ensure the process waits for it.
startCatalogWorker().then(() => {
    // We can exit gracefully after the script is done.
    process.exit(0);
});
