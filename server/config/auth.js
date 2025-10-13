const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "accesssecret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshsecret";

function signAccessToken(user) {
  return jwt.sign({ id: user.id, role: user.roleId }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

function signRefreshToken(user) {
  return jwt.sign({ id: user.id, role: user.roleId }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
