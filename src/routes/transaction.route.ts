import { Router } from 'express'
import { createTransaction, getTransactionByReference, getTransactions, getTransactionsByUser } from '../controllers/transaction.controller'
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware'

const router = Router()

router.post('/transaction/v1',
  isAuthenticated,
  createTransaction
)

router.get('/transaction/v1/ref/:reference',
  isAuthenticated,
  getTransactionByReference
)

router.get('/transaction/v1/all',
  isAuthenticated,
  getTransactions
)

router.get('/transaction/v1/me',
  isAuthenticated,
  getTransactionsByUser
)

export default router
