Phase 1: Data Modeling
First, I'll need to update the data structures to support the phased nature of the novice program and its specific progression rules. This will likely involve changes in src/lib/db.ts and the state files under src/lib/state/.
1.  Program and Phase Structure:
    *   Introduce a phases concept into the program data model. Each program will have an array of phases.
    *   Each phase will define its structure, including the workout templates (e.g., Workout A, Workout B) and its duration (e.g., the first 12 workouts).
2.  Exercise Progression Rules:
    *   Enhance the exercise model to include a progressionType field to handle the different advancement schemes described in the book:
        *   LINEAR: For the main lifts, where weight is added each session.
        *   REP_GOAL: For exercises like chin-ups, where the goal is to add reps until a target is met before adding weight.
        *   AMRAP: For assistance exercises like curls, where sets are performed to failure to determine the next weight increase.
    *   Store metadata for each progression type, such as the specific weight increments (2.5lb, 5lb) or rep targets.
3.  User State Tracking:
    *   Add a workoutCount to the user's active program state. This will track how many sessions have been completed and determine which phase the user is currently in.

Phase 2: Application Logic
Next, I'll modify the core application logic to generate workouts and track progress according to the book's methodology.
1.  Workout Generation:
    *   The logic that starts a new workout will be updated to be phase-aware. It will use the workoutCount to select the correct exercises and structure for the user's current phase (e.g., alternating deadlifts with chin-ups in Phase 2).
2.  Progression Calculation:
    *   Implement the logic to automatically calculate the target weights for each new session.
    *   For LINEAR lifts, it will retrieve the last successful weight and add the prescribed increment. It will also calculate the ascending warmup sets based on the specified percentages (60%, 70%, 80%, 90%) of the top set.
    *   For other progression types, it will analyze the previous session's performance (reps completed) to determine if the weight should be increased.
3.  Stall and Reset Mechanism:
    *   Implement a system to detect when a user stalls on a lift (fails to complete target reps for 2-3 consecutive workouts).
    *   When a stall is detected, the system will automatically apply the "reset" logic: reduce the weight by 10% and change the top set to be "As Many Reps As Possible" (AMRAP) to allow for continued progress.
Phase 3: User Interface (UI)
Finally, I'll plan minor UI adjustments to ensure the new logic is clear and easy for the user to follow.
1.  Workout View:
    *   The workout screen will be updated to clearly distinguish between warmup sets and the final, heaviest "top set."
    *   Sets that are designated as AMRAP will be clearly marked.
2.  Program Selection:
    *   A new pre-configured "Radically Simple Novice Program" will be added, containing all the phases and logic out-of-the-box.
