import { Router } from 'express'
import controller from '../controllers/sql-injection.js'

const router = Router()

router.get('/', controller.login)
router.post('/', controller.processLogin)

export default router
