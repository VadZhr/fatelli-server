const ApiError= require('../exceptions/api-error');
const TokenService = require('../services/token-service')
module.exports = function(req,res,next){
    try {
        const authorizationHeader= req.headers.authorization;
        if(!authorizationHeader){
            return next(ApiError.UnauthorizedError());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            return next(ApiError.UnauthorizedError());
        }
        const adminData =TokenService.validateAccessToken(accessToken)
        if(!adminData){
            return  next(ApiError.UnauthorizedError())
        }
        req.user = adminData
        next();
    } catch (e) {
       return next(ApiError.UnauthorizedError()); 
    }
}