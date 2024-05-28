const ProductModel = require("../models/product-model");
const path = require("path");
const fs = require("fs");
const { ObjectId } = require("mongodb");
const ApiError = require("../exceptions/api-error");

class ProductService{
    async addProduct(productData){
        try {
        
            const product = await ProductModel.create({
                ...productData
            })
            return product
        } catch (e) {
            console.log(e,'addProduct');
        }
    }
    async deleteProduct(id){
        try {
           const productData = await ProductModel.findById(id);
           const filePath = path.resolve(
            __dirname,
            "..",
            "uploads",
            productData.productMainImage[0]
          );
          try {
            fs.accessSync(filePath, fs.constants.F_OK); 
            fs.unlinkSync(filePath);
          } catch (e) {
            console.log('Такого файла нет '+' deleteProduct');
          }
          
          productData.productImagesWhiteBG.forEach(el=>{
            const filePath = path.resolve(
                __dirname,
                "..",
                "uploads",
                el
              );
              try {
                fs.accessSync(filePath, fs.constants.F_OK); 
                fs.unlinkSync(filePath);
              } catch (e) {
                console.log('Такого файла нет '+' deleteProduct');
              }
          })
          productData.productImageInterior.forEach(el=>{
            const filePath = path.resolve(
                __dirname,
                "..",
                "uploads",
                el
              );
              try {
                fs.accessSync(filePath, fs.constants.F_OK); 
                fs.unlinkSync(filePath);
              } catch (e) {
                console.log('Такого файла нет '+' deleteProduct');
              }
          })
          productData.productImageColored.forEach(el=>{
            const filePath = path.resolve(
                __dirname,
                "..",
                "uploads",
                el
              );
              try {
                fs.accessSync(filePath, fs.constants.F_OK); 
                fs.unlinkSync(filePath);
              } catch (e) {
                console.log('Такого файла нет '+' deleteProduct');
              }
          })
          productData.productDocuments.forEach(el=>{
            const filePath = path.resolve(
                __dirname,
                "..",
                "files",
                el
              );
              try {
                fs.accessSync(filePath, fs.constants.F_OK); 
                fs.unlinkSync(filePath);
              } catch (e) {
                console.log('Такого файла нет '+' deleteProduct');
              }
          })
          productData.productParamsImage.forEach(el=>{
            const filePath = path.resolve(
              __dirname,
              "..",
              "files",
              el
            );
            try {
              fs.accessSync(filePath, fs.constants.F_OK); 
              fs.unlinkSync(filePath);
            } catch (e) {
              console.log('Такого файла нет '+' deleteProduct');
            }
          })
          const data = await ProductModel.deleteOne({_id:id});
            return data
        } catch (e) {
            console.log(e,'addProduct');
        }
    }
    async editProduct(textEdit,imagesToDelete,id){
        try {
            const product = await ProductModel.find({
                id
            })
            
        } catch (e) {
            console.log(e,'addProduct');
        }
    }
    
