const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["like", "comment", "bookmark", "welcome", "system"],
      required: true,
    },
    message: { type: String, required: true },
    link: { type: String, default: "" }, // frontend route to navigate to
    experience: { type: mongoose.Schema.Types.ObjectId, ref: "Experience" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
