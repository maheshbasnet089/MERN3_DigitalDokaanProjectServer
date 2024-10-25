import { Response } from "express"


const sendResponse = (res:Response,statusNumber:number,message:string,data:any=[])=>{
    res.status(statusNumber).json({
        message, 
        data : data.length >0 ? data : null
    })
    
}


export default sendResponse