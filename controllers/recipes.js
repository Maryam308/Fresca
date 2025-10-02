const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe");
const Cuisine = require("../models/cuisine");
const multer = require("multer");
const { storage } = require("../config/cloudinary.js");

const parser = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Route to render "Add New Recipe" form
router.get("/new", async (req, res) => {
  try {
    // Check authentication
    if (!req.session.user) {
      return res.redirect("/auth/sign-in");
    }

    const cuisines = await Cuisine.find({});
    if (cuisines.length === 0) {
      return res.render("recipes/new.ejs", {
        cuisines: null,
        message: "No cuisines available. Please add a cuisine first.",
      });
    }

    res.render("recipes/new.ejs", { cuisines, message: null });
  } catch (error) {
    res.send(`Error fetching cuisines: ${error}`);
  }
});

// Route to list all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({})
      .populate("cuisineId")
      .populate("authorId")
      .sort({ createdAt: -1 });

    // Fetch all cuisines for the filter buttons
    const cuisines = await Cuisine.find({}).sort({ cuisineName: 1 });

    // Pass both recipes and cuisines, and current user info
    res.render("recipes/index.ejs", {
      recipes,
      cuisines,
      currentUser: req.session.user || null,
      page: "recipes",
    });
  } catch (error) {
    res.send(`Error fetching recipes: ${error}`);
  }
});

// Route to show edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("cuisineId");
    if (!recipe) return res.status(404).send("Recipe not found");

    // Check if user owns recipe or is admin
    if (
      !req.session.user ||
      (req.session.user._id.toString() !== recipe.authorId.toString() &&
        req.session.user.role !== "admin")
    ) {
      return res.status(403).send("Access denied");
    }

    const cuisines = await Cuisine.find({});
    res.render("recipes/edit.ejs", {
      recipe,
      cuisines,
      message: null,
    });
  } catch (error) {
    res.send(`Error fetching recipe for edit: ${error}`);
  }
});

// POST route to add a new recipe
router.post("/", (req, res, next) => {
  parser.single("recipeImage")(req, res, async function (err) {
    try {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          const cuisines = await Cuisine.find({});
          return res.render("recipes/new.ejs", {
            cuisines,
            message: "File too large. Maximum allowed size is 20MB.",
          });
        }
        if (err.message && err.message.includes("Invalid file")) {
          const cuisines = await Cuisine.find({});
          return res.render("recipes/new.ejs", {
            cuisines,
            message: "Invalid file type. Only JPG, JPEG, and PNG are allowed.",
          });
        }
        const cuisines = await Cuisine.find({});
        return res.render("recipes/new.ejs", {
          cuisines,
          message: "Error uploading file. Please try again.",
        });
      }

      const { title, ingredients, steps, prepTime, cookTime, cuisineId } =
        req.body;

      //  Server-side validation
      if (
        !title ||
        !prepTime ||
        !cookTime ||
        !ingredients ||
        ingredients.length === 0 ||
        !steps ||
        steps.length === 0
      ) {
        const cuisines = await Cuisine.find({});
        return res.render("recipes/new.ejs", {
          cuisines,
          message: "All required fields must be filled.",
        });
      }

      const authorId = req.session.user._id;

      const newRecipe = new Recipe({
        title,
        ingredients,
        steps,
        prepTime,
        cookTime,
        authorId,
        cuisineId: cuisineId || null,
        recipeImage: req.file ? req.file.path : null,
      });

      await newRecipe.save();
      res.redirect(`/recipes/${newRecipe._id}`);
    } catch (error) {
      res.send(`Error creating recipe: ${error}`);
    }
  });
});

// PUT route to update recipe
router.put("/:id", parser.single("recipeImage"), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).send("Recipe not found");

    if (
      !req.session.user ||
      (req.session.user._id.toString() !== recipe.authorId.toString() &&
        req.session.user.role !== "admin")
    ) {
      return res.status(403).send("Access denied");
    }

    const { title, ingredients, steps, prepTime, cookTime, cuisineId } =
      req.body;

    // Server-side validation
    if (
      !title ||
      !prepTime ||
      !cookTime ||
      !ingredients ||
      ingredients.length === 0 ||
      !steps ||
      steps.length === 0
    ) {
      const cuisines = await Cuisine.find({});
      return res.render("recipes/edit.ejs", {
        recipe,
        cuisines,
        message: "All required fields must be filled.",
      });
    }

    const updateData = {
      title,
      ingredients,
      steps,
      prepTime,
      cookTime,
      cuisineId: cuisineId || null,
    };

    if (req.file) {
      updateData.recipeImage = req.file.path;
    }

    await Recipe.findByIdAndUpdate(req.params.id, updateData);
    res.redirect(`/recipes/${req.params.id}`);
  } catch (error) {
    res.send(`Error updating recipe: ${error}`);
  }
});

// Route to fetch a specific recipe (must be after /new and /:id/edit)
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("cuisineId")
      .populate("authorId");
    if (!recipe) return res.status(404).send("Recipe not found");

    // Pass currentUser to the template for edit/delete permissions
    res.render("recipes/show.ejs", {
      recipe,
      currentUser: req.session.user || null,
    });
  } catch (error) {
    res.send(`Error fetching recipe: ${error}`);
  }
});

// DELETE route to delete recipe
router.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).send("Recipe not found");

    // Check if user owns recipe or is admin
    if (
      !req.session.user ||
      (req.session.user._id.toString() !== recipe.authorId.toString() &&
        req.session.user.role !== "admin")
    ) {
      return res.status(403).send("Access denied");
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.redirect("/recipes");
  } catch (error) {
    res.send(`Error deleting recipe: ${error}`);
  }
});

module.exports = router;
