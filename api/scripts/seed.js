import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { initializeDatabase, sequelize } from '../config/database.js'
import { Category, Item } from '../models/index.js'

const catalogPath = fileURLToPath(new URL('../data/catalog.json', import.meta.url))

function validateCatalog(catalog) {
  const categoryNames = new Set(catalog.categories)
  const itemKeys = new Set()

  if (categoryNames.size !== catalog.categories.length) {
    throw new Error('Catalog categories must have unique names.')
  }

  if (!Array.isArray(catalog.items) || catalog.items.length < 100) {
    throw new Error('The catalog must contain at least 100 items.')
  }

  for (const item of catalog.items) {
    if (!categoryNames.has(item.category)) {
      throw new Error(`Unknown category "${item.category}" for item "${item.name}".`)
    }

    if (item.url_photo !== null && typeof item.url_photo !== 'string') {
      throw new Error(`Invalid image value for item "${item.name}".`)
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

    for (const item of catalog.items) {
      const categoryId = categoryIds.get(item.category)
      const [, created] = await Item.findOrCreate({
        where: { name: item.name, categoryId },
        defaults: { name: item.name, categoryId, urlPhoto: item.url_photo },
        transaction,
      })
      createdItems += Number(created)
    }
  })

  return {
    categoriesInFile: catalog.categories.length,
    itemsInFile: catalog.items.length,
    categoriesCreated: createdCategories,
    itemsCreated: createdItems,
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seedCatalog()
    .then((result) => {
      console.log(
        `Catalog seed complete: ${result.categoriesCreated} categories and ${result.itemsCreated} items created.`,
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
