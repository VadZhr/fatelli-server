const { ObjectId } = require('mongodb');
const {Schema,model}=require('mongoose');


const ContactSchema = new Schema({
    // user:{type:Schema.Types.ObjectId, ref:'Admin'},
    phoneOne:{type:String},
    phoneTwo:{type:String},
    phoneThree:{type:String},
    address:{type:String},
    instagramLink:{type:String},
    kaspiLink:{type:String},
    satuLink:{type:String},
    ozonLink:{type:String},
    wildBerriesLink:{type:String},
    email:{type:String}


})

module.exports = model('Contact',ContactSchema);  