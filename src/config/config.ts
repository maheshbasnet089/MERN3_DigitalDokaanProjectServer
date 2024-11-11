
import {config} from 'dotenv'
config()


export const envConfig = {
    port : process.env.PORT, 
    connectionString : process.env.CONNECTION_STRING, 
    jwtSecretKey : process.env.JWT_SECRET_KEY, 
    jwtExpiresIn : process.env.JWT_EXPIRES_IN, 
    email : process.env.EMAIL, 
    emailPassword : process.env.EMAIL_PASSWORD, 
    adminEmail : process.env.ADMIN_EMAIL, 
    adminPassword : process.env.ADMIN_PASSWORD, 
    adminUsername : process.env.ADMIN_USERNAME

}