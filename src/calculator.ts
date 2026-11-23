import { RATES_TO_KZT } from './config.ts'

export const CURRENCIES = ['KZT', 'USD', 'EUR'] as const
export type Currency = (typeof CURRENCIES)[number]

export const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Other'] as const
export type Category = (typeof CATEGORIES)[number]

export type Expense = {
  id: string
  description: string
  amount: number
  category: Category
  currency: Currency
  createdAt: string
}

export type CategoryTotal = {
  category: Category
  total: number
  percentage: number
}

export function toKzt(amount: number, currency: Currency): number {
  return amount * RATES_TO_KZT[currency]
}

export function totalInKzt(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + toKzt(expense.amount, expense.currency), 0)
}

export function formatRatesNote(): string {
  return CURRENCIES.filter((currency) => currency !== 'KZT')
    .map((currency) => `1 ${currency} = ${RATES_TO_KZT[currency]} ₸`)
    .join(' · ')
}

export function categoryTotals(expenses: Expense[]): CategoryTotal[] {
  const total = totalInKzt(expenses)
  return CATEGORIES.map((category) => {
    const categoryTotal = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + toKzt(expense.amount, expense.currency), 0)

    return {
      category,
      total: categoryTotal,
      percentage: total === 0 ? 0 : (categoryTotal / total) * 100,
    }
  })
}
