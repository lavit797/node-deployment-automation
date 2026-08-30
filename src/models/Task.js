const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 2000, default: "" },
  status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending", index: true },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium", index: true },
  dueDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true }
}, { timestamps: true });

taskSchema.index({ createdBy: 1, status: 1, priority: 1 });
taskSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Task", taskSchema);
