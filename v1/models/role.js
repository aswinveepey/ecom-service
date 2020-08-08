const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedat: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const roleModel = mongoose.model("Role", roleSchema);

module.exports = roleModel;