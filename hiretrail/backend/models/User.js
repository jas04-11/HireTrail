const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 60 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email"],
    },
    password: { type: String, required: [true, "Password is required"], minlength: 6, select: false },

    // Profile
    headline: { type: String, maxlength: 120, default: "" }, // e.g. "SDE-2 @ Microsoft | ex-Amazon"
    bio: { type: String, maxlength: 500, default: "" },
    college: { type: String, trim: true, default: "" },
    branch: { type: String, trim: true, default: "" },
    graduationYear: { type: Number },
    currentCompany: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    skills: [{ type: String, trim: true }],
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    isProfileComplete: { type: Boolean, default: false },

    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
  },
  { timestamps: true }
);

userSchema.index({ name: "text", college: "text", currentCompany: "text" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.bookmarks;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
