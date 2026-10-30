const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    roundNumber: { type: Number, required: true },
    roundName: { type: String, required: true, trim: true }, // e.g. "Online Assessment"
    roundType: {
      type: String,
      enum: [
        "Online Assessment",
        "Technical",
        "HR",
        "Managerial",
        "System Design",
        "Group Discussion",
        "Coding",
        "Other",
      ],
      default: "Technical",
    },
    duration: { type: String, default: "" }, // e.g. "45 mins"
    questionsAsked: { type: String, required: true }, // rich text / newline separated
    experience: { type: String, default: "" }, // how it went
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    result: {
      type: String,
      enum: ["Cleared", "Rejected", "Pending", "N/A"],
      default: "N/A",
    },
  },
  { _id: false },
);

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const experienceSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAnonymous: { type: Boolean, default: false },

    // Core details
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    companyNameSnapshot: { type: String, required: true }, // denormalized for search/display speed
    jobRole: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      enum: ["Internship", "Full-Time", "Internship + PPO"],
      default: "Full-Time",
    },
    packageOffered: { type: String, default: "" }, // e.g. "12 LPA" (kept as string for flexible formats)
    interviewDate: { type: Date, required: true },
    eligibilityCriteria: { type: String, default: "" },
    interviewMode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online",
    },
    numberOfRounds: { type: Number, required: true, min: 1 },

    rounds: { type: [roundSchema], validate: (v) => v.length > 0 },

    resourcesUsed: { type: String, default: "" },
    preparationStrategy: { type: String, default: "" },
    mistakesMade: { type: String, default: "" },
    tipsForJuniors: { type: String, default: "" },

    finalResult: {
      type: String,
      enum: ["Selected", "Rejected", "Waitlisted", "Awaited"],
      required: true,
    },

    technologies: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],

    // Engagement
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

experienceSchema.index({
  companyNameSnapshot: "text",
  jobRole: "text",
  technologies: "text",
  tags: "text",
});
experienceSchema.index({ createdAt: -1 });

experienceSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});
experienceSchema.virtual("commentCount").get(function () {
  return this.comments?.length || 0;
});
experienceSchema.set("toJSON", { virtuals: true });
experienceSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Experience", experienceSchema);
