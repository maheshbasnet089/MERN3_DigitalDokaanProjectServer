


import express, { Router } from 'express'
import orderController from '../controllers/orderController'
import userMiddleware from '../middleware/userMiddleware'
import errorHandler from '../services/errorHandler'
const router:Router = express.Router()

router.route("/").post(userMiddleware.isUserLoggedIn, errorHandler(orderController.createOrder))
router.route("/verify-pidx").post(userMiddleware.isUserLoggedIn,errorHandler(orderController.verifyTransaction))



export default router