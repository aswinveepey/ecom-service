const mongoose = require('mongoose')

const permissionSchema = mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const permissionModel = mongoose.model("Permission", permissionSchema)

module.exports = permissionModel;