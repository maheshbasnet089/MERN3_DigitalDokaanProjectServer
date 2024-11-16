


import express,{Router} from 'express'
import categoryController from '../controllers/categoryController'
import userMiddleware, { Role } from '../middleware/userMiddleware'
const router:Router = express.Router()

router.route("/").get(categoryController.getCategories).post(userMiddleware.isUserLoggedIn, userMiddleware.restrictTo(Role.Admin),categoryController.addCategory)
router.route("/:id").patch(categoryController.updateCategory).delete(categoryController.deleteCategory)

export default router 