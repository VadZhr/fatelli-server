const Router = require("express").Router;
const adminController = require("../controllers/admin-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middlewares");
const multer = require("multer");
const ApiError = require("../exceptions/api-error");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.fieldname==='files') {
      cb(null, `../server/files`)
    } 
    else {
      cb(null, `../server/uploads`);
    }
      
  },
  filename: function (req, file, cb) {
    file.originalname=Date.now()+''+Math.random()*10*6+''+Buffer.from(file.originalname, 'latin1').toString('utf8');
    
    cb(null,  file.originalname);
  },
});

const upload = multer({ storage: storage, fileFilter:(req,file,cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype ==='application/pdf' ||  file.mimetype ==='application/octet-stream'){
    console.log(file.mimetype);
      cb(null,true)
  }else {
    console.log(file.mimetype);
    cb(`формат ${file.mimetype} не поддерживается`, false)
  }
}});

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  adminController.registration
);

router.post("/login", adminController.login);
router.post("/logout", adminController.logout);
router.get("/refresh", adminController.refresh);
router.get("/users", authMiddleware, adminController.getUsers);
router.post("/addproduct", adminController.addProduct);
// Передавать название папки  тут нужно добавить /images
router.post("/aboutpage/uploadimage",authMiddleware,upload.array('image',12),adminController.uploadAboutImages);
router.get("/aboutpage/getimages",adminController.getAboutImages);
router.delete("/aboutpage/delete/:name",authMiddleware,adminController.deleteAboutImage);
router.post("/aboutpage/addaboutdata",authMiddleware,upload.fields([{name:'image'}]),adminController.addAboutData)
// По другому маршруту будет отбправлятся объект с текстовыми полями title & text
// Нужно создать модель aboutus где будет храниться текст и путь к фото
router.put("/aboutpage/changetext",authMiddleware,adminController.aboutText)
// CATEGORIES
router.post('/categories/addcategory',authMiddleware,upload.single('image'), adminController.addCategory)
router.post('/categories/uploadImage',authMiddleware, adminController.addCategory)
router.delete('/categories/deletecategory/:id',authMiddleware, adminController.deleteCategory)
router.put('/categories/editcategory',authMiddleware, upload.single('image'),adminController.editCategory)
router.get('/categories/getallcategories', adminController.getAllCategories)
// CATEGORIES 

// PRODUCTS
router.post('/products/addproduct',  upload.fields([{name:'mainImage', maxCount:1 },{name:'whiteBG'},{name:'interior'},{name:'colored'},{name:'files'},{name:'productParamsImage'}]), adminController.addProduct)
router.delete('/products/deleteproduct/:id', adminController.deleteProduct)
router.put('/products/editproduct/:id',upload.fields([{name:'mainImage', maxCount:1 },{name:'whiteBG'},{name:'interior'},{name:'colored'},{name:'files'}]), adminController.editProduct)
router.get('/products/getallproducts', adminController.getAllProducts)
// PRODUCTS

// CONTACTS
router.put('/contacts/editcontacts',authMiddleware,adminController.editContact)
router.get('/contacts/getcontacts',adminController.getContacts)
// CONTACTS
module.exports = router;
