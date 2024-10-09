import { Router } from 'express'
import controller from '../controllers/xss.js'

const router = Router()

router.get('/', controller.index)
router.post('/', controller.create)

export default router
