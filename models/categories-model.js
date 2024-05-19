const {Schema,model}=require('mongoose');

const CategorySchema = new Schema({
    // user:{type:Schema.Types.ObjectId, ref:'Admin'},
    categoryName:{type:String, required:true, unique:true},
    categoryImagePath:{type:String},
    categoryPath:{type:String, unique:true}


})

module.exports = model('Category',CategorySchema);  