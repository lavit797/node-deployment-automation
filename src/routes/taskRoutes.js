const express = require("express");
const { createTask, getTasks, getTask, updateTask, deleteTask, getAssignedTasks } = require("../controllers/taskController");
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const { createTaskValidator, updateTaskValidator } = require("../validators/taskValidator");

const router = express.Router();

router.post("/", auth, createTaskValidator, validate, createTask);
router.get("/", auth, getTasks);
router.get("/assigned", auth, getAssignedTasks);
router.get("/:id", auth, getTask);
router.put("/:id", auth, updateTaskValidator, validate, updateTask);
router.delete("/:id", auth, deleteTask);

// Admin-only route to demonstrate authorization explicitly.
router.delete("/admin/purge/:id", auth, authorizeRoles("admin"), deleteTask);

module.exports = router;
