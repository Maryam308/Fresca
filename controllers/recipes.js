const express = require("express");
const router = express.Router();

const { Recipe, Cuisine } = require("../models/recipe");

router.get("/new", async (req, res) => {
  try {
    const cuisines = await Cuisine.find({});
    res.render("recipes/new.ejs", { cuisines });
  } catch (error) {
    console.log(`Error fetching cuisines: ${error}`);
    res.render("recipes/new.ejs", { cuisines: [] });
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
router.post("/", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      title,
      ingredients,
      steps,
      recipeImage,
      prepTime,
      cookTime,
      cuisineId,
    } = req.body;

    const authorId = req.session.user._id;

    // Create a new Recipe instance using the data from the form
    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      recipeImage,
      prepTime,
      cookTime,
      authorId,
      cuisineId: cuisineId || null,
    });

    // Save the new recipe to the database
    await newRecipe.save();

    res.redirect(`/recipes/${newRecipe._id}`);
  } catch (error) {
    console.log(`Error creating recipe: ${error}`);

    res.redirect("/recipes");
  }
});

module.exports = router;
