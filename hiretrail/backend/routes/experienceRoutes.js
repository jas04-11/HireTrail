const express = require("express");
const router = express.Router();
const {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  toggleLike,
  addComment,
  deleteComment,
  getMyExperiences,
} = require("../controllers/experienceController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

router.get("/", optionalAuth, getExperiences);
router.post("/", protect, createExperience);
router.get("/mine/all", protect, getMyExperiences);
router.get("/:id", optionalAuth, getExperienceById);
router.put("/:id", protect, updateExperience);
router.delete("/:id", protect, deleteExperience);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

module.exports = router;
