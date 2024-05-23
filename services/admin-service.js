const AdminModel = require("../models/admin-model")
const ApiError = require('../exceptions/api-error')
const bcrypt = require('bcrypt')
const TokenService = require('./token-service')
const AdminDto = require('../dto/user-dto')
const tokenService = require("./token-service")

class AdminService{
    async registration(email,password){
        const candidate = await AdminModel.findOne({email});
        console.log(candidate);
        if (candidate){
            console.log(1);
            throw ApiError.BadRequest(
                `Пользователь с таким адресом ${email} существует`
              );
        }
        const hashPassword = await bcrypt.hash(password,4);
        const admin = await AdminModel.create({email, password:hashPassword});
        const adminDto=new AdminDto(admin)
        const tokens = TokenService.generateTokens({...adminDto});
        await tokenService.saveToken(adminDto.id,tokens.refreshToken);
        return {
            ...tokens,
            user:adminDto
        }
    }
    async login(email,password){
        const admin = await AdminModel.findOne({email});
        if(!admin){
            throw ApiError.BadRequest(`Пользователь с таки ${email} не существует`);
        }
        const isPassEqual = await bcrypt.compare(password,admin.password);
        if(!isPassEqual){
            return undefined
        }
      
        const adminDto=new AdminDto(admin);
        const tokens = tokenService.generateTokens({...adminDto});
        await tokenService.saveToken(adminDto.id,tokens.refreshToken);
        return {
            ...tokens,
            user:adminDto
        }
    }   
    async logout(refreshToken){
        console.log(refreshToken,1);
        const token = await tokenService.remove(refreshToken);
        return token
    }
    async refresh(refreshToken){
        console.log(refreshToken);
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const adminData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        console.log(adminData,'adminData');
        console.log(tokenFromDb,'tokenFromDb');
        if(!adminData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }
        const admin = await AdminModel.findById(adminData.id)
        const adminDto=new AdminDto(admin);
        const tokens = tokenService.generateTokens({...adminDto});
        await tokenService.saveToken(adminDto.id,tokens.refreshToken);
        return {
            ...tokens,
            user:adminDto
        }
    }
    async getAllUsers(){
        const users = await AdminModel.find();
        return users;
    }
}

module.exports = new AdminService()