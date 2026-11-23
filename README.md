# Tenge Tally

A small dark dashboard for tracking everyday expenses in KZT, USD, and EUR.

## Setup

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Run tests

```bash
npm test
```

Expenses are saved in the browser so they remain available after a reload. Currency conversion uses the fixed rates in `src/config.ts` and does not call an external service.
