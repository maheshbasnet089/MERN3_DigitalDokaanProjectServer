


const findData = async (model:any,query:string)=>{
   const [result] =  await model.findAll({
        where : {
            email : query
        }
    })
    return result
}

export default findData