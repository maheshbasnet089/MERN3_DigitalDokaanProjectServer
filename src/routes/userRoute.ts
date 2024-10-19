
import express from 'express'
import UserController from '../controllers/userController'
const router = express.Router()

// router.post("/register",UserController.register)
// router.get("/register",UserController.register)

router.route("/register").post(UserController.register)

export default router 