// fraud-backend/middlewares/role.middleware.js
module.exports = (requiredRole) => {
  return (req, res, next) => {
    // --- ROLE BYPASS ---
    // Allow everyone to pass regardless of the required role
    return next();
    // -------------------

    /* ORIGINAL ROLE CODE COMMENTED OUT
    if (req.userRole !== requiredRole) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
    */
  };
};