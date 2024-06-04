const AdminService = require("../services/admin-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const AboutModel = require("../models/aboutUs-model");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const AboutService = require("../services/about-service");
const CategoriesModel = require("../models/categories-model");
const CategoryService = require("../services/category-service");
const Translit = require("cyrillic-to-translit-js");
const CyrillicToTranslit = require("cyrillic-to-translit-js");
const ProductService = require("../services/product-service");
const ContactService = require("../services/contact-service");
const HeaderFooterService = require("../services/header-footer-service");
const cyrillicToTranslit = new CyrillicToTranslit();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `../server/uploads`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

class AdminController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка валидации данных", errors.array())
        );
      }
      const { email, password } = req.body;

      const adminData = await AdminService.registration(email, password);
      res.cookie("refreshToken", adminData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(adminData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(req.body, "req.body");
      const adminData = await AdminService.login(email, password);
      if(!adminData) next( ApiError.BadRequest('Неправильный логин или пароль'))
      res.cookie("refreshToken", adminData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(adminData);
    } catch (e) {
      
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const refreshTokenHeader = req.headers?.authorization?.split(" ")[1];
      const token = await AdminService.logout(
        refreshToken || refreshTokenHeader
      );
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const refreshTokenHeader = req.headers?.authorization.split(" ")[1];
      const adminData = await AdminService.refresh(
        refreshToken || refreshTokenHeader
      );
      res.cookie("refreshToken", adminData.refreshToken, {  
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(adminData);
    } catch (e) {
      next(e);
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await AdminService.getAllUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async uploadAboutImages(req, res, next) {
    await AboutService.upload(req.files);
    return res.json("Загружено");
  }
  async aboutText(req, res, next) {
    try {
      const { aboutTitle, aboutText, imagesToDisplay } = req.body;
      const respose = await AboutService.changeAboutText(
        aboutTitle,
        aboutText,
        imagesToDisplay
      );
      res.json(respose);
    } catch (error) {
      next(e);
    }
  }
  async getAboutImages(req, res, next) {
    try {
      const aboutData = await AboutService.findAboutData();
      console.log(aboutData);
      return res.json(aboutData);
    } catch (error) {
      return null;
    }
  }
  async deleteAboutImage(req, res, next) {
    try {
      const { name } = req.params;
      await AboutService.deleteImage(name);
      res.json("удалено");
    } catch (e) {
      next(e);
    }
  }
  async imagesToDisplay(req, res, next) {
    try {
      const { imagesToDisplay } = req.body;
      await AboutService.toDisplay(imagesToDisplay);
      res.json("Успешно");
    } catch (e) {
      console.log(e);
    }
  }

async addAboutData(req,res,next){
  try {
    const {image}=req.files;
    console.log(image);
    const {aboutTitle,aboutText,aboutSliderText}=req.body;
    console.log(req.body);
    const aboutImagesToDelete=JSON.parse(req.body.aboutImagesToDelete);
    const aboutData = await AboutService.findAboutData();
    console.log(aboutData, 'aboutData');
    console.log(aboutImagesToDelete, 'aboutImagesToDelete');
    console.log(aboutTitle,aboutText,aboutSliderText,'aboutTitle,aboutText');
    if(aboutImagesToDelete.length){
      await AboutService.deleteImage(aboutData,aboutImagesToDelete)
    } 
    aboutData.aboutTitle=aboutTitle;
    aboutData.aboutText=aboutText;
    aboutData.aboutSliderText=aboutSliderText;
    if(image) aboutData.aboutImagePath.push(...image.map(el=>el.originalname));

   
    await aboutData.save();
    res.json('Успешно')
  } catch (e) {
    console.log(e,'addAboutData');
  }
}

  async addCategory(req, res, next) {
    try {
      const data = JSON.parse(req.body.categoryData);
      console.log(req.file,'req.file');
      const categoryImagePath = req.file.originalname;
      const categoryPathEN = cyrillicToTranslit.transform(data.categoryName);
      const categoryData = await CategoryService.addCategory(
        data.categoryName,
        categoryPathEN,
        categoryImagePath
      );
      return res.json(categoryData);
    } catch (e) {
      console.log(e);
    }
  }
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      if (await CategoryService.delete(id)) {
        return res.json("Удалено");
      }
      throw ApiError.BadRequest("Ошибка");
    } catch (e) {
      console.log(e);
    }
  }
  async editCategory(req, res, next) {
    try {
      const { id, categoryName, changedImage } = JSON.parse(
        req.body.categoryData
      );
      const category = await CategoryService.findCategory(id);
      if (!category) {
        throw ApiError.BadRequest("Категория не найдена");
      }
      if (changedImage) {
        const filePath = path.resolve(
          __dirname,
          "..",
          "uploads",
          category.categoryImagePath
        );

        try {
          fs.accessSync(filePath, fs.constants.F_OK); 
          fs.unlinkSync(filePath);
        } catch (e) {
          console.log('Такого файла нет ' + filePath+' deleteProduct');
        }
        const newPath = req.file.originalname
        category.categoryImagePath = newPath
      }
      const categoryPathEN = cyrillicToTranslit.transform(categoryName);
      category.categoryName =categoryName;
      category.categoryPath =categoryPathEN;
      await category.save()
      res.json('Успешно изменено')
    } catch (e) {
      console.log(e);
    }
  }
  async getAllCategories(req, res, next) {
    try {
      const allCategories = await CategoryService.getAllCategories();
      return res.json(allCategories);
    } catch (e) {
      console.log(e);
    }
  }

  // PRODUCTS
  async addProduct(req,res,next){
    try {
      console.log(1)
        const {productName,productDescription,productParams,productRealPrice,productDiscountPrice,categoryNameId}=JSON.parse(req.body.productData);
        const productPath= cyrillicToTranslit.transform(productName);
        console.log(req.files);
        const productImagesWhiteBG = req.files.whiteBG.map(el=>el.originalname)
        const productImageInterior = req.files.interior.map(el=>el.originalname)
        const productImageColored = req.files.colored.map(el=>el.originalname)
        const productDocuments = req.files.files.map(el=>el.originalname);
        const productParamsImage = req.files.productParamsImage.map(el=>el.originalname);
        const productMainImage = [req.files.mainImage[0].originalname]
        const product = await ProductService.addProduct({productPath,productImagesWhiteBG,productImageInterior,productImageColored, productDocuments,
          productName,productDescription,productParams,productRealPrice,productDiscountPrice,categoryNameId, productMainImage,productParamsImage}
        )
        res.status(200).json({message:'Продукт добавлен'})

    } catch (e) {
        console.log(e,'addProduct');
    }
}
async deleteProduct(req,res,next){
    try {
        const {id}=req.params;
       
        if(!id){
          throw ApiError.BadRequest('Такого продукта не существует')
        }
        const productData = await ProductService.deleteProduct(id)
        if(productData.deletedCount==0){
          throw ApiError.BadRequest('Продукт не найден')
        }
        res.status(200).json('Продукт удален')
    } catch (e) {
        console.log(e,'addProduct');
    }
}
async editProduct(req,res,next){
    try {
      const {id} = req.params
      console.log(id);
      console.log(req.body);
      const data=JSON.parse(req.body.productData);
      if(data){
        await ProductService.updateProduct(id,data);
      }
      console.log(data,'data');
      
      const imagesToDelete=JSON.parse(req.body.imagesToDelete);
      console.log(imagesToDelete,'imagesToDelete');
      if(imagesToDelete.length){
        await ProductService.deleteProductImages(id,imagesToDelete)
      }

      const product = await ProductService.findProduct(id)
      if(req.files.whiteBG){
        console.log(req.files.whiteBG);
        const whiteBGImages = req.files.whiteBG.map(el=>el.originalname)
        product.productImagesWhiteBG.push(...whiteBGImages)
     }
     if(req.files.interior){
      const interiorImages = req.files.interior.map(el=>el.originalname)
      product.productImageInterior.push(...interiorImages)
    }
   if(req.files.colored){
    const coloredImages = req.files.colored.map(el=>el.originalname)
    product.productImageColored.push(...coloredImages)
 }
   if(req.files.mainImage){
    const productMainImage = [req.files.mainImage[0].originalname]
    product.productMainImage=productMainImage
 }
 if(req.files.files){
  const files = req.files.files.map(el=>el.originalname)
  product.productDocuments.push(...files)
}
if(req.files.productParamsImage) {
  const productParamsImage = req.files.productParamsImage.map(el=>el.originalname)
  product.productParamsImage=productParamsImage
}
  await product.save();
//   console.log(product);
  res.json('Продукт успешно обновлен')
//  const product = await ProductService.editProduct({productName,productDescription,productParams,productRealPrice,productDiscountPrice,categoryNameId},
//   {whiteBGdelete,interiorDelete,coloredDelete,filesDelete},{productImagesWhiteBG,},id);


      // }
    } catch (e) {
        console.log(e,'addProduct');
    }
}
async findProduct(req,res,next){
    try {
        
    } catch (e) {
        console.log(e,'addProduct');
    }
}
async getAllProducts(req,res,next){
    try {
        const allProducts = await ProductService.getAllProducts()
       res.json(allProducts)
    } catch (e) {
        console.log(e,'getAllProducts');
    }
}
async deleteProductImages(req,res,next){

}

// PRODUCTS

// CONCTACTS

async editContact(req,res,next){
  try {
    const data = req.body
    console.log(data);
    const contactData = await ContactService.findContactData(data);
    res.json('Контакты успешно обновлены')
  } catch (e) {
    console.log(e,'editContact')
  }
}

async getContacts(req,res,next){
  try {
    const contactData =await ContactService.findContactData()
    if(!contactData){
      throw ApiError.BadRequest('Нет данных о контактах')
    }
    res.json(contactData)
    } catch (e) {
    console.log(e,'getContacts')
  }
}

// CONCTACTS
// header and footer
async editHeaderAndFoorter(req,res,next){
  try{
    const headerFooterTextColor =JSON.parse(req.body.headerFooterTextColor);
    const mediaColor = req.body.mediaColor
    console.log(req.files,'editHeaderAndFoorter');
   
    console.log(req.files,'editHeaderAndFoorter'
    );
    console.log(req.body,'editHeaderAndFoorter'
  );
    const data = await HeaderFooterService.getHeaderAndFooter();
    if(headerFooterTextColor!='#fff'){
      data.headerFooterTextColor=headerFooterTextColor;
    }
    if(mediaColor){
      data.mediaColor=mediaColor
    }
    if(req.files?.headerFooterImage){
      const headerFooterImage =req.files?.headerFooterImage[0];
        const filePath = path.resolve(
          __dirname,
          "..",
          "uploads",
          data.headerFooterImage
        );

      try {
        fs.accessSync(filePath, fs.constants.F_OK); 
        fs.unlinkSync(filePath);
      } catch (e) {
        console.log('Такого файла нет ' + filePath+' deleteProduct');
      }
      data.headerFooterImage=headerFooterImage.originalname;
    }

    await data.save();

    res.json('Успешно')
  }catch(e){
    console.log(e,'editHeaderAndFoorter')
    
  }
}

async getHeaderAndFoorter(req,res,next){
  try{
    const data = await HeaderFooterService.getHeaderAndFooter();
    res.json(data)
  }catch(e){
    console.log(e,'editHeaderAndFoorter')
    
  }
}
// header and footer
}

module.exports = new AdminController();
