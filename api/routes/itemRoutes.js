import { Router } from 'express'
import { listItems, searchItemList } from '../controllers/itemController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const itemRouter = Router()

itemRouter.get('/search', asyncHandler(searchItemList))
itemRouter.get('/', asyncHandler(listItems))

export default itemRouter
