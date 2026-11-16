import { searchCatalog } from '../services/catalogSearchService.js'

export async function searchCatalogItems(request, response) {
  const results = await searchCatalog({
    query: request.query.q,
    categoryId: request.query.categoryId,
    limit: request.query.limit,
  })

  response.json({
    success: true,
    data: {
      ...results,
      total: results.items.length + results.costumes.length,
    },
    message: 'Catalog search results retrieved successfully.',
  })
}
