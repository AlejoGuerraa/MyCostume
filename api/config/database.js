import 'dotenv/config'
import mysql from 'mysql2/promise'
import { Sequelize } from 'sequelize'

const configuredPort = Number(process.env.DB_PORT || 3306)
const sequelizePort =
  Number.isInteger(configuredPort) && configuredPort > 0 && configuredPort <= 65535
    ? configuredPort
    : 3306

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'mycostume',
  process.env.DB_USER || 'mycostume',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: sequelizePort,
    dialect: 'mysql',
    logging: false,
  },
)

function getDatabaseConfig() {
  const requiredValues = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
  const missingValues = requiredValues.filter(
    (name) => typeof process.env[name] === 'undefined',
  )

  if (missingValues.length > 0) {
    throw new Error(`Missing required database environment variables: ${missingValues.join(', ')}`)
  }

  if (!/^[A-Za-z0-9_]{1,64}$/.test(process.env.DB_NAME)) {
    throw new Error('DB_NAME must be a valid MySQL database identifier.')
  }

  if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
    throw new Error('DB_PORT must be an integer between 1 and 65535.')
  }

  return {
    host: process.env.DB_HOST,
    port: configuredPort,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }
}

export async function initializeDatabase() {
  const config = getDatabaseConfig()
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
  })

  try {
    await connection.query(
      'CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
      [config.database],
    )
  } finally {
    await connection.end()
  }

  await sequelize.authenticate()
  await sequelize.sync()
}
