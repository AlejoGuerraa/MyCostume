import { Op } from 'sequelize'
import { Costume, Item } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'

function parseCostumeId(value) {
  const costumeId = Number(value)
  if (!Number.isSafeInteger(costumeId) || costumeId < 1) {
    throw new HttpError(400, 'costumeId must be a positive integer.')
  }

  return costumeId
}

function escapeLikeValue(value) {
  return value.replace(/[\\%_]/g, '\\$&')
}

export async function getCostumes() {
  return Costume.findAll({
    attributes: ['costumeId', 'name', 'urlPhoto'],
    order: [['name', 'ASC']],
  })
}

export async function getCostumeById(value) {
  const costumeId = parseCostumeId(value)
  const costume = await Costume.findByPk(costumeId, {
    attributes: ['costumeId', 'name', 'description', 'urlPhoto', 'source'],
    include: [
      {
        model: Item,
        as: 'items',
        attributes: ['itemId', 'name', 'urlPhoto'],
        through: { attributes: [] },
      },
    ],
    order: [[{ model: Item, as: 'items' }, 'name', 'ASC']],
  })

  if (!costume) {
    throw new HttpError(404, 'Character not found.')
  }

  return costume
}

export async function searchCostumes(query, limit) {
  const normalizedQuery = typeof query === 'string' ? query.trim() : ''
  if (!normalizedQuery) {
    return []
  }

  return Costume.findAll({
    where: {
      name: { [Op.like]: `%${escapeLikeValue(normalizedQuery)}%` },
    },
    attributes: ['costumeId', 'name', 'urlPhoto'],
    order: [['name', 'ASC']],
    limit,
  })
}
