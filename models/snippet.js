const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    code: {
      type: String,
    },
    language: {
      ref: "Language",
      type: mongoose.Schema.Types.ObjectId,
    },
    tags: [
      {
        ref: "Tag",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Snippet", snippetSchema);
