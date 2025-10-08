import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { db, Program } from "../../db";
import { liveQuery } from "dexie";

export class ProgramsState {
    programs = liveQuery(() => db.programs.toArray());

    startProgram = async (program: Program) => {
        const settings =  await db.appSettings.get(1)

        if (settings?.activeProgramId && settings?.activeProgramId !== program.id) {
            alert('Override?')

            try {
                db.appSettings.update(1, {
                    activeProgramId: program.id,
                    nextWorkoutIndex: 0
                })
            } catch(error) {
                console.error("failed to start program", error)
            }

        }

        goto(resolve('/'))

    }
}
