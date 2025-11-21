export const calculateSetPercentage = (percentage: number, weight: number) => {
	// TODO: round to nearest lowest available plate for when 1.25lb plates are added
	return Math.round((percentage * weight) / 5) * 5 // round to nearest 5
}

