import { Request, Response } from "express"
import Category from "../database/models/categoryModel"


/*
electronics, grocies, foods
seed mathi ko data , 

custom categories 
delete , fetch, update 
*/
class CategoryController{
    categoryData = [
        {
            categoryName : "Electronics"
        }, 
        {
            categoryName : "Groceries"
        },
        {
            categoryName : "Foods"
        }
    ]
    async seedCategory():Promise<void>{

            const datas = await Category.findAll()
            if(datas.length === 0){
                await Category.bulkCreate(this.categoryData)
                console.log("Categories seeded successfully")
            }else{
                console.log("Categories already seeded")
            }

      
    }
    async addCategory(req:Request,res:Response):Promise<void>{
        //@ts-ignore
       
        const {categoryName} = req.body 
        if(!categoryName){
            res.status(400).json({
                message : "Please provide categoryName"
            })
            return 
        }
        const category = await Category.create({
            categoryName
        })
        res.status(200).json({
            message : "Category created successfully ", 
            data : category
        })
    }
    async getCategories(req:Request,res:Response):Promise<void>{
        const data = await Category.findAll()
        res.status(200).json({
            messagage : "fetched categories", 
            data
        })
    }
    async deleteCategory(req:Request,res:Response):Promise<void>{
        const {id} = req.params 
        if(!id){
            res.status(400).json({
                message : "Please provide id to delete"
            })
            return 
        }
        const data = await Category.findAll({
            where : {
                id : id
            }
        }) // array return 
        // const data = await Category.findByPk(id) // object return 
        if(data.length === 0){
            res.status(404).json({
                message : "No category with that id"
            })
        }else{
            await Category.destroy({
                where : {
                    id 
                }
            })
            res.status(200).json({
                message : "category deleted successfully"
            })
        }
    }
    async updateCategory(req:Request,res:Response):Promise<void>{
        const {id} = req.params
        const {categoryName} = req.body 
        if(!id || !categoryName){
            res.status(400).json({
                message : "Please provide id, categoryName to update"
            })
            return 
        }
        const data = await Category.findAll({
            where : {
                id : id
            }
        }) // array return 
        // const data = await Category.findByPk(id) // object return 
        if(data.length === 0){
            res.status(404).json({
                message : "No category with that id"
            })
        }else{
            await Category.update({
                categoryName : categoryName
            },{
                where : {
                    id
                }
            })
            res.status(200).json({
                message : "Category updated successfully"
            })
        }
    }
}
export default new CategoryController