import { getItems, searchItems } from '../services/itemService.js'

export async function listItems(request, response) {
  const items = await getItems({
    categoryId: request.query.categoryId,
    ids: request.query.ids,
  })

  response.json({
    success: true,
    data: { items },
    message: 'Items retrieved successfully.',
  })
}

export async function searchItemList(request, response) {
  const items = await searchItems({
    query: request.query.q,
    categoryId: request.query.categoryId,
    limit: request.query.limit,
  })

  response.json({
    success: true,
    data: { items, total: items.length },
    message: 'Search results retrieved successfully.',
  })
}
