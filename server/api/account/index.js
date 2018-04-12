import express from 'express'
import * as account from './account'

const router = express.Router()

router.post('/login', account.login)
router.post('/me', account.getCurrentUser)

export default router
