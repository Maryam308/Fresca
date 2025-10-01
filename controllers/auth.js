const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs", { error: null });
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs", { error: null });
});

router.post("/sign-up", async (req, res) => {
  try {
    // Validate input
    if (!req.body.username || !req.body.password || !req.body.confirmPassword) {
      return res.render("auth/sign-up.ejs", {
        error: "All fields are required",
      });
    }

    // Check username length
    if (req.body.username.length < 3) {
      return res.render("auth/sign-up.ejs", {
        error: "Username must be at least 3 characters long",
      });
    }

    // Check password length
    if (req.body.password.length < 6) {
      return res.render("auth/sign-up.ejs", {
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if user exists
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
      return res.render("auth/sign-up.ejs", {
        error: "Username already taken",
      });
    }

    // Check password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.render("auth/sign-up.ejs", {
        error: "Passwords do not match",
      });
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    // Set session
    req.session.user = {
      username: newUser.username,
      _id: newUser._id,
      role: newUser.role,
    };

    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.render("auth/sign-up.ejs", {
      error: "An error occurred during registration. Please try again.",
    });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    // Validate input
    if (!req.body.username || !req.body.password) {
      return res.render("auth/sign-in.ejs", {
        error: "All fields are required",
      });
    }

    const userInDatabase = await User.findOne({ username: req.body.username });

    if (!userInDatabase) {
      return res.render("auth/sign-in.ejs", {
        error: "Invalid username or password",
      });
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );

    if (!validPassword) {
      return res.render("auth/sign-in.ejs", {
        error: "Invalid username or password",
      });
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
      role: userInDatabase.role,
    };

    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.render("auth/sign-in.ejs", {
      error: "An error occurred during login. Please try again.",
    });
  }
});

router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
