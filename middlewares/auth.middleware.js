// fraud-backend/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // --- PUBLIC ACCESS OVERRIDE ---
  // We automatically inject a dummy User ID and Role so controllers don't crash.
  // This makes every request act as if it's from an authenticated ADMIN.
  req.userId = "65a1234567890abcdef12345"; // A dummy valid MongoDB ObjectId
  req.userRole = "ADMIN";
  return next(); 
  // ------------------------------

  /* ORIGINAL AUTH CODE COMMENTED OUT
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
  */
};