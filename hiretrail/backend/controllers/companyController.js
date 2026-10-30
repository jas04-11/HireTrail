const asyncHandler = require("express-async-handler");
const Company = require("../models/Company");
const Experience = require("../models/Experience");

// @desc    List all companies (with search + sort by most experiences)
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.search) {
    query.name = new RegExp(req.query.search, "i");
  }

  const companies = await Company.find(query).sort({ experienceCount: -1 });
  res.status(200).json({ success: true, companies });
});

// @desc    Get a company page by slug, with its published experiences
// @route   GET /api/companies/:slug
// @access  Public
const getCompanyBySlug = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ slug: req.params.slug });
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const experiences = await Experience.find({ company: company._id })
    .populate("author", "name headline")
    .sort({ createdAt: -1 });

  const masked = experiences.map((exp) => {
    const e = exp.toObject();
    if (e.isAnonymous) e.author = { name: "Anonymous Student" };
    return e;
  });

  // Quick stats for the company header
  const stats = {
    totalExperiences: experiences.length,
    selected: experiences.filter((e) => e.finalResult === "Selected").length,
    roles: [...new Set(experiences.map((e) => e.jobRole))],
  };

  res.status(200).json({ success: true, company, experiences: masked, stats });
});

module.exports = { getCompanies, getCompanyBySlug };
