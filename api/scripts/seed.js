import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { initializeDatabase, sequelize } from '../config/database.js'
import { Category, CostumeItem, Item } from '../models/index.js'

const catalogPath = fileURLToPath(new URL('../data/catalog.json', import.meta.url))
const colorNames = new Set([
  'black',
  'blue',
  'brown',
  'camel',
  'charcoal',
  'cream',
  'dark',
  'gray',
  'green',
  'khaki',
  'navy',
  'olive',
  'red',
  'silver',
  'tan',
  'white',
])

function getColorlessItemName(name) {
  return name
    .split(/\s+/)
    .filter((word) => !colorNames.has(word.toLowerCase()))
    .join(' ')
}

function validateCatalog(catalog) {
  if (!Array.isArray(catalog.categories) || !Array.isArray(catalog.items)) {
    throw new Error('Catalog categories and items must be arrays.')
  }

  const categoryNames = new Set(catalog.categories)
  const itemKeys = new Set()

  if (categoryNames.size !== catalog.categories.length) {
    throw new Error('Catalog categories must have unique names.')
  }

  if (catalog.items.length < 95) {
    throw new Error('The catalog must contain at least 95 items.')
  }

  for (const item of catalog.items) {
    if (!categoryNames.has(item.category)) {
      throw new Error(`Unknown category "${item.category}" for item "${item.name}".`)
    }

    if (
      typeof item.url_photo !== 'string' ||
      !/^\/item-images\/[a-z0-9-]+\.png$/.test(item.url_photo)
    ) {
      throw new Error(`Invalid local PNG image path for item "${item.name}".`)
    }

    const itemKey = `${item.category}\u0000${item.name}`
    if (itemKeys.has(itemKey)) {
      throw new Error(`Duplicate item "${item.name}" in category "${item.category}".`)
    }
    itemKeys.add(itemKey)
  }
}

export async function seedCatalog() {
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
  validateCatalog(catalog)
  await initializeDatabase()

  let createdCategories = 0
  let createdItems = 0
  let updatedItems = 0
  let mergedItems = 0

  await sequelize.transaction(async (transaction) => {
    const categoryIds = new Map()

    for (const name of catalog.categories) {
      const [category, created] = await Category.findOrCreate({
        where: { name },
        defaults: { name },
        transaction,
      })
      categoryIds.set(name, category.categoryId)
      createdCategories += Number(created)
    }

    const catalogItemsByKey = new Map()

    for (const item of catalog.items) {
      const categoryId = categoryIds.get(item.category)
      const [catalogItem, created] = await Item.findOrCreate({
        where: { name: item.name, categoryId },
        defaults: { name: item.name, categoryId, urlPhoto: item.url_photo },
        transaction,
      })
      createdItems += Number(created)
      if (!created && catalogItem.urlPhoto !== item.url_photo) {
        await catalogItem.update({ urlPhoto: item.url_photo }, { transaction })
        updatedItems += 1
      }
      catalogItemsByKey.set(`${categoryId}\u0000${item.name}`, catalogItem)
    }

    const existingItems = await Item.findAll({ transaction })
    for (const existingItem of existingItems) {
      const categoryId = existingItem.categoryId
      const colorlessName = getColorlessItemName(existingItem.name)
      if (colorlessName === existingItem.name) {
        continue
      }

      const catalogItem = catalogItemsByKey.get(`${categoryId}\u0000${colorlessName}`)
      if (!catalogItem) {
        continue
      }

      const costumeItems = await CostumeItem.findAll({
        where: { itemId: existingItem.itemId },
        transaction,
      })
      for (const costumeItem of costumeItems) {
        await CostumeItem.findOrCreate({
          where: {
            costumeId: costumeItem.costumeId,
            itemId: catalogItem.itemId,
          },
          defaults: {
            costumeId: costumeItem.costumeId,
            itemId: catalogItem.itemId,
          },
          transaction,
        })
      }

      await CostumeItem.destroy({
        where: { itemId: existingItem.itemId },
        transaction,
      })
      await existingItem.destroy({ transaction })
      mergedItems += 1
    }
  })

  return {
    categoriesInFile: catalog.categories.length,
    itemsInFile: catalog.items.length,
    categoriesCreated: createdCategories,
    itemsCreated: createdItems,
    itemsUpdated: updatedItems,
    legacyItemsMerged: mergedItems,
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seedCatalog()
    .then((result) => {
      console.log(
        `Catalog seed complete: ${result.categoriesCreated} categories, ${result.itemsCreated} items created, ${result.itemsUpdated} items updated, and ${result.legacyItemsMerged} legacy items merged.`,
      )
    })
    .catch((error) => {
      console.error('Catalog seed failed:', error.message)
      process.exitCode = 1
    })
    .finally(async () => {
      await sequelize.close()
    })
}
