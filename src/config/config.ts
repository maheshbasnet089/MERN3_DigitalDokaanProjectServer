
import {config} from 'dotenv'
config()


export const envConfig = {
    port : process.env.PORT, 
    connectionString : process.env.CONNECTION_STRING
}