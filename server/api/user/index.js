import express from 'express'
import * as user from './controller'
import configs from '../../../configs/server'

const router = express.Router()

router.post('/login', user.login)
router.get('/me', user.getCurrentUser)
router.post('/register', user.Register)
router.put('/:id/password', user.ChangePassword)
router.post('/logout', user.Logout)
router.put('/:id/userinfo', user.ChangeUserInfo)
router.post('/:id/avatar', configs.service.proxy)

export default router
