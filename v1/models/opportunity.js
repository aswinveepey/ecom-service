const mongoose = require("mongoose");
const shortid = require("shortid");

const opportunitySchema = mongoose.Schema({
  shortid: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true,
  },
  referenceid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opportunity",
  },
  note: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
    },
  ],
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  items: [
    {
      sku: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sku",
        required: true,
      },
      quantity: {
        type: mongoose.Schema.Types.Number,
        required: true,
      },
    },
  ],
  attachments: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    required: true,
    enum: ["prospecting", "proposal", "won", "lost"],
    default: "prospecting",
  },
  reason: {
    type: String,
  },
  duedate: {
    type: Date,
    required: true,
  },
  closedate: {
    type: Date,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

opportunitySchema.index(
  {
    name: "text",
  },
  {
    name: "opportunity_search_index",
  }
);

const OpportunityModel = mongoose.model("Opportunity", opportunitySchema);

module.exports = OpportunityModel;
