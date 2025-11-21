import { goto } from "$app/navigation"
import { resolve } from "$app/paths"
import { db, type TemplateProgram} from "$lib/db"
import { liveQuery } from "dexie";
import { startNoviceProgram } from "$lib/programs/novice";

export const programs = liveQuery(() => db.programs.toArray());

export const getActiveProgram = async (): Promise<TemplateProgram> => {
	const settings = await db.settings.get(1)
	let programId = settings?.activeProgramId
	if (programId) {
		console.log('program found')
		const program = await db.programs.get(programId)
		if (!program) throw new Error('no program matches id')
		return program
	} else {
		console.log('no active program')
		const newProgram = await startNoviceProgram()
		return newProgram
	} 

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

