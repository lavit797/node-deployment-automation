const User = require("../models/User");
const generateToken = require("../utils/token");

async function register(req, res) {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    success: true,
    message: "Registration successful",
    token: generateToken(user),
    user: user.safe()
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isActive || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  res.json({
    success: true,
    message: "Login successful",
    token: generateToken(user),
    user: user.safe()
  });
}

async function me(req, res) {
  res.json({ success: true, user: req.user });
}

module.exports = { register, login, me };
