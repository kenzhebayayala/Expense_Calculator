

import './style.css'

import {
  CATEGORIES,
  CURRENCIES,
  categoryTotals,
  formatRatesNote,
  toKzt,
  totalInKzt,
  type Category,
  type Currency,
  type Expense,
} from './calculator.ts'

const STORAGE_KEY = 'tenge-tally-expenses'

const categoryColors: Record<Category, string> = {
  Food: 'lime',
  Transport: 'cyan',
  Entertainment: 'pink',
  Other: 'amber',
}

const defaultExpenses: Expense[] = [
  {
    id: 'demo-1',
    description: 'Coffee Roasters',
    amount: 1890,
    category: 'Food',
    currency: 'KZT',
    createdAt: 'Today, 14:32',
  },
  {
    id: 'demo-2',
    description: 'Metro card top-up',
    amount: 4000,
    category: 'Transport',
    currency: 'KZT',
    createdAt: 'Yesterday, 10:30',
  },
  {
    id: 'demo-3',
    description: 'Cinema ticket',
    amount: 7.29,
    category: 'Entertainment',
    currency: 'USD',
    createdAt: 'Yesterday, 19:00',
  },
]

let expenses = loadExpenses()

function loadExpenses(): Expense[] {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) return defaultExpenses

  try {
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed as Expense[] : defaultExpenses
  } catch {
    return defaultExpenses
  }
}

function saveExpenses(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

function formatKzt(value: number): string {
  return `${Math.round(value).toLocaleString('en-US')} ₸`
}

function formatOriginal(expense: Expense): string {
  return `${expense.amount.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })} ${expense.currency}`
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char]!)
}

function render(): void {
  const total = totalInKzt(expenses)
  const totals = categoryTotals(expenses)
  const app = document.querySelector<HTMLDivElement>('#app')!

  app.innerHTML = `
    <div class="app-shell">

      <header class="topbar">
        <a class="brand" href="#" aria-label="Tenge Tally home">
          <span class="brand-mark">T</span>
          <span>Tenge Tally</span>
        </a>

        <nav class="main-nav" aria-label="Main navigation">
          <a class="active" href="#dashboard">Dashboard</a>
          <a href="#analytics">Analytics</a>
          <a href="#budgets">Budgets</a>
        </nav>

        <div class="profile">
          <span class="profile-dot">SB</span>
          <span>Serik B.</span>
          <span class="chevron">⌄</span>
        </div>
      </header>

      <main>
        <section class="page-heading">
          <div>
            <p class="eyebrow">Personal finance / overview</p>
            <h1>November overview</h1>
          </div>

          <button class="period-button" type="button">
            Current month <span>⌄</span>
          </button>
        </section>

        <section class="summary-grid" aria-label="Spending summary">

          <article class="total-card panel">
            <div>
              <span class="card-label">Total expenses</span>
              <strong>${formatKzt(total)}</strong>
              <span class="muted">
                Across ${expenses.length}
                ${expenses.length === 1 ? 'expense' : 'expenses'}
              </span>
            </div>
            <span class="total-icon">↗</span>
          </article>

          ${totals.map(({ category, total: categoryTotal, percentage }) => `
            <article class="category-card panel ${categoryColors[category]}">
              <div class="category-title">
                <span class="category-dot"></span>
                <span>${category}</span>
              </div>

              <strong>${formatKzt(categoryTotal)}</strong>

              <div class="progress-meta">
                <span>${Math.round(percentage)}%</span>
                <span>of total</span>
              </div>

              <div class="progress-track">
                <span style="width: ${percentage}%"></span>
              </div>
            </article>
          `).join('')}

        </section>

        <section class="content-grid">

          <form class="panel add-panel" id="expense-form">

            <div class="panel-heading">
              <div>
                <p class="eyebrow">Track spending</p>
                <h2>Add expense</h2>
              </div>
              <span class="plus-badge">+</span>
            </div>

            <label>
              Description
              <input
                name="description"
                type="text"
                placeholder="What did you spend on?"
                required
                maxlength="80"
              />
            </label>

            <div class="form-row">
              <label>
                Amount
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </label>

              <label>
                Currency
                <select name="currency">
                  ${CURRENCIES.map(currency => `
                    <option value="${currency}">${currency}</option>
                  `).join('')}
                </select>
              </label>
            </div>

            <label>
              Category
              <select name="category">
                ${CATEGORIES.map(category => `
                  <option value="${category}">${category}</option>
                `).join('')}
              </select>
            </label>

            <button class="primary-button" type="submit">
              Add expense <span>→</span>
            </button>

            <p class="form-note">
              Rates: ${formatRatesNote()}
            </p>

          </form>

          <section class="panel expenses-panel">

            <div class="panel-heading">
              <div>
                <p class="eyebrow">Your activity</p>
                <h2>Recent expenses</h2>
              </div>

              <button
                class="clear-button"
                id="clear-expenses"
                type="button"
                ${expenses.length ? '' : 'disabled'}
              >
                Clear all
              </button>
            </div>

            <div class="expense-list">
              ${renderExpenseList()}
            </div>

          </section>

        </section>
      </main>

      <footer>
        <span>Fixed exchange rates · Updated manually</span>

        <span class="status">
          <i></i> Saved in this browser
        </span>
      </footer>

    </div>
  `

  document
    .querySelector<HTMLFormElement>('#expense-form')!
    .addEventListener('submit', handleSubmit)

  document
    .querySelectorAll<HTMLButtonElement>('[data-delete]')
    .forEach(button => {
      button.addEventListener('click', () => {
        deleteExpense(button.dataset.delete!)
      })
    })

  document
    .querySelector<HTMLButtonElement>('#clear-expenses')!
    .addEventListener('click', clearExpenses)
}

