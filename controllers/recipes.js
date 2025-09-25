const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe");
const Cuisine = require("../models/cuisine");
const multer = require("multer");
const { storage } = require("../config/cloudinary.js");

const parser = multer({ storage });

router.get("/new", async (req, res) => {
  try {
    const cuisines = await Cuisine.find({});

    if (cuisines.length === 0) {
      return res.render("recipes/new.ejs", {
        cuisines: null,
        message: "No cuisines available. Please add a cuisine first.",
      });
    }

    res.render("recipes/new.ejs", { cuisines, message: null });
  } catch (error) {
    console.log(`Error fetching cuisines: ${error}`);
    res.render("recipes/new.ejs", {
      cuisines: null,
      message: "Error fetching cuisines. Please try again later.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("cuisineId")
      .populate("authorId");
    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }
    res.render("recipes/show.ejs", { recipe });
  } catch (error) {
    console.log(`Error fetching recipe: ${error}`);
    res.redirect("/recipes");
  }
});

router.get("/", async (req, res) => {
  try {
    res.render("recipes/index.ejs");
  } catch (error) {
    console.log(`Error: ${error}`);
    res.redirect("/");
  }
});

// POST route to handle adding a new recipe
router.post("/", parser.single("recipeImage"), async (req, res) => {
  try {
    const { title, ingredients, steps, prepTime, cookTime, cuisineId } =
      req.body;

    const authorId = req.session.user._id;

    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      prepTime,
      cookTime,
      authorId,
      cuisineId: cuisineId || null,
      // Save the Cloudinary URL
      recipeImage: req.file ? req.file.path : null,
    });

    await newRecipe.save();

    res.redirect(`/recipes/${newRecipe._id}`);
  } catch (error) {
    console.log(`Error creating recipe: ${error}`);
    res.redirect("/recipes");
  }
});

module.exports = router;
