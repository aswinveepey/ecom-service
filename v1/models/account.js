const moongoose = require("mongoose");
const validator = require("validator");

const accountSchema = moongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  type: {
    unique: true,
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  gstin: {
    unique: true,
    type: String,
    sparse: true,
    trim: true,
  },
  primarycontact: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
  },
  address: {
    type: String,
  },
  updatelog: [
    {
      updatedat: {
        type: Date,
        required: true,
        default: Date.now,
      },
      updatedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const accountModel = moongoose.model("Account", accountSchema);

module.exports = accountModel;
