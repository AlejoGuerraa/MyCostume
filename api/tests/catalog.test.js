import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const catalogPath = fileURLToPath(new URL('../data/catalog.json', import.meta.url))
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

function assertSupportedImage(image, name) {
  const isPng = image.subarray(0, pngSignature.length).equals(pngSignature)
  const isJpeg = image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff
  const isWebp =
    image.toString('ascii', 0, 4) === 'RIFF' &&
    image.toString('ascii', 8, 12) === 'WEBP'
  const imageBrand = image.toString('ascii', 4, 12)
  const isAvif = imageBrand === 'ftypavif' || imageBrand === 'ftypavis'

  assert.ok(
    isPng || isJpeg || isWebp || isAvif,
    `${name} must use a supported image format`,
  )
  return isPng
}

test('catalog defines unique categories and at least 95 distinct items', () => {
  assert.equal(new Set(catalog.categories).size, catalog.categories.length)
  assert.ok(catalog.items.length >= 95)

  const itemKeys = catalog.items.map((item) => `${item.category}\u0000${item.name}`)
  assert.equal(new Set(itemKeys).size, itemKeys.length)
})

test('every item references a defined category and an existing supported image', async () => {
  const categoryNames = new Set(catalog.categories)

  for (const item of catalog.items) {
    assert.ok(categoryNames.has(item.category), `${item.name} must reference a category`)
    assert.match(item.url_photo, /^\/item-images\/[a-z0-9-]+\.png$/)

    const imagePath = fileURLToPath(
      new URL(`../../client/public${item.url_photo}`, import.meta.url),
    )
    const image = await readFile(imagePath)
    const isPng = assertSupportedImage(image, item.name)
    if (isPng) {
      assert.equal(image[25], 6, `${item.name} PNG must include an alpha channel`)
    }
  }
})

test('every costume references an existing browser-compatible image', async () => {
  for (const costume of catalog.costumes) {
    assert.match(
      costume.url_photo,
      /^\/costume-images\/[a-z0-9_% -]+\.png$/i,
      `${costume.name} must reference a local PNG image`,
    )

    const imagePath = fileURLToPath(
      new URL(`../../client/public${costume.url_photo}`, import.meta.url),
    )
    const image = await readFile(imagePath)
    assertSupportedImage(image, costume.name)
  }
})

test('costumes and costume-item links reference unique catalog records', () => {
  assert.ok(Array.isArray(catalog.costumes))
  assert.ok(Array.isArray(catalog.costume_items))

  const costumeNames = catalog.costumes.map((costume) => costume.name)
  assert.equal(new Set(costumeNames).size, costumeNames.length)

  const itemNames = new Set(catalog.items.map((item) => item.name))
  const knownCostumes = new Set(costumeNames)

  for (const link of catalog.costume_items) {
    assert.ok(knownCostumes.has(link.costume_name), `${link.costume_name} must exist`)
    assert.ok(itemNames.has(link.item_name), `${link.item_name} must exist`)
  }
})
