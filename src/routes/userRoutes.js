const express = require("express");
const { listUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", auth, authorizeRoles("admin"), listUsers);
router.get("/:id", auth, getUser);
router.put("/:id", auth, (req, res, next) => {
  if (req.userRole !== "admin" && req.userId !== req.params.id) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
}, updateUser);
router.delete("/:id", auth, authorizeRoles("admin"), deleteUser);

module.exports = router;
