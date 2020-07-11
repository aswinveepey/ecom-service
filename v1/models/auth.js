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
    lowercase: true,
    trim: true,
  },
  mobilenumber: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    unique: true,
    sparse:true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    minLength: 7,
  },
  otp: {
    type: String,
    minLength: 4,
  },
  token: {
    type: String,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

AuthScehema.pre("save", async function (next) {
  // Hash the password before saving the auth model
  const auth = this;
  if (auth.password && auth.isModified("password")) {
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

AuthScehema.methods.generateOtp = async function () {
  // Generate an otp for the user
  const auth = this;
  const max = 999999;
  const min = 100001;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  auth.otp = otp;
  await auth.save();
  return otp;
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

AuthScehema.statics.otpAuth = async (mobilenumber, otp) => {
  // Search for a user by email and password.
  const auth = await authModel.findOne({ mobilenumber });
  if (!auth) {
    throw new Error("Mobile Number Error");
  }
  if (otp===auth.otp) {
    return auth;
  } else {
    throw new Error("OTP Error");
  }
};

const authModel = mongoose.model("Auth", AuthScehema);

module.exports = authModel;