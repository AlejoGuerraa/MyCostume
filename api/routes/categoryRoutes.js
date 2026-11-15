import { Router } from 'express'
import { listCategories } from '../controllers/categoryController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const categoryRouter = Router()

categoryRouter.get('/', asyncHandler(listCategories))

export default categoryRouter
