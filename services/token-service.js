const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");
class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30m",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      const adminData = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET,
        (err, encoded) => {
          if (err) console.error(err);

          return encoded;
        }
      );
      return adminData
    } catch (e) {
        return null
    }
  }
  
  validateRefreshToken(token) {
    try {
      const adminData = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET,
        (err, encoded) => {
          if (err) console.error(err);

          return encoded;
        }
      );

      return adminData
    } catch (e) {
      console.log(e);
        return null
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }
  async remove(refreshToken) {
    console.log(refreshToken);
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }
  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
