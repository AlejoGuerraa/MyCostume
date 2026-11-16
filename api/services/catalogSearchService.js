import { searchCostumes } from './costumeService.js'
import { searchItems, validateSearchFilters } from './itemService.js'
import { HttpError } from '../utils/httpError.js'

export async function searchCatalog(filters = {}) {
  if (filters.query !== undefined && typeof filters.query !== 'string') {
    throw new HttpError(400, 'q must be a string.')
  }

  const { limit } = validateSearchFilters(filters)

  const [items, costumes] = await Promise.all([
    searchItems(filters),
    searchCostumes(filters.query, limit),
  ])

  return { items, costumes }
}
