// Export a function that returns the programs from Jazz
export function getPrograms(account: any) {
	if (!account.current?.root?.programs) {
		return {};
	}

	// Create a map of programs by slug for easy lookup
	const programsMap: Record<string, any> = {};
	for (const program of account.current.root.programs) {
		if (program) {
			// Use the program name to create a slug
			const slug = program.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
			programsMap[slug] = program;
		}
	}

	return programsMap;
}

// For backward compatibility, export an empty object
// Components should use getPrograms() instead
export const programs = {};
