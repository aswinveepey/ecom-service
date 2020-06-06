const mongoose = require('mongoose')
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// every entity in the system is attached an auth. Entity could be a user, customer or an agent

const AuthScehema = mongoose.Schema({
  username: {
    unique: true,
    minlength: 6,
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  mobilenumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  otp: {
    type: String,
    minLength: 4,
  },
  token: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

AuthScehema.pre("save", async function (next) {
  // Hash the password before saving the auth model
  const auth = this;
  if (auth.isModified("password")) {
    auth.password = await bcrypt.hash(auth.password, 8);
  }
  next();
});

AuthScehema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const auth = this;
  const token = jwt.sign({ _id: auth._id }, process.env.JWT_KEY);
  auth.token = token;
  await auth.save();
  return token;
};

AuthScehema.statics.usernameAuth = async (username, password) => {
  // Search for a user by email and password.
  const auth = await authModel.findOne({ username });
  if (!auth) {
    throw new Error("Username Error");
  }
  const isPasswordMatch = await bcrypt.compare(password, auth.password);
  if (!isPasswordMatch) {
    throw new Error("Password Error");
  }
  return auth;
};

const authModel = mongoose.model("Auth", AuthScehema);

module.exports = authModel;