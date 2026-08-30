const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");

async function createTask(req, res) {
  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  if (assignedTo) {
    const assignee = await User.findById(assignedTo);
    if (!assignee || !assignee.isActive) return res.status(400).json({ success: false, message: "Invalid assignee" });
  }

  const task = await Task.create({
    title, description, status, priority, dueDate,
    createdBy: req.userId,
    assignedTo: assignedTo || null
  });

  const populated = await Task.findById(task._id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role");

  res.status(201).json({ success: true, message: "Task created successfully", task: populated });
}

async function getTasks(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const filter = req.userRole === "admin" && req.query.all === "true"
    ? {}
    : { $or: [{ createdBy: req.userId }, { assignedTo: req.userId }] };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.search) filter.title = { $regex: req.query.search, $options: "i" };

  const sortField = ["createdAt", "dueDate", "priority", "title"].includes(req.query.sortBy)
    ? req.query.sortBy : "createdAt";
  const sortOrder = req.query.order === "asc" ? 1 : -1;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ [sortField]: sortOrder })
      .skip(skip).limit(limit),
    Task.countDocuments(filter)
  ]);

  res.json({
    success: true,
    tasks,
    pagination: { currentPage: page, limit, totalTasks: total, totalPages: Math.ceil(total / limit) }
  });
}

async function getTask(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid task ID" });

  const task = await Task.findById(req.params.id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role");

  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  const allowed = req.userRole === "admin" ||
    task.createdBy._id.toString() === req.userId ||
    task.assignedTo?._id.toString() === req.userId;

  if (!allowed) return res.status(403).json({ success: false, message: "Access denied" });

  res.json({ success: true, task });
}

async function updateTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  const owner = task.createdBy.toString() === req.userId;
  const assignee = task.assignedTo?.toString() === req.userId;
  const admin = req.userRole === "admin";

  if (!owner && !assignee && !admin) return res.status(403).json({ success: false, message: "Access denied" });

  if (assignee && !owner && !admin) {
    const allowed = ["status"];
    const incoming = Object.keys(req.body);
    if (incoming.some(key => !allowed.includes(key))) {
      return res.status(403).json({ success: false, message: "Assignees can only update task status" });
    }
  }

  const fields = ["title", "description", "status", "priority", "dueDate", "assignedTo"];
  for (const field of fields) {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  }

  await task.save();

  const populated = await Task.findById(task._id)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role");

  res.json({ success: true, message: "Task updated successfully", task: populated });
}

async function deleteTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  const owner = task.createdBy.toString() === req.userId;
  if (!owner && req.userRole !== "admin") return res.status(403).json({ success: false, message: "Access denied" });

  await task.deleteOne();
  res.json({ success: true, message: "Task deleted successfully" });
}

async function getAssignedTasks(req, res) {
  const tasks = await Task.find({ assignedTo: req.userId })
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  res.json({ success: true, tasks });
}

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask, getAssignedTasks };
