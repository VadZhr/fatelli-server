const CategoriesModel= require('../models/categories-model');
const path = require('path');
const fs = require('fs');

class CategoryService{
    async addCategory(categoryName, categoryPath, categoryImagePath){
        try {
            const categoryData = await CategoriesModel.create({
                categoryName,
                categoryImagePath,
                categoryPath
            })
            return categoryData
        } catch (e) {
            console.log(e);
        }
    }
    async getAllCategories(){
        try {
            const data = await CategoriesModel.find()  
            const blobArr=[]
            data.forEach((el) => {
                const filePath = path.resolve(
                  __dirname,
                  "..",
                  "uploads",
                  el.categoryImagePath
                );
                // это надо выучить
                let data=null;
                let blob=null;
                // try {
                //     fs.accessSync(filePath, fs.constants.F_OK); 
                //     data = fs.readFileSync(filePath);
                //     blob = Buffer.from(data.buffer);
                       
                // } catch (e) {
                //     console.log('Такого файла '+el.categoryImagePath+' нет')
                // }
                if(blob){
                    blobArr.push({id:el._id, categoryName: el.categoryName, categoryImagePath:el.categoryImagePath, categoryPath:el.categoryPath, blob:'data:image/jpeg;base64,'+blob.toString("base64") });
                }else{
                    blobArr.push({id:el._id, categoryName: el.categoryName, categoryImagePath:el.categoryImagePath, categoryPath:el.categoryPath});
                }
                     
                  // это надо выучить
                
              });
            return blobArr
        } catch (e) {
            console.log(e);
        }
    }
    async edit(name, categoryPath, image){
        try {
            
        } catch (e) {
            console.log(e);
        }
    }
    async delete(id){
        try {
            
            const categoryData= await CategoriesModel.findById(id)
            if(!categoryData){
                return false
            }
            const filePath = path.resolve(__dirname, "..", "uploads", categoryData.categoryImagePath);
            // Это надо выучить
           
            try {
                fs.accessSync(filePath, fs.constants.F_OK); 
                fs.unlinkSync(filePath);
            } catch (error) {
                console.log('Такого файла '+el.categoryImagePath+' нет')
            }
            await CategoriesModel.deleteOne({_id:id});
            return true
        } catch (e) {
            console.log(e);
        }
    }
    async findCategory(id){
        try {
            const category = await CategoriesModel.findById(id);
            return category
        } catch (e) {
          console.log(e);  
        }
    }
}

module.exports = new CategoryService()