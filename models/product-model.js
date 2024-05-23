const { ObjectId } = require('mongodb');
const {Schema,model}=require('mongoose');

const ProductSchema = new Schema({
    // user:{type:Schema.Types.ObjectId, ref:'Admin'},
    productName:{type:String, required:true,},
    productPath:{type:String},
    productMainImage:{type:Array},
    productDescription:{type:String},
    productImagesWhiteBG:{type:Array},
    productImageInterior:{type:Array},
    productImageColored:{type:Array},
    productParams:{type:Object},
    productRealPrice:{type:String},
    productDiscountPrice:{type:String},
    productDocuments:{type:Array},
    categoryNameId:{type:ObjectId},
    productParamsImage:{type:Array}


})

module.exports = model('Product',ProductSchema);  