const {Schema,model}=require('mongoose');

const HeaderAndFooterSchema = new Schema({
    headerFooterImage:{type:String},
    headerFooterTextColor:{type:String}

})

module.exports = model('HeaderAndFoter',HeaderAndFooterSchema);