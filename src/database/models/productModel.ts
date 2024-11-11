import {Table,Column,Model,DataType} from 'sequelize-typescript'


@Table({
    tableName : "products", 
    modelName : "Product", 
    timestamps : true
})

class Product extends Model{
    @Column({
        primaryKey : true, 
        type : DataType.UUID, 
        defaultValue : DataType.UUIDV4
    })
    declare id:string

    @Column({
        type : DataType.STRING, 
        allowNull : false
    })
    declare productName:string


    @Column({
        type : DataType.TEXT
    })
    declare productDescription:string

    @Column({
        type : DataType.FLOAT, 
        allowNull : false
    })
    declare productPrice:number

    @Column({
        type : DataType.INTEGER,
        allowNull : false
    })
    declare productTotalStock:number

    @Column({
        type : DataType.INTEGER, 
        allowNull : false
    })
    declare discount:number

    @Column({
        type : DataType.STRING
    })
    declare productImageUrl : string
}

export default Product