import { Router } from 'express'
import { getMatchingCostumes } from '../controllers/matchingController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const matchingRouter = Router()

matchingRouter.post('/', asyncHandler(getMatchingCostumes))

export default matchingRouter
