const { body } = require("express-validator");

const createTaskValidator = [
  body("title").trim().isLength({ min: 2, max: 150 }).withMessage("Title must be 2-150 characters"),
  body("description").optional().trim().isLength({ max: 2000 }).withMessage("Description is too long"),
  body("status").optional().isIn(["pending", "in_progress", "completed"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("dueDate").isISO8601().withMessage("Valid dueDate is required")
];

const updateTaskValidator = [
  body("title").optional().trim().isLength({ min: 2, max: 150 }),
  body("description").optional().trim().isLength({ max: 2000 }),
  body("status").optional().isIn(["pending", "in_progress", "completed"]),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("dueDate").optional().isISO8601()
];

module.exports = { createTaskValidator, updateTaskValidator };
