import express from 'express'
import account from './account'

const router = express.Router()

// middleware that is specific to this router
// router.use((req, res, next) => next())
router.post('/login', account.login)

export default router
