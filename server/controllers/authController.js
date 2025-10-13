const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../config/auth");

const refreshTokens = new Set(); // In prod, use DB or Redis

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const roleInstance = await Role.findOne({ where: { name: role } });
    if (!roleInstance) return res.status(400).json({ message: "Invalid role" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId: roleInstance.id,
    });

    res.json({ id: user.id, username: user.username, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    refreshTokens.add(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, role: user.Role.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token || !refreshTokens.has(token))
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = verifyRefreshToken(token);
    const newAccessToken = signAccessToken(payload);
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

exports.logout = (req, res) => {
  const token = req.cookies.refreshToken;
  refreshTokens.delete(token);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};
