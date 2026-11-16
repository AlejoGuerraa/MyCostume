import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import categoryRouter from './routes/categoryRoutes.js'
import costumeRouter from './routes/costumeRoutes.js'
import itemRouter from './routes/itemRoutes.js'
import matchingRouter from './routes/matchingRoutes.js'
import searchRouter from './routes/searchRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFound } from './middlewares/notFound.js'

const app = express()
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(helmet())
app.use(cors({ origin: clientOrigin }))
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (request, response) => {
  response.json({ success: true, data: { status: 'ok' }, message: 'API is ready.' })
})
app.use('/api/items', itemRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/costumes', costumeRouter)
app.use('/api/search', searchRouter)
app.use('/api/matches', matchingRouter)
app.use(notFound)
app.use(errorHandler)

export default app
