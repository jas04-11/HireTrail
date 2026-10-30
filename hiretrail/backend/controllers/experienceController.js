const asyncHandler = require("express-async-handler");
const Experience = require("../models/Experience");
const Company = require("../models/Company");
const { createNotification } = require("../utils/notify");

const AUTHOR_SELECT = "name headline currentCompany college";

// Strips author identity for anonymous posts before sending to client
const maskAnonymous = (expDoc, viewerId) => {
  const exp = expDoc.toObject ? expDoc.toObject() : expDoc;
  const isOwner = viewerId && exp.author?._id?.toString() === viewerId.toString();
  if (exp.isAnonymous && !isOwner) {
    exp.author = { _id: exp.author?._id, name: "Anonymous Student", headline: "" };
  }
  return exp;
};

// @desc    Create a new interview experience
// @route   POST /api/experiences
// @access  Private (Student)
const createExperience = asyncHandler(async (req, res) => {
  const {
    companyName,
    jobRole,
    jobType,
    packageOffered,
    interviewDate,
    eligibilityCriteria,
    interviewMode,
    numberOfRounds,
    rounds,
    resourcesUsed,
    preparationStrategy,
    mistakesMade,
    tipsForJuniors,
    finalResult,
    technologies,
    tags,
    isAnonymous,
  } = req.body;

  if (!companyName || !jobRole || !interviewDate || !rounds?.length || !finalResult) {
    res.status(400);
    throw new Error("Company, role, interview date, rounds and final result are required");
  }

  // Find or create the company (case-insensitive match)
  let company = await Company.findOne({ name: new RegExp(`^${companyName.trim()}$`, "i") });
  if (!company) {
    company = await Company.create({ name: companyName.trim() });
  }

  const experience = await Experience.create({
    author: req.user._id,
    isAnonymous: Boolean(isAnonymous),
    company: company._id,
    companyNameSnapshot: company.name,
    jobRole,
    jobType,
    packageOffered,
    interviewDate,
    eligibilityCriteria,
    interviewMode,
    numberOfRounds: numberOfRounds || rounds.length,
    rounds,
    resourcesUsed,
    preparationStrategy,
    mistakesMade,
    tipsForJuniors,
    finalResult,
    technologies: technologies || [],
    tags: tags || [],
  });

  company.experienceCount += 1;
  await company.save();

  const populated = await Experience.findById(experience._id).populate("company", "name slug").populate("author", AUTHOR_SELECT);

  res.status(201).json({ success: true, experience: maskAnonymous(populated, req.user._id) });
});

// @desc    Get paginated feed of experiences with filters/search
// @route   GET /api/experiences
// @access  Public
const getExperiences = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 30);
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }
  if (req.query.company) {
    query.companyNameSnapshot = new RegExp(req.query.company, "i");
  }
  if (req.query.role) {
    query.jobRole = new RegExp(req.query.role, "i");
  }
  if (req.query.tech) {
    query.technologies = new RegExp(req.query.tech, "i");
  }
  if (req.query.tag) {
    query.tags = new RegExp(req.query.tag, "i");
  }
  if (req.query.result) {
    query.finalResult = req.query.result;
  }
  if (req.query.jobType) {
    query.jobType = req.query.jobType;
  }

  const sortMap = {
    latest: { createdAt: -1 },
    popular: { "likes.length": -1, createdAt: -1 },
    oldest: { createdAt: 1 },
  };
  const sort = sortMap[req.query.sort] || sortMap.latest;

  const [experiences, total] = await Promise.all([
    Experience.find(query)
      .populate("company", "name slug")
      .populate("author", AUTHOR_SELECT)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Experience.countDocuments(query),
  ]);

  const masked = experiences.map((e) => maskAnonymous(e, req.user?._id));

  res.status(200).json({
    success: true,
    experiences: masked,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

// @desc    Get a single experience by ID (increments view count)
// @route   GET /api/experiences/:id
// @access  Public
const getExperienceById = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id)
    .populate("company", "name slug industry website description")
    .populate("author", AUTHOR_SELECT)
    .populate("comments.user", "name headline");

  if (!experience) {
    res.status(404);
    throw new Error("Experience not found");
  }

  experience.views += 1;
  await experience.save({ validateBeforeSave: false });

  const result = maskAnonymous(experience, req.user?._id);

  res.status(200).json({ success: true, experience: result });
});

