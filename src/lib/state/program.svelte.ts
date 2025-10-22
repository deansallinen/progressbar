import { goto } from "$app/navigation"
import { resolve } from "$app/paths"
import { db } from "$lib/db"
import { liveQuery } from "dexie";

export const programs = liveQuery(() => db.programs.toArray());

export const getActiveProgram = async () => {
	const settings = await db.settings.get(1)
	const programId = settings?.activeProgramId
	if (!programId) return undefined
	return db.programs.get(programId)
}


export const startProgram = async (id: number) => {
	console.log('startProgram', id)

	try {
		db.settings.update(1, { activeProgramId: id })
	} catch(error) {
		console.error("failed to start program", error)
	}

	goto(resolve('/'))

}

