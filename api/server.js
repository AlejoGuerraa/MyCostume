import 'dotenv/config'
import app from './app.js'
import { initializeDatabase, sequelize } from './config/database.js'

const port = Number(process.env.PORT || 3000)

async function startServer() {
  await initializeDatabase()
  const server = app.listen(port, () => {
    console.log(`MyCostume API listening on port ${port}.`)
  })

  const shutdown = async () => {
    server.close(async () => {
      await sequelize.close()
      process.exit(0)
    })
  }

  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}

startServer().catch((error) => {
  console.error('Unable to start the API:', error.message)
  process.exitCode = 1
})
