import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from 'axios'
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

interface IProduct{
    productId : string, 
    productQty : string 
}

interface OrderRequest extends Request{
    user? : {
        id : string
    }
}

class OrderWithPaymentId extends Order{
  declare paymentId : string | null 
}

class OrderController{
    static async createOrder(req:OrderRequest,res:Response):Promise<void>{
        const userId =  req.user?.id
        const {phoneNumber,firstName,lastName, email, city,addressLine,state,zipCode, totalAmount,paymentMethod} = req.body 
        const products:IProduct[] = req.body.products
        console.log(req.body)
        if(!phoneNumber || !city || !addressLine || !state || !zipCode || !totalAmount || products.length == 0 || !firstName || !lastName || !email ){
            res.status(400).json({
                message : "Please provide phoneNumber,shippingAddress,totalAmount,products"
            })
            return
        }
        // for order 
        
        let data; 
        const paymentData = await Payment.create({
     
          paymentMethod : paymentMethod, 
      })
      const orderData = await Order.create({
        phoneNumber, 
        city, 
        state, 
        zipCode, 
        addressLine,
        totalAmount, 
        userId, 
        firstName, 
        lastName, 
        email, 
        paymentId : paymentData.id
    })
        // for orderDetails
      products.forEach(async function(product){
        data = await OrderDetails.create({
            quantity : product.productQty, 
            productId : product.productId, 
            orderId : orderData.id
        })

        await Cart.destroy({
          where : {
            productId : product.productId, 
            userId : userId
          }
        })
      })

      // for payment

     if (paymentMethod == PaymentMethod.Khalti){
        // khalti logic
        
        const data = {
          return_url : "http://localhost:5173/", 
          website_url : "http://localhost:5173/", 
          amount : totalAmount * 100, 
          purchase_order_id : orderData.id, 
          purchase_order_name : "order_" + orderData.id
        }
       const response =  await axios.post("https://a.khalti.com/api/v2/epayment/initiate/",data,{
          headers : {
            Authorization : "Key b71142e3f4fd4da8acccd01c8975be38"
          }
        })
      const khaltiResponse = response.data 
      paymentData.pidx = khaltiResponse.pidx
      paymentData.save()
      res.status(200).json({
        message : "Order created successfully", 
        url : khaltiResponse.payment_url, 
        pidx : khaltiResponse.pidx,  
        data

      })
      }else if(paymentMethod == PaymentMethod.Esewa){

      }else{
        res.status(200).json({
          message : "Order created successfully",
          data
        })
      }
 
    }
    static async verifyTransaction(req:OrderRequest,res:Response):Promise<void>{
      const {pidx} = req.body 
      if(!pidx){
        res.status(400).json({
          message : "Please provide pidx"
        })
        return
      }
      const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{
        pidx : pidx
      },{
        headers : {
          "Authorization" : "Key b71142e3f4fd4da8acccd01c8975be38"
        }
      })
      const data = response.data 
      if(data.status === "Completed"){
        await Payment.update({paymentStatus : PaymentStatus.Paid},{
          where : {
            pidx : pidx 
          }
        })
        res.status(200).json({
          message : "Payment verified successfully !!"
        })
      }else{
        res.status(200).json({
          message : "Payment not verified or cancelled"
        })
      }

    }
    static async fetchMyOrders(req:OrderRequest,res:Response):Promise<void>{
      const userId = req.user?.id 
      const orders = await Order.findAll({
        where : {
          userId
        }, 
        attributes : ["totalAmount","id","orderStatus"], 
        include : {
          model : Payment, 
          attributes : ["paymentMethod", "paymentStatus"]
        }
      })
      if(orders.length > 0){
        res.status(200).json({
          message : "Order fetched successfully", 
          data : orders 
        })
      }else{
        res.status(404).json({
          message : "No order found", 
          data : []
        })
      }
    }
    static async fetchAllOrders(req:OrderRequest,res:Response):Promise<void>{
      
      const orders = await Order.findAll({
       
        attributes : ["totalAmount","id","orderStatus"], 
        include : {
          model : Payment, 
          attributes : ["paymentMethod", "paymentStatus"]
        }
      })
      if(orders.length > 0){
        res.status(200).json({
          message : "Order fetched successfully", 
          data : orders 
        })
      }else{
        res.status(404).json({
          message : "No order found", 
          data : []
        })
      }
    }
    static async fetchMyOrderDetail(req:OrderRequest,res:Response):Promise<void>{
      const orderId = req.params.id 
      const userId = req.user?.id 
      const orders = await OrderDetails.findAll({
        where : {
          orderId, 

        }, 
        include : [{
          model : Order , 
          include : [
            {
              model : Payment, 
              attributes : ["paymentMethod","paymentStatus"]
            }
          ],
          attributes : ["orderStatus","AddressLine","City","State","totalAmount","phoneNumber", "firstName", "lastName","userId"]
        },{
          model : Product, 
          include : [{
            model : Category
          }], 
          attributes : ["productImageUrl","productName","productPrice"]
        }]
      })
      if(orders.length > 0){
        res.status(200).json({
          message : "Order fetched successfully", 
          data : orders 
        })
      }else{
        res.status(404).json({
          message : "No order found", 
          data : []
        })
      }
    }
    static async cancelMyOrder(req:OrderRequest,res:Response):Promise<void>{
      const userId = req.user?.id 
      const orderId = req.params.id 
      const [order] = await Order.findAll({
        where : {
          userId : userId, 
          id : orderId 
        }
      })
      if(!order){
        res.status(400).json({
          message : "No order with that Id"
        })
        return 
      }
      // check order status 
      if(order.orderStatus === OrderStatus.Ontheway || order.orderStatus === OrderStatus.Preparation){
        res.status(403).json({
          message : "You cannot cancelled order, it is on the way or preparation mode"
        })
        return
      }
      await Order.update({orderStatus : OrderStatus.Cancelled},{
        where : {
          id : orderId
        }
      })
      res.status(200).json({
        message : "Order cancelled successfully"
      })
    }
    static async changeOrderStatus(req:OrderRequest,res:Response) : Promise<void>{
      const orderId = req.params.id 
      const {orderStatus} = req.body
      if(!orderId || !orderStatus){
        res.status(400).json({
          message : "Please provide orderId and orderStatus"
        })
      }
      await Order.update({orderStatus : orderStatus},{
        where : {
          id : orderId
        }
      })
      res.status(200).json({
        message : "Order status updated successfully"
      })
    }
    static async deleteOrder(req:OrderRequest, res:Response) : Promise<void>{

      const orderId = req.params.id 
      const order : OrderWithPaymentId= await Order.findByPk(orderId) as OrderWithPaymentId
      const paymentId = order?.paymentId
      if(!order){
        res.status(404).json({
          message : "You dont have that orderId order"
        })
        return
      }
      await OrderDetails.destroy({
        where : {
          orderId : orderId
        }
      })
      await Payment.destroy({
        where : {
          id : paymentId
        }
      })
      await Order.destroy({
        where : {
          id : orderId
        }
      })
      res.status(200).json({
        message : "Order delete successfully"
      })
    }

}

export default OrderController

