const { verifyAccessToken } = require("../config/auth");
const { User, Role } = require("../models");

async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findByPk(decoded.id, { include: Role });
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.Role.name)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient privileges" });
    }
    next();
  };
}

module.exports = { authenticateJWT, authorizeRoles };
