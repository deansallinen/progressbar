<script lang="ts">
	import type { WorkoutHistory } from "$lib/db";

	interface Props {
		history: WorkoutHistory[];
	}

	let { history }: Props = $props();

	const daysToDisplay = 14;

	let calendarDays = $derived.by(() => {
		const days = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Generate last 14 days (including today)
		for (let i = daysToDisplay - 1; i >= 0; i--) {
			const d = new Date(today);
			d.setDate(today.getDate() - i);
			days.push(d);
		}

		return days.map((day) => {
			const isCompleted = history.some((h) => {
				if (!h.completedAt) return false;
				const hDate = new Date(h.completedAt);
				return (
					hDate.getDate() === day.getDate() &&
					hDate.getMonth() === day.getMonth() &&
					hDate.getFullYear() === day.getFullYear()
				);
			});
			return { date: day, completed: isCompleted };
		});
	});

	const formatDate = (date: Date) => {
		return date.toLocaleDateString(undefined, {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};
</script>

<div class="calendar-container">
	<div class="calendar">
		{#each calendarDays as day}
			<div
				class="day-square"
				class:completed={day.completed}
				class:today={day.date.toDateString() === new Date().toDateString()}
				data-tooltip={formatDate(day.date)}
			></div>
		{/each}
	</div>
	<div class="legend">
		<small>Last {daysToDisplay} days</small>
	</div>
</div>

<style>
	.calendar-container {
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.calendar {
		display: flex;
		gap: 4px;
	}

	.day-square {
		width: 16px;
		height: 16px;
		background-color: var(--pico-card-background-color);
		border: 1px solid var(--pico-muted-border-color);
		border-radius: 2px;
		transition: transform 0.1s ease;
		position: relative;
	}

	/* Today indicator */
	.today {
		border-color: var(--pico-primary);
	}

	.day-square:hover {
		transform: scale(1.2);
		z-index: 1;
	}

	.completed {
		background-color: #2ea44f; /* GitHub Success Green */
		border-color: rgba(27, 31, 35, 0.06);
	}

	/* Dark mode overrides if needed, using CSS media query or if pico handles themes via data-theme */
	:global([data-theme="dark"]) .completed {
		background-color: #3fb950;
	}

	.legend {
		margin-top: 0.5rem;
		color: var(--pico-muted-color);
		font-size: 0.75rem;
	}

	/* Simple tooltip */
	[data-tooltip]:hover::after {
		content: attr(data-tooltip);
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		padding: 4px 8px;
		background-color: var(--pico-contrast-background);
		color: var(--pico-contrast-inverse);
		border-radius: 4px;
		font-size: 0.75rem;
		white-space: nowrap;
		pointer-events: none;
		margin-bottom: 5px;
		z-index: 10;
	}
</style>
