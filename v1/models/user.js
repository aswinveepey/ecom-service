const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  contactnumber: {
    type: String,
  },
  designation: {
    type: String,
  },
  contactaddress: {
    type: String,
  },
  divisions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
    },
  ],
  territories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Territory",
    },
  ],
  auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    unique: true,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true
  },
  createdat: {
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

// userSchema.index({ firstname: "text", lastname: "text", contactnumber: "text" });
userSchema.index({
  firstname: "text",
  lastname: "text"
},{
  name:'user_search_index'
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;