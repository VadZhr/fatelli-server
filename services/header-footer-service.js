const HeaderAndFooretModel = require("../models/header-footer-model");
const path = require("path");
const fs = require("fs");
const ApiError = require("../exceptions/api-error");

class HeaderAndFooterService{
    async getHeaderAndFooter(){
        const [data] = await HeaderAndFooretModel.find()
        if(!data){
            return await HeaderAndFooretModel.create({
                headerFooterImage:'none',
                headerFooterTextColor:'#fff'
            })
        }
        return data
    }
}

module.exports = new HeaderAndFooterService()