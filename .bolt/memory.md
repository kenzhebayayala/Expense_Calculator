# Project memory

## Product intent & audience

- **Tenge Tally**: small expense calculator web app for tracking spending with multi-currency support.
- Converts all expenses to KZT; supports KZT, USD, EUR input.
- Audience: personal users managing expenses across currencies (Kazakhstan-focused given KZT base).

## Brand personality & voice

- Practical, utility-focused dashboard tool. No marketing tone.
- Name "Tenge Tally" used in UI.

## Visual design & UX direction

- Dark dashboard: charcoal background, slate panels, neon category accents.
- Category color mapping: Food=lime, Transport=cyan, Entertainment=magenta, Other=amber.
- Layout: dashboard with total tile + four category subtotal cards beside/beside-and-below the expense list; add form panel on the left.
- Total tile uses large monospace digits; category tiles have subtotals + thin progress bars.
- Expense rows: colored category dots, original currency amount, KZT-converted amount, delete icon.
- Geometric sans-serif headings, sharp 4px corners, high density.
- Clear-all action requires confirmation.

## Decisions, constraints & rationale

- Stack: Vite + TypeScript, minimal dependencies.
- `src/calculator.ts` holds all calculation/conversion logic, decoupled from UI.
- Fixed exchange rates live in a dedicated config file (no external API calls, no secrets).
- Persistence via browser localStorage; expenses survive page reload.
- Unit tests cover conversion and totals logic.
- Categories: Food, Transport, Entertainment, Other (fixed enum).
- Currencies: KZT, USD, EUR (fixed enum).
- README includes setup, run, build, and test instructions.

## Open questions & assumptions

- No `.bolt/prompt` exists yet; global instructions may be added later.
- Test runner assumed to be Vitest (Vite-native, minimal); not explicitly confirmed by user.
- Exchange rate values are developer-chosen placeholders in config; user has not specified exact rates.
- No accessibility requirements explicitly stated; default semantic HTML assumed sufficient for now.