import { getCategories } from '../services/itemService.js'

export async function listCategories(request, response) {
  const categories = await getCategories()

  response.json({
    success: true,
    data: { categories },
    message: 'Categories retrieved successfully.',
  })
}
