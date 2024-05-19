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
                const data = fs.readFileSync(filePath);
                  // это надо выучить
                const blob = Buffer.from(data.buffer);
                blobArr.push({id:el._id, categoryName: el.categoryName, categoryImagePath:el.categoryImagePath, categoryPath:el.categoryPath, blob:'data:image/jpeg;base64,'+blob.toString("base64") });
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
            fs.unlinkSync(filePath);
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