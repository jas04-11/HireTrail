const express = require("express");
const router = express.Router();
const {
  updateProfile,
  getPublicProfile,
  toggleBookmark,
  getMyBookmarks,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.put("/profile", protect, updateProfile);
router.get("/bookmarks/me", protect, getMyBookmarks);
router.put("/bookmarks/:experienceId", protect, toggleBookmark);
router.get("/:id", getPublicProfile);

module.exports = router;
