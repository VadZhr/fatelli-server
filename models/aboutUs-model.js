const {Schema,model}=require('mongoose');

const AboutUsSchema = new Schema({
    // user:{type:Schema.Types.ObjectId, ref:'Admin'},
    aboutText:{type:String, required:true},
    aboutTitle:{type:String, required:true},
    aboutImagePath:{type:Array},


})

module.exports = model('About',AboutUsSchema);