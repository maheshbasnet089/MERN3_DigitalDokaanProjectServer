import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from 'bcrypt'
import generateToken from "../services/generateToken";
import generateOtp from "../services/generateOtp";
import sendMail from "../services/sendMail";
import findData from "../services/findData";
import sendResponse from "../services/sendResponse";
import checkOtpExpiration from "../services/checkOtpExpiration";


class UserController{
    static async register(req:Request,res:Response){
        //incoming user data receive 
        const {username,email,password} = req.body
        if(!username || !email || !password){
            res.status(400).json({
                message : "Please provide username,email,password"
            })
            return
        }
        // check whether that email already exist or not 
        const [data] =  await User.findAll({
            where : {
                email : email
            }
        })
        if(data){
             res.status(400).json({
                message : "Please try again later !!!"
            })
            return
        }
        // data --> users table ma insert garne 
        const user = await User.create({
            username, 
            email, 
            password : bcrypt.hashSync(password,10), 
    
        })
        await sendMail({
            to : email, 
            subject : "Registration successfull on Digital Dokaan", 
            text : "Welcome to Digital Dokaan, Thank you for registering"
        })

        // await sequelize.query(`INSERT INTO users(id,username,email,password) VALUES (?,?,?,?)`, {
        //     replacements : ['b5a3f20d-6202-4159-abd9-0c33c6f70487', username,email,password], 
        // })

        res.status(201).json({
            message : "User registered successfully", 
    
        })
    }
    static async login(req:Request,res:Response){
        // accept incoming data --> email, password
        const {email, password} = req.body // password - manish --> hash() --> $234234324fjlsdf
        if(!email || !password){
            res.status(400).json({
                message : "Please provide email, password"
            })
            return 
        }

        // check email exist or not at first 
        const [user] = await User.findAll({  // find --> findAll --array , findById--> findByPk --Objecct
            where : {
                email : email, 
            }
        }) 
        // user --> password --> $234234324fjlsdf
        if(!user){
            res.status(404).json({
                message : "No user with that email 😭"
            })
        }else{
            // if yes --> email exist -> check password too 
            const isEqual = bcrypt.compareSync(password,user.password)
            if(!isEqual){
                res.status(400).json({
                    message : "Invalid password 😢"
                })
            }else{
                // if password milyo vane --> token generate(jwt)    
              const token = generateToken(user.id)
                res.status(200).json({
                    message : "Logged in success 🥰", 
                    token
                })
       }
        }

    }
    static async handleForgotPassword(req:Request,res:Response){
       
        const {email} = req.body 
        if(!email){
            res.status(400).json({message : "Please provide email"})
            return
        }
        
        // const [user] = await User.findAll({
        //     where : {
        //         email : email
        //     }
        // })
        const user = await findData(User,email)
        if(!user){
             res.status(404).json({
                email : "Email not registered"
            })
            return
        }
        // otp pathaunu paryo aba, generate otp, mail sent
        const otp = generateOtp()
        await sendMail({
            to : email, 
            subject : "Digital Dokaan Password Change Request", 
            text : `You just request to reset password. Here is your otp, ${otp}`
        })
        user.otp = otp.toString()
        user.otpGeneratedTime = Date.now().toString()
        await user.save()

        res.status(200).json({
            message : "Password Reset OTP sent!!!!"
        })

    }
    static async verifyOtp(req:Request,res:Response){
        const {otp,email} = req.body 
        if(!otp || !email){
            sendResponse(res,404, "Please provide otp and email")
            return
        }
        const user = await findData(User,email)
        if(!user){
            sendResponse(res,404,"No user with that email")
            return
        }
        // otp verification 
        const [data] = await User.findAll({
            where : {
                otp, 
                email
            }
        })
        if(!data){
            sendResponse(res,404,'Invalid OTP')
            return
        }
        const otpGeneratedTime = data.otpGeneratedTime
        checkOtpExpiration(res,otpGeneratedTime,120000)
    }
    static async resetPassword(req:Request,res:Response){
        const {newPassword,confirmPassword,email} = req.body 
        if(!newPassword || !confirmPassword || !email){
            sendResponse(res,400,'please provide newPassword,confirmPassword,email,otp')
            return
        }
        if(newPassword !== confirmPassword){
            sendResponse(res,400,'newpassword and confirm password must be same')
            return
        }
        const user = await findData(User,email)
        if(!user){
            sendResponse(res,404,'No email with that user')
        }
        user.password = bcrypt.hashSync(newPassword,12)
        await user.save()
        sendResponse(res,200,"Password reset successfully!!!")

    }
    static async fetchUsers(req:Request,res:Response){
        const users  = await User.findAll({
            attributes : ["id","username","email"]
        })
        res.status(200).json({
            message : "Users fetched successfully", 
            data : users
        })
    }
    static async deleteUser(req:Request,res:Response){
        const {id} = req.params
        if(!id){
            res.status(400).json({
                message : "Please provide Id "
            })
            return
        }
        await User.destroy({
            where : {
                id 
            }
        })
        res.status(200).json({
            message : "Users deleted successfully", 
           
        })
    }

}


export default UserController