function renderExpenseList(): string {
  if (!expenses.length) {
    return `
      <div class="empty-state">
        <span>○</span>
        <h3>No expenses yet</h3>
        <p>Add your first expense to get started.</p>
      </div>
    `
  }

  return expenses.map(expense => `
    <article class="expense-item">

      <div class="expense-info">

        <span class="expense-icon ${categoryColors[expense.category]}">
          ${
            expense.category === 'Food' ? '🍔' :
            expense.category === 'Transport' ? '🚕' :
            expense.category === 'Entertainment' ? '🎬' : '📦'
          }
        </span>

        <div>
          <h3>${escapeHtml(expense.description)}</h3>
          <p>${expense.category} · ${escapeHtml(expense.createdAt)}</p>
        </div>

      </div>

      <div class="expense-amount">
        <strong>
          ${formatKzt(toKzt(expense.amount, expense.currency))}
        </strong>
        <span>${formatOriginal(expense)}</span>
      </div>

      <button
        class="delete-button"
        type="button"
        data-delete="${escapeHtml(expense.id)}"
        aria-label="Delete ${escapeHtml(expense.description)}"
      >
        ×
      </button>

    </article>
  `).join('')
}

function handleSubmit(event: SubmitEvent): void {
  event.preventDefault()

  const form = event.currentTarget as HTMLFormElement
  const formData = new FormData(form)

  const description = String(formData.get('description')).trim()
  const amount = Number(formData.get('amount'))
  const currency = formData.get('currency') as Currency
  const category = formData.get('category') as Category

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    return
  }

  const newExpense: Expense = {
    id: crypto.randomUUID(),
    description,
    amount,
    currency,
    category,
    createdAt: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }

  expenses.unshift(newExpense)

  saveExpenses()
  render()
}

function deleteExpense(id: string): void {
  expenses = expenses.filter(expense => expense.id !== id)

  saveExpenses()
  render()
}

function clearExpenses(): void {
  if (!expenses.length) return

  expenses = []

  saveExpenses()
  render()
}

render()

