const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  res.status(403).render("error.ejs", {
    message: "Access denied. Admin privileges required.",
    user: req.session.user,
  });
};

module.exports = isAdmin;
