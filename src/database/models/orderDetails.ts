import {Table,Column,Model,DataType}  from 'sequelize-typescript'


@Table({
    tableName : "orderDetails", 
    modelName : "OrderDetails", 
    timestamps : true
})

class OrderDetails extends Model{
    @Column({
        primaryKey : true, 
        type : DataType.UUID, 
        defaultValue : DataType.UUIDV4
    })
    declare id : string 

    @Column({
        type : DataType.INTEGER, 
        allowNull : false 
    })
    declare quantity : number 
}

export default OrderDetails