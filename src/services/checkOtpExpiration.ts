import { Response } from "express"
import sendResponse from "./sendResponse"



const checkOtpExpiration = (res:Response,otpGeneratedTime:string,thresholdTime:number)=>{
    const currentTime = Date.now()
    if(currentTime - parseInt(otpGeneratedTime)  <= thresholdTime){
        // otp expires vako xainw
        sendResponse(res,200,"Valid OTP, now you can proceed to reset password 😌")
    }else{
        //otp expires vayo
        sendResponse(res,403,"OTP expiredd, Sorry try again later 😭!!")

    }
}

export default checkOtpExpiration