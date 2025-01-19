import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to protect routes that require authentication (token verification + user attachment)
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from header
      token = req.headers.authorization.split(" ")[1];

      // Decode token and verify its validity
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"], // Ensure correct algorithm (default is 'HS256')
      });

      // Optionally: You can check for the token expiration here if you prefer
      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({ message: "Token has expired." });
      }

      // Attach the user info (don't expose sensitive data)
      req.user = await User.findById(decoded.id).select("-password -__v"); // Select only non-sensitive data

      next();
    } catch (error) {
      // Detailed error handling
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      } else {
        return res
          .status(500)
          .json({ message: "Server error during token validation" });
      }
    }
  } else {
    // Handle missing token case
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }
};

// Middleware for role-based access control
export const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You do not have the required role" });
  }
  next();
};
