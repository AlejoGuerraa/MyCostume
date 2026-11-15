import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const catalogPath = fileURLToPath(new URL('../data/catalog.json', import.meta.url))
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))

test('catalog defines unique categories and at least 100 distinct items', () => {
  assert.equal(new Set(catalog.categories).size, catalog.categories.length)
  assert.ok(catalog.items.length >= 100)

  const itemKeys = catalog.items.map((item) => `${item.category}\u0000${item.name}`)
  assert.equal(new Set(itemKeys).size, itemKeys.length)
})

test('every item references a defined category and uses an allowed image value', () => {
  const categoryNames = new Set(catalog.categories)

  for (const item of catalog.items) {
    assert.ok(categoryNames.has(item.category), `${item.name} must reference a category`)
    assert.ok(item.url_photo === null || typeof item.url_photo === 'string')
  }
})
