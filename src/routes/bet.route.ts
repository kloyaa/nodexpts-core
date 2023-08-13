import { Router } from 'express'
import {
  createBet,
  getAllBets,
  getAllBetResults,
  createBetResult,
  getMyBets,
  deleteBetResult,
  getByReference,
  getMyBetResultsWithWins,
  getBetResultsBySchedule,
  getNumberFormulated,
  getDailyGross,
  checkNumberAvailability,
  createBulkBets
} from '../controllers/bet.controller'
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware'
import { isUserProfileCreated } from '../../__core/middlewares/is-user-profile-created.middleware'
const router = Router()

router.post('/bet/v1/place',
  isAuthenticated,
  isUserProfileCreated,
  createBet
)

router.post('/bet/v1/place-many',
  isAuthenticated,
  isUserProfileCreated,
  createBulkBets
)

router.get('/bet/v1/bets',
  isAuthenticated,
  isUserProfileCreated,
  getAllBets
)

router.get('/bet/v1/ref/:reference',
  isAuthenticated,
  isUserProfileCreated,
  getByReference
)

router.get('/bet/v1/my-bets',
  isAuthenticated,
  isUserProfileCreated,
  getMyBets
)

router.get('/bet/v1/daily-bet-results',
  isAuthenticated,
  isUserProfileCreated,
  getMyBetResultsWithWins
)

router.post('/bet/v1/result',
  isAuthenticated,
  isUserProfileCreated,
  createBetResult
)

router.get('/bet/v1/daily-result',
  isAuthenticated,
  isUserProfileCreated,
  getBetResultsBySchedule
)

router.delete('/bet/v1/remove',
  isAuthenticated,
  isUserProfileCreated,
  deleteBetResult
)

router.get('/bet/v1/results',
  isAuthenticated,
  isUserProfileCreated,
  getAllBetResults
)

router.get('/bet/v1/numberstats',
  isAuthenticated,
  isUserProfileCreated,
  getNumberFormulated
)

router.get('/bet/v1/number-availability',
  isAuthenticated,
  isUserProfileCreated,
  checkNumberAvailability
)

router.get('/bet/v1/daily-total',
  isAuthenticated,
  isUserProfileCreated,
  getDailyGross
)

export default router
