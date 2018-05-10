import express from 'express'
import * as account from './account'

const router = express.Router()

router.post('/login', account.login)
router.post('/me', account.getCurrentUser)
router.post('/register', account.Register)

export default router
