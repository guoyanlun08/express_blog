const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

// 注册
async function register(req, res) {
  const { username, password, nickname } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ msg: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, nickname, password: hashedPassword });

    res.status(201).json({ msg: "User register successfully" });
  } catch (e) {
    res.status(500).json({ msg: "Failed to register user" });
  }
}

// 登录
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json("Invalid username or password");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json("Invalid username or password");
    }

    user.lastOnlineTime = new Date();
    await user.save();
    
    const token = jwt.sign({ userId: user.id }, "xxx-your-secret-key", {
      expiresIn: "24h",
    });

    res.json({
      token,
      account: user.username,
      nickname: user.nickname,
      userId: user.id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Fail to log in" });
  }
}

module.exports = {
  register,
  login,
};
