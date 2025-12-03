# AGENTS.md

This file provides guidelines for agentic coding agents operating in this repository.

## Commands

- **Build:** `bun run build` (Runs type check and Vite build)
- **Lint:** `bun run lint` (Uses Biome for linting)
- **Format:** `bun run format` (Uses Biome for formatting)
- **Type Check:** `bun run check` (Uses Svelte-Check)
- **Tests:** There are no unit tests in this project.

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Code Style

- **Framework:** This is a SvelteKit project using Svelte 5. Adhere to Svelte conventions.
- **TypeScript:** Use TypeScript with strict type safety (`tsconfig.json`).
- **Formatting:** Enforced by Biome (`biome.json`): 2-space indentation, 100-character line width, single quotes for JS/TS.
- **State Management:** Uses Dexie for IndexedDB and Svelte 5 runic state (`.svelte.ts` files).
- **Error Handling:** Use `try...catch` blocks for asynchronous operations (e.g., database calls) and log errors with `console.error`.

## Data Backup

This app has CSV export/import functionality in `src/lib/functions/backup.ts` for user data backup.

**Important:** When making changes to the database schema or adding/modifying data that should be persisted, always check if the export/import functions need to be updated:

- `exportDataToCSV()` - Gathers and exports user data
- `importDataFromCSV()` - Parses and restores user data
- `gatherExportData()` - Collects data from all relevant tables
- `dataToCSV()` - Formats data into CSV sections
- `parseCSVData()` - Parses CSV back into data structures

The backup currently handles:
- Settings (`[SETTINGS]` section)
- Exercises (`[EXERCISES]` section)
- Workout history (`[WORKOUT_HISTORY]` section)
- Set history (`[SET_HISTORY]` section)
- Program state (`[PROGRAM_STATE]` section)

If you add new tables or fields to existing tables, update the corresponding export/import logic to ensure data can be properly backed up and restored.


