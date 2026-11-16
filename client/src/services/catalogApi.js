const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(path, { signal } = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new Error('Unable to connect to the catalog service.', { cause: error })
  }

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error('The catalog service returned an invalid response.')
  }

  if (!response.ok || result.success !== true) {
    throw new Error(result.message || 'The catalog request failed.')
  }

  return result.data
}

export async function fetchCategories({ signal } = {}) {
  const data = await request('/categories', { signal })
  if (!Array.isArray(data.categories)) {
    throw new Error('The catalog service returned invalid categories.')
  }

  return data.categories
}

export async function fetchItems({ categoryId, ids, signal } = {}) {
  const params = new URLSearchParams()
  if (categoryId) {
    params.set('categoryId', categoryId)
  }
  if (Array.isArray(ids) && ids.length > 0) {
    params.set('ids', ids.join(','))
  }

  const query = params.size > 0 ? `?${params}` : ''
  const data = await request(`/items${query}`, { signal })
  if (!Array.isArray(data.items)) {
    throw new Error('The catalog service returned invalid items.')
  }

  return data.items
}

export async function fetchCostumes({ signal } = {}) {
  const data = await request('/costumes', { signal })
  if (!Array.isArray(data.costumes)) {
    throw new Error('The catalog service returned invalid characters.')
  }

  return data.costumes
}

export async function fetchCostume(costumeId, { signal } = {}) {
  const data = await request(`/costumes/${encodeURIComponent(costumeId)}`, { signal })
  if (!data.costume || !Array.isArray(data.costume.items)) {
    throw new Error('The catalog service returned invalid character details.')
  }

  return data.costume
}

export async function searchCatalog(query, { categoryId, limit, signal } = {}) {
  const params = new URLSearchParams({ q: query })
  if (categoryId) {
    params.set('categoryId', categoryId)
  }
  if (limit !== undefined) {
    params.set('limit', String(limit))
  }

  const data = await request(`/search?${params}`, { signal })
  if (!Array.isArray(data.items) || !Array.isArray(data.costumes)) {
    throw new Error('The catalog service returned invalid catalog search results.')
  }

  return { items: data.items, costumes: data.costumes }
}
