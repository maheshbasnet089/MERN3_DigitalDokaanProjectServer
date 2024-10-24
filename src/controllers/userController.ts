import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from 'bcrypt'
import generateToken from "../services/generateToken";
import generateOtp from "../services/generateOtp";
import sendMail from "../services/sendMail";


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
        // data --> users table ma insert garne 
        await User.create({
            username, 
            email, 
            password : bcrypt.hashSync(password,10), 
    
        })

        // await sequelize.query(`INSERT INTO users(id,username,email,password) VALUES (?,?,?,?)`, {
        //     replacements : ['b5a3f20d-6202-4159-abd9-0c33c6f70487', username,email,password], 
        // })

        res.status(201).json({
            message : "User registered successfully"
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
        
        const [user] = await User.findAll({
            where : {
                email : email
            }
        })
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
        res.status(200).json({
            message : "Password Reset OTP sent!!!!"
        })

    }
}


export default UserController