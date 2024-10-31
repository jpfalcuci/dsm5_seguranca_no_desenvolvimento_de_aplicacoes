import { Router } from 'express'
import controller from '../controllers/users.js'

const router = Router()
router.get('/', controller.retrieve)
router.get('/new', controller.newUser)
router.post('/', controller.upsert)

// /* GET all users. */
// router.get('/', function (req, res) {
//   res.send('Fetched all users')
// })

// /* POST a user. */
// router.post('/', function (req, res) {
//   res.send('Created a user')
// })

// /* PATCH a user. */
// router.patch('/', function (req, res) {
//   res.send('Updated a user')
// })

// /* DELETE a user. */
// router.delete('/', function (req, res) {
//   res.send('Deleted a user')
// })

export default router
