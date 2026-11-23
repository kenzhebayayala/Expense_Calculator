import { describe, expect, it } from 'vitest'
import { categoryTotals, toKzt, totalInKzt, type Expense } from '../src/calculator'

const expenses: Expense[] = [
  { id: '1', description: 'Lunch', amount: 10, category: 'Food', currency: 'USD', createdAt: '' },
  { id: '2', description: 'Bus', amount: 500, category: 'Transport', currency: 'KZT', createdAt: '' },
]

describe('calculator', () => {
  it('converts supported currencies using fixed rates', () => {
    expect(toKzt(10, 'USD')).toBe(4800)
    expect(toKzt(10, 'EUR')).toBe(5200)
    expect(toKzt(500, 'KZT')).toBe(500)
  })

  it('calculates the total in KZT', () => {
    expect(totalInKzt(expenses)).toBe(5300)
  })

  it('returns category totals and percentages', () => {
    const totals = categoryTotals(expenses)
    expect(totals.find((item) => item.category === 'Food')?.total).toBe(4800)
    expect(totals.find((item) => item.category === 'Transport')?.percentage).toBeCloseTo(9.43, 1)
  })
})