// @desc    Update own experience
// @route   PUT /api/experiences/:id
// @access  Private (owner only)
const updateExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) {
    res.status(404);
    throw new Error("Experience not found");
  }
  if (experience.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only edit your own experience");
  }

  const editableFields = [
    "jobRole",
    "jobType",
    "packageOffered",
    "interviewDate",
    "eligibilityCriteria",
    "interviewMode",
    "numberOfRounds",
    "rounds",
    "resourcesUsed",
    "preparationStrategy",
    "mistakesMade",
    "tipsForJuniors",
    "finalResult",
    "technologies",
    "tags",
    "isAnonymous",
  ];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) experience[field] = req.body[field];
  });

  if (req.body.companyName) {
    let company = await Company.findOne({ name: new RegExp(`^${req.body.companyName.trim()}$`, "i") });
    if (!company) company = await Company.create({ name: req.body.companyName.trim() });
    experience.company = company._id;
    experience.companyNameSnapshot = company.name;
  }

  await experience.save();

  const populated = await Experience.findById(experience._id).populate("company", "name slug").populate("author", AUTHOR_SELECT);
  res.status(200).json({ success: true, experience: maskAnonymous(populated, req.user._id) });
});

// @desc    Delete own experience
// @route   DELETE /api/experiences/:id
// @access  Private (owner only)
const deleteExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) {
    res.status(404);
    throw new Error("Experience not found");
  }
  if (experience.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only delete your own experience");
  }

  await Company.findByIdAndUpdate(experience.company, { $inc: { experienceCount: -1 } });
  await experience.deleteOne();

  res.status(200).json({ success: true, message: "Experience deleted" });
});

// @desc    Like / unlike an experience
// @route   PUT /api/experiences/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) {
    res.status(404);
    throw new Error("Experience not found");
  }

  const alreadyLiked = experience.likes.some((id) => id.toString() === req.user._id.toString());

  if (alreadyLiked) {
    experience.likes = experience.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    experience.likes.push(req.user._id);
    await createNotification({
      recipient: experience.author,
      sender: req.user._id,
      type: "like",
      message: `${req.user.name} liked your ${experience.jobRole} experience at ${experience.companyNameSnapshot}`,
      link: `/experiences/${experience._id}`,
      experience: experience._id,
    });
  }

  await experience.save();
  res.status(200).json({ success: true, liked: !alreadyLiked, likeCount: experience.likes.length });
});

// @desc    Add a comment
// @route   POST /api/experiences/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    res.status(400);
    throw new Error("Comment cannot be empty");
  }

  const experience = await Experience.findById(req.params.id);
  if (!experience) {
    res.status(404);
    throw new Error("Experience not found");
  }

  experience.comments.push({ user: req.user._id, text: text.trim() });
  await experience.save();

  await createNotification({
    recipient: experience.author,
    sender: req.user._id,
    type: "comment",
    message: `${req.user.name} commented on your ${experience.jobRole} experience at ${experience.companyNameSnapshot}`,
    link: `/experiences/${experience._id}`,
    experience: experience._id,
  });

  const populated = await Experience.findById(experience._id).populate("comments.user", "name headline");
  res.status(201).json({ success: true, comments: populated.comments });
});

// @desc    Delete own comment
// @route   DELETE /api/experiences/:id/comments/:commentId
// @access  Private (comment owner only)
const deleteComment = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) {
    res.status(404);
    throw new Error("Experience not found");
  }

  const comment = experience.comments.id(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only delete your own comment");
  }

  comment.deleteOne();
  await experience.save();
  res.status(200).json({ success: true, message: "Comment deleted" });
});

// @desc    Get experiences authored by the logged-in user
// @route   GET /api/experiences/mine/all
// @access  Private
const getMyExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({ author: req.user._id })
    .populate("company", "name slug")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, experiences });
});

module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  toggleLike,
  addComment,
  deleteComment,
  getMyExperiences,
};
