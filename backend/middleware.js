// middleware.js
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save the original URL
    return res
      .status(401)
      .json({
        success: false,
        message: "You must be logged in to access this resource",
      });
  }
  next(); // Proceed if the user is authenticated
};
