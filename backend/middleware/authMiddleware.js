const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Modules
const User = require("../models/userModels");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get User from Token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized");
  }
});

module.exports = {
  protect,
};
