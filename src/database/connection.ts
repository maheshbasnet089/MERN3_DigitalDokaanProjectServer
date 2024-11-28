import {Sequelize} from 'sequelize-typescript'
import { envConfig } from '../config/config'
import Product from './models/productModel'
import Category from './models/categoryModel'
import User from './models/userModel'
import Order from './models/orderModel'
import Payment from './models/paymentModel'
import OrderDetails from './models/orderDetails'

const sequelize = new Sequelize(envConfig.connectionString as string,{
    models : [__dirname + '/models']
})

try {
    sequelize.authenticate()
    .then(()=>{
        console.log("Connected !!! 😀")
    })
    .catch(err=>{
        console.log("ERROR 😝 : ", err)
    })
} catch (error) {
    console.log(error)
}

sequelize.sync({force : false,alter:false}).then(()=>{
    console.log("synced !!")
})
// relationships // 
Category.hasOne(Product,{foreignKey:'categoryId'})
Product.belongsTo(Category,{foreignKey:'categoryId'})

// User X Order
User.hasMany(Order,{foreignKey:'userId'})
Order.belongsTo(User,{foreignKey:'userId'})

// Payment X Order 
Order.hasOne(Payment,{foreignKey:'orderId'})
Payment.belongsTo(Order,{foreignKey:'orderId'})

Order.hasOne(OrderDetails,{foreignKey:'orderId'})
OrderDetails.belongsTo(Order,{foreignKey:'orderId'})

Product.hasMany(OrderDetails,{foreignKey:'productId'})
OrderDetails.belongsTo(Product,{foreignKey:'productId'})
export default sequelize