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

export async function searchItems(query, { categoryId, limit, signal } = {}) {
  const params = new URLSearchParams({ q: query })
  if (categoryId) {
    params.set('categoryId', categoryId)
  }
  if (limit !== undefined) {
    params.set('limit', String(limit))
  }

  const data = await request(`/items/search?${params}`, { signal })
  if (!Array.isArray(data.items)) {
    throw new Error('The catalog service returned invalid search results.')
  }

  return data.items
}
