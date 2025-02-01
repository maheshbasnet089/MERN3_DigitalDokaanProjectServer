


import express, { Router } from 'express'
import orderController from '../controllers/orderController'
import userMiddleware from '../middleware/userMiddleware'
import errorHandler from '../services/errorHandler'
const router:Router = express.Router()

router.route("/").post(userMiddleware.isUserLoggedIn, errorHandler(orderController.createOrder)).get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchMyOrders))

router.route("/:id").get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchMyOrderDetail))
router.route("/verify-pidx").post(userMiddleware.isUserLoggedIn,errorHandler(orderController.verifyTransaction))



export default router