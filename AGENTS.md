# AGENTS.md

This file provides guidelines for agentic coding agents operating in this repository.

## Commands

- **Build:** `bun run build`
- **Lint:** `bun run lint`
- **Format:** `bun run format`
- **Type Check:** `bun run check`

There are no tests in this project.

## Code Style

- **TypeScript:** Use TypeScript with strict type safety. All code examples must be production-ready and type-safe.
- **Framework:** This is a Svelte project. Tailor responses and code to Svelte conventions.
- **Jazz Framework:** This project uses the Jazz framework. Adhere to Jazz conventions and best practices.
  - Read the Jazz documentation and schema templates before making changes.
  - Use PascalCase for schema names.
- **Error Handling:** Include proper error handling patterns in all code.
- **Imports:** Use proper imports from "jazz-tools" (Group, co, z).
- **Cursor Rules:** This project uses Cursor rules for Jazz schema generation and general help. Refer to the files in `.cursor/rules/` for detailed instructions.
