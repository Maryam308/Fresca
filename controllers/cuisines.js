const express = require("express");
const router = express.Router();

const Cuisine = require("../models/cuisine");
const Recipe = require("../models/recipe");
const isAdmin = require("../middleware/is-admin");

// Admin route to view all cuisines
router.get("/", isAdmin, async (req, res) => {
  try {
    const cuisines = await Cuisine.find({}).sort({ cuisineName: 1 });
    res.render("cuisines/index.ejs", {
      cuisines,
      user: req.session.user,
      page: "cuisines",
    });
  } catch (error) {
    res.send(`Error fetching cuisines: ${error}`);
  }
});

// Admin route to create a new cuisine
router.post("/", isAdmin, async (req, res) => {
  try {
    const { cuisineName } = req.body;

    // Check if cuisine already exists
    const existingCuisine = await Cuisine.findOne({
      cuisineName: { $regex: new RegExp(cuisineName, "i") },
    });

    if (existingCuisine) {
      return res.status(400).json({ error: "Cuisine already exists" });
    }

    const newCuisine = new Cuisine({ cuisineName: cuisineName.trim() });
    await newCuisine.save();

    res.redirect("/cuisines");
  } catch (error) {
    res.send(`Error creating cuisine: ${error}`);
  }
});

// Admin route to update a cuisine
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const { cuisineName } = req.body;
    const { id } = req.params;

    // Check if another cuisine with the same name exists (excluding current one)
    const existingCuisine = await Cuisine.findOne({
      cuisineName: { $regex: new RegExp(cuisineName, "i") },
      _id: { $ne: id },
    });

    if (existingCuisine) {
      return res.status(400).json({ error: "Cuisine name already exists" });
    }

    await Cuisine.findByIdAndUpdate(id, { cuisineName: cuisineName.trim() });
    res.redirect("/cuisines");
  } catch (error) {
    res.send(`Error updating cuisine: ${error}`);
  }
});

// Admin route to delete a cuisine
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if any recipes are using this cuisine
    const recipesUsingCuisine = await Recipe.countDocuments({ cuisineId: id });

    if (recipesUsingCuisine > 0) {
      return res.status(400).json({
        error: `Cannot delete cuisine. It is being used by ${recipesUsingCuisine} recipe(s).`,
      });
    }

    await Cuisine.findByIdAndDelete(id);
    res.redirect("/cuisines");
  } catch (error) {
    res.send(`Error deleting cuisine: ${error}`);
  }
});

module.exports = router;
