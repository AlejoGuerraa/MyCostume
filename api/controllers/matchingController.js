import { findCostumeMatches } from '../services/matchingService.js'

export async function getMatchingCostumes(request, response) {
  const matches = await findCostumeMatches(request.body?.selectedItemIds)

  response.json({
    success: true,
    data: { matches },
    message: 'Character matches retrieved successfully.',
  })
}
