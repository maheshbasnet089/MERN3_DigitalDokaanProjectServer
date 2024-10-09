import { Sequelize } from "sequelize-typescript";



const sequelize  = new Sequelize('postgresql://postgres.gyezfcbnxzicekdrjliv:hahahehehuhu123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',{
    models : [__dirname + "/models"]
})

try {
    sequelize.authenticate().then(()=>{
        console.log("connected")
    }).catch((err)=>{
        console.log(err)
    })
} catch (error) {
    console.log(error)
}

sequelize.sync({force : false}).then(()=>{
    console.log("synced !!!")
})

export default sequelize