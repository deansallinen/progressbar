
export function calculateSetPercentage(percentage: number, weight: number, smallestWeight: number) {
	const roundingIncrement = smallestWeight * 2; 
	const targetWeight = percentage * weight;
	return Math.round(targetWeight / roundingIncrement) * roundingIncrement 
}

