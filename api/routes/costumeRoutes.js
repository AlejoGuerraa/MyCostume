import { Router } from 'express'
import { getCostume, listCostumes } from '../controllers/costumeController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const costumeRouter = Router()

costumeRouter.get('/', asyncHandler(listCostumes))
costumeRouter.get('/:costumeId', asyncHandler(getCostume))

export default costumeRouter
