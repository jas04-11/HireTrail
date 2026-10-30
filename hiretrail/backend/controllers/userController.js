const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Experience = require("../models/Experience");

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "headline",
    "bio",
    "college",
    "branch",
    "graduationYear",
    "currentCompany",
    "location",
    "skills",
    "socialLinks",
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findById(req.user._id);
  Object.assign(user, updates);

  // Mark profile complete once key fields are filled
  user.isProfileComplete = Boolean(user.college && user.branch && user.headline);

  await user.save();
  res.status(200).json({ success: true, user: user.toPublicJSON() });
});

// @desc    Get a public profile by ID
// @route   GET /api/users/:id
// @access  Public
const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const experiences = await Experience.find({
    author: user._id,
    isAnonymous: false,
  })
    .populate("company", "name slug")
    .sort({ createdAt: -1 });

  const publicData = {
    _id: user._id,
    name: user.name,
    headline: user.headline,
    bio: user.bio,
    college: user.college,
    branch: user.branch,
    graduationYear: user.graduationYear,
    currentCompany: user.currentCompany,
    location: user.location,
    skills: user.skills,
    socialLinks: user.socialLinks,
    createdAt: user.createdAt,
  };

  res.status(200).json({ success: true, user: publicData, experiences });
});

// @desc    Toggle bookmark on an experience
// @route   PUT /api/users/bookmarks/:experienceId
// @access  Private
const toggleBookmark = asyncHandler(async (req, res) => {
  const { experienceId } = req.params;
  const experience = await Experience.findById(experienceId);
  if (!experience) {
    res.status(404);
    throw new Error("Experience not found");
  }

  const user = await User.findById(req.user._id);
  const index = user.bookmarks.findIndex((id) => id.toString() === experienceId);

  let bookmarked;
  if (index > -1) {
    user.bookmarks.splice(index, 1);
    bookmarked = false;
  } else {
    user.bookmarks.push(experienceId);
    bookmarked = true;
  }
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, bookmarked });
});

// @desc    Get my bookmarked experiences
// @route   GET /api/users/bookmarks/me
// @access  Private
const getMyBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "bookmarks",
    populate: [{ path: "company", select: "name slug" }, { path: "author", select: "name" }],
  });
  res.status(200).json({ success: true, bookmarks: user.bookmarks });
});

module.exports = { updateProfile, getPublicProfile, toggleBookmark, getMyBookmarks };
