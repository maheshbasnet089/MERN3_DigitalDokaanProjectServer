import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod } from "../globals/types";
import Payment from "../database/models/paymentModel";

interface IProduct{
    productId : string, 
    productQty : string 
}

interface OrderRequest extends Request{
    user? : {
        id : string
    }
}

class OrderController{
    static async createOrder(req:OrderRequest,res:Response):Promise<void>{
        const userId =  req.user?.id
        const {phoneNumber,shippingAddress,totalAmount,paymentMethod} = req.body 
        const products:IProduct[] = req.body.products
        if(!phoneNumber || !shippingAddress || !totalAmount || products.length == 0 ){
            res.status(400).json({
                message : "Please provide phoneNumber,shippingAddress,totalAmount,products"
            })
            return
        }
        // for order 
        const orderData = await Order.create({
            phoneNumber, 
            shippingAddress, 
            totalAmount, 
            userId
        })
        // for orderDetails
        console.log(orderData,"OrderData!!")
        console.log(products)
      products.forEach(async function(product){
        await OrderDetails.create({
            quantity : product.productQty, 
            productId : product.productId, 
            orderId : orderData.id
        })
      })
      // for payment 
      if(paymentMethod == PaymentMethod.COD){
        await Payment.create({
            orderId : orderData.id, 
            paymentMethod : paymentMethod, 
        })
      }else if (paymentMethod == PaymentMethod.Khalti){
        // khalti logic
      }else{
        // esewa logic

      }
      res.status(200).json({
        message : "Order created successfully"
      })
    }
}

export default OrderController

/* 
{  
    shippingAddress : "Itahari", 
    phoneNumber : 912323, 
    totalAmount : 1232, 
    products : [{
 productId : 89123123, 
 qty : 2 
},
 {productId : 123123, 
 qty : 1
}]
}
*/