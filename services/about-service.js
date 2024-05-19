const AboutModel = require("../models/aboutUs-model");
const path = require("path");
const fs = require("fs");
const ApiError = require("../exceptions/api-error");

class AboutService {
  async getAllImages() {
    try {
      const aboutData = await AboutModel.find();
      if (aboutData.length == 0) {
        return ApiError.BadRequest('Данных нет');
      }
      const blobArr = [];
      aboutData[0].aboutImagePath.forEach((el) => {
        const filePath = path.resolve(
          __dirname,
          "..",
          "uploads",
          el
        );
        try { 
          fs.accessSync(filePath, fs.constants.F_OK); 
          const data = fs.readFileSync(filePath);
          const blob = Buffer.from(data.buffer);
          blobArr.push({ name: el, toDisplay:el.toDisplay, blob:'data:image/jpeg;base64,'+blob.toString("base64") });
        } catch (err) { 
          console.error('нет такого файла')
         
        } 
      
       
      });
      return {
        aboutImages: blobArr,
        aboutTitle: aboutData[0].aboutTitle,
        aboutText: aboutData[0].aboutText,
      };
    } catch (e) {
      console.log(e);
    }
  }
  async upload(images) {
    try {
      const aboutData = await AboutModel.find();
      if (!aboutData.length) {
        await AboutModel.create({
          aboutTitle: "",
          aboutText: "",
          aboutImagePath:[],
        });
        return null;
      }
      const blobArr = [];
      aboutData[0].aboutImagePath.push(
        ...images.map((el) => {
          return { originalname: el.originalname, toDisplay: false };
        })
      );
      await aboutData[0].save();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteImage(aboutData,imagesToDelete) {
    try {
      aboutData.aboutImagePath = aboutData.aboutImagePath.filter(
        (el) => !imagesToDelete.includes(el)
      );
      imagesToDelete.forEach(el=>{
        const filePath = path.resolve(__dirname, "..", "uploads", el);
        try { 
          fs.accessSync(filePath, fs.constants.F_OK); 
          fs.unlinkSync(filePath);

        } catch (err) { 
          console.error('нет такого файла')
         
        } 
      })
      
     
      await aboutData.save();
      return
    } catch (e) {
      console.log(e,'deleteImage');
    }
  }
  async changeAboutText(aboutTitle, aboutText,imagesToDisplay) {
    try {
      const about = await AboutModel.find();
      const aboutData = about[0];
      aboutData.aboutTitle = aboutTitle;
      aboutData.aboutText = aboutText;
      await aboutData.save();
      aboutData.aboutImagePath=aboutData.aboutImagePath.map(el=>{
        if(imagesToDisplay.includes(el.originalname)){
          el.toDisplay=true
        }else{
          el.toDisplay=false
        }
        return el
      })

      aboutData.markModified('aboutImagePath')
      await aboutData.save()
      return { status: 200 };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async addAboutData(data){

  }
  async findAboutData(){
    const [about] = await AboutModel.find();
    if(!about){
      return await AboutModel.create({
        aboutTitle: "О нас",
        aboutText: "текст о нас",
        aboutImagePath:[],
      });
    }
    return about
  }
}


module.exports = new AboutService();
