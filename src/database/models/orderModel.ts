
import {Table,Column,Model,DataType}  from 'sequelize-typescript'
import { OrderStatus } from '../../globals/types'

@Table({
    tableName : "orders", 
    modelName : "Order", 
    timestamps : true
})

class Order extends Model{
    @Column({
        primaryKey : true, 
        type : DataType.UUID, 
        defaultValue : DataType.UUIDV4
    })
    declare id : string 

    @Column({
        type : DataType.STRING, 
        allowNull : false, 
        validate : {
            len : {
                args : [10,10], 
                msg : "Phone number must be 10 digits. 10 vanda sano thulo hunu vayena !"
            }
        }
    })
    declare phoneNumber : string 

    @Column({
        type : DataType.STRING, 
        allowNull : false
    })
    declare shippingAddress : string 

    @Column({
        type : DataType.FLOAT, 
        allowNull : false
    })
    declare totalAmount : number 

    @Column({
        type : DataType.ENUM(OrderStatus.Cancelled,OrderStatus.Delivered,OrderStatus.Ontheway,OrderStatus.Pending,OrderStatus.Preparation), 
        defaultValue : OrderStatus.Pending
    })
    declare orderStatus :string
}

export default Order