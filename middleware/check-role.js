const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/auth/sign-in");
    }

    if (roles.includes(req.session.user.role)) {
      return next();
    }

    res.status(403).render("error.ejs", {
      message: "Access denied. Insufficient privileges.",
      user: req.session.user,
    });
  };
};

module.exports = checkRole;
