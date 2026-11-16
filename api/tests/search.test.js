import assert from 'node:assert/strict'
import test from 'node:test'
import { validateSearchFilters } from '../services/itemService.js'

test('search filters normalize the SQL limit to a number', () => {
  const filters = validateSearchFilters({ query: 'neo', limit: '8' })

  assert.equal(filters.limit, 8)
  assert.equal(typeof filters.limit, 'number')
})

test('search filters reject limits above the supported maximum', () => {
  assert.throws(
    () => validateSearchFilters({ query: 'neo', limit: '101' }),
    { statusCode: 400 },
  )
})
