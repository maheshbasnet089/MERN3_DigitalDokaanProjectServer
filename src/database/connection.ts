import {Sequelize} from 'sequelize-typescript'
import { envConfig } from '../config/config'
import Product from './models/productModel'
import Category from './models/categoryModel'

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

sequelize.sync({force : false,alter:true}).then(()=>{
    console.log("synced !!")
})
// relationships // 
Product.belongsTo(Category)
Category.hasOne(Product)

export default sequelize