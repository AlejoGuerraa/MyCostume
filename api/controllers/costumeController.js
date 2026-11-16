import { getCostumeById, getCostumes } from '../services/costumeService.js'

export async function listCostumes(request, response) {
  const costumes = await getCostumes()

  response.json({
    success: true,
    data: { costumes },
    message: 'Characters retrieved successfully.',
  })
}

export async function getCostume(request, response) {
  const costume = await getCostumeById(request.params.costumeId)

  response.json({
    success: true,
    data: { costume },
    message: 'Character retrieved successfully.',
  })
}
