import test from 'node:test'
import assert from 'node:assert/strict'

import {
  DEFAULT_COLOR,
  addSelectionVariant,
  createSelectionId,
  readStoredSelection,
  removeSelectionVariant,
} from './selectionUtils.js'

test('creates a stable identity for item and color combinations', () => {
  const black = createSelectionId(12, DEFAULT_COLOR)
  const red = createSelectionId(12, { name: 'Red', hex: '#d32f2f' })

  assert.notEqual(black, red)
  assert.equal(black, 'item-12-#111111')
})

test('adds multiple colors for the same item without duplicates', () => {
  const selections = []
  const blackSelection = addSelectionVariant(selections, 12, DEFAULT_COLOR)
  const redSelection = addSelectionVariant(blackSelection, 12, { name: 'Red', hex: '#d32f2f' })
  const duplicateSelection = addSelectionVariant(redSelection, 12, DEFAULT_COLOR)

  assert.equal(redSelection.length, 2)
  assert.equal(duplicateSelection.length, 2)
  assert.deepEqual(redSelection.map((selection) => selection.color.name).sort(), ['Black', 'Red'])
})

test('removes one color variant without removing the other variant for the same item', () => {
  const selections = [
    { selectionId: 'item-12-#111111', itemId: 12, color: DEFAULT_COLOR },
    { selectionId: 'item-12-#d32f2f', itemId: 12, color: { name: 'Red', hex: '#d32f2f' } },
  ]

  const remaining = removeSelectionVariant(selections, 'item-12-#111111')

  assert.equal(remaining.length, 1)
  assert.equal(remaining[0].color.name, 'Red')
})

test('migrates legacy numeric selections to a default color while preserving the item', () => {
  const migrated = readStoredSelection([12, 8, 12])

  assert.deepEqual(migrated.selections, [
    { selectionId: 'item-12-#111111', itemId: 12, color: DEFAULT_COLOR },
    { selectionId: 'item-8-#111111', itemId: 8, color: DEFAULT_COLOR },
  ])
  assert.match(migrated.message, /migrated/i)
})
