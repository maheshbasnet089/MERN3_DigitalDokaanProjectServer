import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { envConfig } from "../config/config";
import UserController from "../controllers/userController";
import User from "../database/models/userModel";

export enum Role{
    Admin = 'admin', 
    Customer = "customer"
}

interface IExtendedRequest extends Request{
    user? : {
        username : string, 
        email : string, 
        role : string, 
        password : string, 
        id : string

    }
}
class UserMiddleware{
    async isUserLoggedIn(req:IExtendedRequest,res:Response,next:NextFunction):Promise<void>{
        // receive token 
       const token =  req.headers.authorization // manish
       if(!token){
        res.status(403).json({
            message : "Token must be provided"
        })
        return
       }
        // validate token 
       jwt.verify(token,envConfig.jwtSecretKey as string, async (err,result:any)=>{
        if(err){
            res.status(403).json({
                message : "Invalid token !!!"
            })
        }else{
         //{userId : 123123123}
            const userData = await User.findByPk(result.userId) // {email:"",pass:"",role:""}
            if(!userData){
                res.status(404).json({
                    message : "No user with that userId"
                })
                return
            }
            req.user = userData 
            next()
        }
       })

    }
    restrictTo(...roles:Role[]){
        return (req:IExtendedRequest,res:Response,next:NextFunction)=>{
            let userRole = req.user?.role as Role
            console.log(userRole,"ROle")
        }
    }
}





export default new UserMiddleware