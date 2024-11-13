import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { envConfig } from "../config/config";
import UserController from "../controllers/userController";


class UserMiddleware{
    async isUserLoggedIn(req:Request,res:Response,next:NextFunction):Promise<void>{
        // receive token 
       const token =  req.headers.authorization // manish
       if(!token){
        res.status(403).json({
            message : "Token must be provided"
        })
        return
       }
        // validate token 
       jwt.verify(token,envConfig.jwtSecretKey as string, async (err,result)=>{
        if(err){
            res.status(403).json({
                message : "Invalid token !!!"
            })
        }else{
            console.log(result) //{userId : 123123123}
            // @ts-ignore
            req.userId = result.userId
            next()
        }
       })

    }
}

export default new UserMiddleware