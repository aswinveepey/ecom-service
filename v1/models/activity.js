const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["meeting", "call", "task", "other"],
    default: "other",
  },
  status: {
    type: String,
    required: true,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
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

activitySchema.index(
  {
    name: "text",
  },
  {
    name: "activity_search_index",
  }
);

const ActivityModel = mongoose.model("Activity", activitySchema);

module.exports = ActivityModel;
