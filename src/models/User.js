const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160, index: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user", index: true },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.safe = function() {
  return {
    id: this._id, name: this.name, email: this.email,
    role: this.role, isActive: this.isActive,
    createdAt: this.createdAt, updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model("User", userSchema);
