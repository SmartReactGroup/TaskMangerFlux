import express from 'express'
import getGroups from './controller'

const router = express.Router()

router.get('/', getGroups)

export default router
