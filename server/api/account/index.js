import express from 'express'
import * as account from './account'

const router = express.Router()

router.post('/login', account.login)
router.post('/me', account.getCurrentUser)
router.post('/register', account.Register)
router.post('/:id/password', account.ChangePassword)
router.post('/logout', account.Logout)

export default router
