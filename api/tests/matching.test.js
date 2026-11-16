import assert from 'node:assert/strict'
import test from 'node:test'
import {
  normalizeSelectedItemIds,
  rankCostumeMatches,
} from '../services/matchingService.js'

function createCostume(name, itemIds) {
  return {
    name,
    items: itemIds.map((itemId) => ({ itemId, name: `Item ${itemId}` })),
  }
}

test('matching deduplicates selected IDs and ignores invalid IDs', () => {
  assert.deepEqual(normalizeSelectedItemIds([1, 1, 2, '3', 0, -4, NaN]), [1, 2])
})

test('matching includes one-item matches, excludes zero matches, and ranks by matches then missing items', () => {
  const costumes = [
    createCostume('Character A', [1, 2, 3, 4]),
    createCostume('Character B', [1, 2, 5]),
    createCostume('Character C', [9]),
    createCostume('Character D', [1]),
  ]

  const matches = rankCostumeMatches(costumes, [1, 2, 2])

  assert.deepEqual(
    matches.map(({ costume, matchedItems, missingItems, matchPercentage }) => ({
      name: costume.name,
      matchedItems,
      missingItems,
      matchPercentage,
    })),
    [
      { name: 'Character B', matchedItems: 2, missingItems: 1, matchPercentage: 66.67 },
      { name: 'Character A', matchedItems: 2, missingItems: 2, matchPercentage: 50 },
      { name: 'Character D', matchedItems: 1, missingItems: 0, matchPercentage: 100 },
    ],
  )
})

test('matching uses alphabetical order as a deterministic final tie-breaker', () => {
  const matches = rankCostumeMatches(
    [createCostume('Zebra', [1, 2]), createCostume('Alpha', [1, 2])],
    [1],
  )

  assert.deepEqual(matches.map(({ costume }) => costume.name), ['Alpha', 'Zebra'])
})

test('matching rejects non-array payloads and selections over the supported limit', () => {
  assert.throws(() => normalizeSelectedItemIds('1'), { statusCode: 400 })
  assert.throws(() => normalizeSelectedItemIds(Array(101).fill(1)), { statusCode: 400 })
})
