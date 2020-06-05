const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: true,
    trim: true,
  },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission'
    },
  ],
});

const roleModel = mongoose.Model("Role", roleSchema);

module.exports = roleModel;
