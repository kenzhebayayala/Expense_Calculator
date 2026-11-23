
import { describe, expect, it } from 'vitest'
import { formatRatesNote } from '../src/calculator.ts'
import { RATES_TO_KZT } from '../src/config.ts'

describe('formatRatesNote', () => {
  it('builds the rates text from the config', () => {
    const note = formatRatesNote()
    expect(note).toContain(`1 USD = ${RATES_TO_KZT.USD} ₸`)
    expect(note).toContain(`1 EUR = ${RATES_TO_KZT.EUR} ₸`)
    expect(note).not.toContain('KZT')
  })
})
