# AGENTS.md - Expense Calculator (UI title: Tenge Tally)
## Purpose
Small browser app (Vite + TypeScript). The user adds expenses in KZT, USD or EUR and
sees the total and per-category subtotals converted to KZT. No backend, no external API calls.
## Architecture
- src/calculator.ts - currency conversion, totals and subtotals. Keep it independent from the UI.
- src/config.ts - fixed currency rates. The only place where rates are defined.
- src/main.ts - UI rendering and event handlers. No business rules here.
- src/style.css, index.html - styles and entry page.
- tests/calculator.test.ts - unit tests (Vitest).
- src/counter.ts, src/typescript.svg - unused Vite starter leftovers.
- .bolt/ - platform metadata. Do not edit.
## Setup
Requires Node.js 18+. Run: npm install
## Safe commands
npm run dev, npm run build, npm test, npm audit (read-only report), git status, git diff, git log.
## Coding conventions
- Follow tsconfig.json settings. No "any" without a comment explaining why.
- Business logic stays in calculator.ts as pure functions without DOM access.
- Rates and categories are defined only in config.ts.
- Validate amounts before use: finite number, greater than 0.
- Small changes, one concern each.
## Testing requirements
- Every change to calculator.ts needs a unit test (normal, edge and invalid input).
- Before reporting a task as done, run npm run build and npm test and show the raw output.
- Never report a command as passing without having run it.
## Known issues
npm audit reports 6 vulnerabilities in dev dependencies (vitest, vite, esbuild, tinypool).
Do not run "npm audit fix --force".
## Forbidden actions
- No secrets, API keys, .env files or real personal data.
- No deploy or publish.
- No destructive commands: rm -rf, git reset --hard, force push, deleting branches or history.
- No adding, removing or upgrading dependencies, and no hand-editing package-lock.json, without human review of the diff.
- No external network calls in the app.
- No edits outside the task scope and nothing inside .bolt/.
