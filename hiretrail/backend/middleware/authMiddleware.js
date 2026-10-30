const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Verifies JWT (from Authorization header OR httpOnly cookie) and attaches req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.ht_token) {
    token = req.cookies.ht_token;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error("User no longer exists.");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized. Token invalid or expired.");
  }
});

// Attaches req.user if a valid token is present, but does not block the request
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.ht_token) {
    token = req.cookies.ht_token;
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (e) {
      req.user = null;
    }
  }
  next();
});

module.exports = { protect, optionalAuth };
