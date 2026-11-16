import { Router } from 'express'
import { searchCatalogItems } from '../controllers/searchController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const searchRouter = Router()

searchRouter.get('/', asyncHandler(searchCatalogItems))

export default searchRouter
