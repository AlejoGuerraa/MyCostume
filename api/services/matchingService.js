import { Costume, Item } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'

const MAX_SELECTED_ITEM_IDS = 100

export function normalizeSelectedItemIds(value) {
  if (!Array.isArray(value)) {
    throw new HttpError(400, 'selectedItemIds must be an array.')
  }

  if (value.length > MAX_SELECTED_ITEM_IDS) {
    throw new HttpError(
      400,
      `A maximum of ${MAX_SELECTED_ITEM_IDS} selected item IDs can be matched.`,
    )
  }

  return [...new Set(value.filter((itemId) => Number.isSafeInteger(itemId) && itemId > 0))]
}

export function rankCostumeMatches(costumes, selectedItemIds) {
  const selectedIds = new Set(selectedItemIds)
  const matches = []

  for (const costume of costumes) {
    const itemsById = new Map(
      costume.items.map((item) => [item.itemId, item]),
    )
    const items = [...itemsById.values()]
    const matchedItems = items.filter((item) => selectedIds.has(item.itemId))
    const totalItems = items.length

    if (matchedItems.length === 0 || totalItems === 0) {
      continue
    }

    const missingItems = totalItems - matchedItems.length
    matches.push({
      costume: {
        costumeId: costume.costumeId,
        name: costume.name,
        description: costume.description,
        urlPhoto: costume.urlPhoto,
      },
      items,
      matchedItems: matchedItems.length,
      totalItems,
      missingItems,
      matchPercentage: Number(((matchedItems.length / totalItems) * 100).toFixed(2)),
    })
  }

  return matches.sort(
    (first, second) =>
      second.matchedItems - first.matchedItems ||
      first.missingItems - second.missingItems ||
      second.matchPercentage - first.matchPercentage ||
      first.costume.name.localeCompare(second.costume.name),
  )
}

export async function findCostumeMatches(selectedItemIds) {
  const normalizedIds = normalizeSelectedItemIds(selectedItemIds)
  if (normalizedIds.length === 0) {
    return []
  }

  const costumes = await Costume.findAll({
    attributes: ['costumeId', 'name', 'description', 'urlPhoto'],
    include: [
      {
        model: Item,
        as: 'items',
        attributes: ['itemId', 'name', 'urlPhoto'],
        through: { attributes: [] },
      },
    ],
    order: [['name', 'ASC']],
  })

  return rankCostumeMatches(costumes, normalizedIds)
}