    async getAllProducts(){
        try {
            const allProducts = await ProductModel.find(); 
            return allProducts.map(el=>{
                // const filePath = path.resolve(
                //     __dirname,
                //     "..",
                //     "uploads",
                //     el.productMainImage[0]
                //   );
                //   try {
                //     fs.accessSync(filePath, fs.constants.F_OK); 
                //     const data = fs.readFileSync(filePath);
                //     const blob = Buffer.from(data.buffer);
                //     el.productMainImage=[{ blob:'data:image/jpeg;base64,  '+blob.toString("base64"), name:el.productMainImage[0]}];
                //   } catch (e) {
                //     el.productMainImage=[el.productMainImage[0]];
                //     console.error('No Read access'); 
                //   }
                 
                  
                  el.productImagesWhiteBG=el.productImagesWhiteBG.map(el=>{
                    // const filePath = path.resolve(
                    //     __dirname,
                    //     "..",
                    //     "uploads",
                    //     el
                    //   );
                    //   let data = null
                    // let blob=null
                    // try { 
                    //     fs.accessSync(filePath, fs.constants.F_OK); 
                    //     data = fs.readFileSync(filePath);
                    //     blob = Buffer.from(data.buffer);
                    

                    //   } catch (err) { 
                    //     console.error('No Read access'); 
                    //   } 
                 
                    // if(blob) return { blob:'data:image/jpeg;base64,'+blob.toString("base64"), name:el}
                    return el
                    //   const data = fs.readFileSync(filePath);
                    //   const blob = Buffer.from(data.buffer);
                    //   return { blob:'data:image/jpeg;base64,'+blob.toString("base64"), name:el}
                  })
                  el.productImageInterior= el.productImageInterior.map(el=>{
                    // const filePath = path.resolve(
                    //     __dirname,
                    //     "..",
                    //     "uploads",
                    //     el
                    //   );
                    //   let data = null
                    //   let blob=null
                    //   try { 
                    //       fs.accessSync(filePath, fs.constants.F_OK); 
                    //       data = fs.readFileSync(filePath);
                    //       blob = Buffer.from(data.buffer);
                      
  
                    //     } catch (err) { 
                    //       console.error('No Read access'); 
                    //     } 
                 
                    //   if(blob)  return { blob:'data:image/jpeg;base64,'+blob.toString("base64"), name:el}
                      return el
                    //   const data = fs.readFileSync(filePath);
                    //   const blob = Buffer.from(data.buffer);
                    //   return { blob:'data:image/jpeg;base64,'+blob.toString("base64"), name:el}
                  })
                  el.productImageColored= el.productImageColored.map(el=>{
                    // const filePath = path.resolve(
                    //     __dirname,
                    //     "..",
                    //     "uploads",
                    //     el
                    //   );
                    //   let data = null
                    //   let blob=null
                    //   try { 
                    //       fs.accessSync(filePath, fs.constants.F_OK); 
                    //       data = fs.readFileSync(filePath);
                    //       blob = Buffer.from(data.buffer);
                      
  
                    //     } catch (err) { 
                    //       console.error('No Read access'); 
                    //     } 
                    
                    //   if(blob)  return { blob:'data:image/jpeg;base64,'+blob.toString("base64"), name:el}
                      return el
                    //   const data = fs.readFileSync(filePath);
                    //   const blob = Buffer.from(data.buffer);
                    //   return { blob:'data:image/jpeg;base64,'+blob.toString("base64"), name:el}
                  })
                  el.productDocuments= el.productDocuments.map(el=>{
                    // const filePath = path.resolve(
                    //     __dirname,
                    //     "..",
                    //     "files",
                    //     el
                    //   );
                    //   let data = null
                    //   let blob=null
                    //   try { 
                    //     fs.accessSync(filePath, fs.constants.F_OK); 
                    //     data = fs.readFileSync(filePath);
                    //     blob = Buffer.from(data.buffer);
                        

                    //   } catch (err) { 
                    //     console.error('No Read access'); 
                    //   } 
                    //   if(blob)  return { blob:'data:application/pdf;base64,'+blob.toString("base64"), name:el}
                      return{ blob:el}

                  })
                  el.productParamsImage=el.productParamsImage.map(el=>{
                    // const filePath = path.resolve(
                    //   __dirname,
                    //   "..",
                    //   "uploads",
                    //   el
                    // );
                    // let data = null
                    // let blob=null
                    // try { 
                    //     fs.accessSync(filePath, fs.constants.F_OK); 
                    //     data = fs.readFileSync(filePath);
                    //     blob = Buffer.from(data.buffer);
                    

                    //   } catch (err) { 
                    //     console.error('No Read access'); 
                    //   } 
                  
                    // if(blob)  return { blob:'data:image/jpeg;base64,'+blob.toString("base64"), name:el}
                    return el
                  })
                  return el
            })
    
        
        } catch (e) {
            console.log(e,'getAllProducts');
        }
    }
    async deleteProductImages(id,imagesToDelete){
        try {
            const productData = await ProductModel.findById(id);

            if(!productData){
                throw ApiError.BadRequest('Продукт не найден')
            }
            
            productData.productImagesWhiteBG=productData.productImagesWhiteBG.filter(ele=>!imagesToDelete.includes(ele));
            productData.productImageInterior=productData.productImageInterior.filter(ele=>!imagesToDelete.includes(ele));
            productData.productImageColored=productData.productImageColored.filter(ele=>!imagesToDelete.includes(ele));
            productData.productDocuments=productData.productDocuments.filter(ele=>!imagesToDelete.includes(ele));
            productData.productParamsImage=productData.productParamsImage.filter(ele=>!imagesToDelete.includes(ele))
            if(imagesToDelete.includes(productData.productMainImage)) productData.productMainImage=''
            imagesToDelete.forEach(el=>{
                    const filePath = path.resolve(
                        __dirname,
                        "..",
                        "uploads",
                        el
                      );
                      try { 
                        fs.accessSync(filePath, fs.constants.F_OK); 
                        fs.unlinkSync(filePath);

                      } catch (err) { 
                        try {
                            const filePath = path.resolve(
                                __dirname,
                                "..",
                                "files",
                                el
                              );
                              fs.accessSync(filePath, fs.constants.F_OK); 
                              fs.unlinkSync(filePath);
                        } catch (error) {
                            console.error(`Такого файла ${el} не существует`)
                        }
                       
                      } 
                      
            })
           
            

          
            // productData.productDocuments=productData.productDocuments.filter(ele=>!imagesToDelete.includes(ele));
           await productData.save()          
        } catch (e) {
            console.log(e,"deleteProductImages");
        }
    }
    async updateProduct(id,data){
        try {
            
             await ProductModel.updateOne({_id:id}, {$set:{...data}})
            const product = await ProductModel.findById(id)
            return product
        } catch (e) {
            console.log(e,'addProduct');
        }
    }
    async findProduct(id){
        try {
            const product = await ProductModel.findById(id)
            if(!product){
                throw ApiError.BadRequest('Продукт не найден')
            }
            return product
        } catch (e) {
            console.log(e,'addProduct');
        }
    }
}

module.exports = new ProductService()