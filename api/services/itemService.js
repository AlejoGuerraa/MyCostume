import { Op } from 'sequelize'
import { Category, Item } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'

function parsePositiveInteger(value, fieldName) {
  if (value === undefined) {
    return undefined
  }

  const parsedValue = Number(value)
  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
    throw new HttpError(400, `${fieldName} must be a positive integer.`)
  }

  return parsedValue
}

function parseItemIds(value) {
  if (value === undefined) {
    return undefined
  }

  const values = value.split(',')
  if (values.length > 100) {
    throw new HttpError(400, 'A maximum of 100 item IDs can be requested.')
  }

  const itemIds = values.map((entry) => parsePositiveInteger(entry, 'ids'))
  if (new Set(itemIds).size !== itemIds.length) {
    throw new HttpError(400, 'Item IDs must not contain duplicates.')
  }

  return itemIds
}

function parseLimit(value) {
  const limit = parsePositiveInteger(value, 'limit')
  if (limit !== undefined && limit > 100) {
    throw new HttpError(400, 'limit must not exceed 100.')
  }

  return limit
}

function escapeLikeValue(value) {
  return value.replace(/[\\%_]/g, '\\$&')
}

function buildItemQuery({ categoryId, ids, query, limit }) {
  const where = {}
  const parsedCategoryId = parsePositiveInteger(categoryId, 'categoryId')
  const parsedIds = parseItemIds(ids)
  const parsedLimit = parseLimit(limit)

  if (parsedCategoryId !== undefined) {
    where.categoryId = parsedCategoryId
  }

  if (parsedIds !== undefined) {
    where.itemId = { [Op.in]: parsedIds }
  }

  const normalizedQuery = typeof query === 'string' ? query.trim() : ''
  if (normalizedQuery) {
    where.name = { [Op.like]: `%${escapeLikeValue(normalizedQuery)}%` }
  }

  return {
    where,
    limit: parsedLimit,
  }
}

export async function getItems(filters = {}) {
  const { where, limit } = buildItemQuery(filters)

  return Item.findAll({
    where,
    attributes: ['itemId', 'name', 'urlPhoto', 'categoryId'],
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['categoryId', 'name'],
      },
    ],
    order: [['name', 'ASC']],
    ...(limit === undefined ? {} : { limit }),
  })
}

export async function searchItems(filters = {}) {
  const normalizedQuery = typeof filters.query === 'string' ? filters.query.trim() : ''
  if (!normalizedQuery) {
    return []
  }

  return getItems(filters)
}

export function validateSearchFilters(filters = {}) {
  return buildItemQuery(filters)
}

export async function getCategories() {
  return Category.findAll({
    attributes: ['categoryId', 'name'],
    order: [['name', 'ASC']],
  })
}
