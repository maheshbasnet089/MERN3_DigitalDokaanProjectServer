import {Sequelize} from 'sequelize-typescript'
import { envConfig } from '../config/config'

const sequelize = new Sequelize(envConfig.connectionString as string,{
    models : [__dirname + '/models']
})

try {
    sequelize.authenticate()
    .then(()=>{
        console.log("milyo hai authentication so ma connect vaye hai tw !!!")
    })
    .catch(err=>{
        console.log("error aayo", err)
    })
} catch (error) {
    console.log(error)
}

sequelize.sync({force : false}).then(()=>{
    console.log("local changes injected to database successfully")
})

export default sequelize