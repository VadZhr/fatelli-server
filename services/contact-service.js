const ContactModel = require("../models/contacts-model");
const path = require("path");
const fs = require("fs");
const ApiError = require("../exceptions/api-error");

class ContactService{
    async findContactData(info){
        try {
            const [data] = await ContactModel.find();
            
            if(!data){
              return  await ContactModel.create({
                    phoneOne:'default',
                    phoneTwo:'default',
                    phoneThree:'default',
                    address:'default',
                    instagramLink:'default',
                    kaspiLink:'default',
                    satuLink:'default',
                    ozonLink:'default',
                    wildBerriesLink:'default',
                    email:'default'
                
                })
            }
            if(info){
                await ContactModel.updateOne({},{$set:{...info}})
            }
            return data
        } catch (e) {
            console.log(e,"findContactData");
        }
    }
}


module.exports = new ContactService()