import express, { type Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import connectDB from '../__core/utils/db.util'
import path from 'path'

import authRoute from './routes/auth.route'
import profileRoute from './routes/profile.route'
import betRoute from './routes/bet.route'
import employeeRoute from './routes/employee.route'
import acitvityRoute from './routes/activity.route'
import configRoute from './routes/config.route'
import transactionRoute from './routes/transaction.route'
import { maintenanceModeMiddleware } from '../__core/middlewares/is-maintenance-mode.middleware'

const app: Application = express()
const envVars = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  ENVIRONMENT_MAINTENANCE: process.env.ENVIRONMENT_MAINTENANCE,
  PORT: process.env.PORT,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  DB_CONNECTION_STRING_LOCAL: process.env.DB_CONNECTION_STRING_LOCAL,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_SECRET_NAME: process.env.AWS_SECRET_NAME,
  BET_DOUBLE_NUM_LIMIT: process.env.BET_DOUBLE_NUM_LIMIT,
  BET_TRIPLE_NUM_LIMIT: process.env.BET_TRIPLE_NUM_LIMIT,
  BET_NORMAL_NUM_LIMIT: process.env.BET_NORMAL_NUM_LIMIT,
  BET_RAMBLE_NUM_LIMIT: process.env.BET_RAMBLE_NUM_LIMIT
}

async function runApp () {
  // Middleware
  app.use(helmet()) // Apply standard security headers
  app.use(cors({
    exposedHeaders: [
      'SWSYA-Txn-Total', 
      'SWSYA-Txn-Count',
      'SWSYA-Stl-Count',
      'SWSYA-Swt-Count',
      'SWSYA-Txn-Revenue'
    ]
  })) // Enable CORS for all routes
  app.use(express.json())
  app.use(express.static(path.join(__dirname, 'public')))

  // Routes
  app.use(maintenanceModeMiddleware)
  app.use('/api', authRoute)
  app.use('/api', profileRoute)
  app.use('/api', betRoute)
  app.use('/api', employeeRoute)
  app.use('/api', acitvityRoute)
  app.use('/api', configRoute)
  app.use('/api', transactionRoute)

  app.get('/', (_, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') })
  })

  // Connect to MongoDB
  connectDB()

  // Start the server
  app.listen(Number(envVars.PORT) || 5000, () => {
    console.log({
      Environment: envVars.ENVIRONMENT,
      Port: envVars.PORT
    })
  })
}

runApp()

export default app
