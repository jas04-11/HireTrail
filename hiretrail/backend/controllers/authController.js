const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const sendTokenResponse = require("../utils/sendToken");
const { createNotification } = require("../utils/notify");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, college, branch, graduationYear } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    college: college || "",
    branch: branch || "",
    graduationYear: graduationYear || undefined,
  });

  await createNotification({
    recipient: user._id,
    type: "welcome",
    message: `Welcome to HireTrail, ${user.name.split(" ")[0]}! Complete your profile to get started.`,
    link: "/profile/edit",
  });

  sendTokenResponse(user, 201, res);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  sendTokenResponse(user, 200, res);
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("ht_token", "none", { expires: new Date(Date.now() + 5 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged out" });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("bookmarks", "jobRole companyNameSnapshot");
  res.status(200).json({ success: true, user: user.toPublicJSON() });
});

module.exports = { registerUser, loginUser, logoutUser, getMe };
