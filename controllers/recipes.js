const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe");

router.get("/", async (req, res) => {
  try {
    res.render("recipes/index.ejs");
  } catch (error) {
    console.log(`Error: ${error}`);
    res.redirect("/");
  }
});
