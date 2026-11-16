import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const catalogPath = fileURLToPath(new URL('../data/catalog.json', import.meta.url))
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))

test('catalog defines unique categories and at least 95 distinct items', () => {
  assert.equal(new Set(catalog.categories).size, catalog.categories.length)
  assert.ok(catalog.items.length >= 95)

  const itemKeys = catalog.items.map((item) => `${item.category}\u0000${item.name}`)
  assert.equal(new Set(itemKeys).size, itemKeys.length)
})

test('every item references a defined category and an existing transparent PNG', async () => {
  const categoryNames = new Set(catalog.categories)
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  for (const item of catalog.items) {
    assert.ok(categoryNames.has(item.category), `${item.name} must reference a category`)
    assert.match(item.url_photo, /^\/item-images\/[a-z0-9-]+\.png$/)

    const imagePath = fileURLToPath(
      new URL(`../../client/public${item.url_photo}`, import.meta.url),
    )
    const image = await readFile(imagePath)
    assert.deepEqual(image.subarray(0, pngSignature.length), pngSignature)
    assert.equal(image.readUInt32BE(16), 400)
    assert.equal(image.readUInt32BE(20), 400)
    assert.equal(image[25], 6, `${item.name} PNG must include an alpha channel`)
  }
})
