const User = require("../models/User");

async function listUsers(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter)
  ]);

  res.json({
    success: true,
    users: users.map(u => u.safe()),
    pagination: { currentPage: page, limit, totalUsers: total, totalPages: Math.ceil(total / limit) }
  });
}

async function getUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user: user.safe() });
}

async function updateUser(req, res) {
  const allowed = {};
  if (req.body.name !== undefined) allowed.name = req.body.name;
  if (req.body.email !== undefined) allowed.email = req.body.email;
  if (req.body.role !== undefined) allowed.role = req.body.role;
  if (req.body.isActive !== undefined) allowed.isActive = req.body.isActive;

  const user = await User.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, message: "User updated successfully", user: user.safe() });
}

async function deleteUser(req, res) {
  if (req.params.id === req.userId) {
    return res.status(400).json({ success: false, message: "You cannot delete your own admin account" });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, message: "User deleted successfully" });
}

module.exports = { listUsers, getUser, updateUser, deleteUser };
