const mongoose = require("mongoose");

const cuisineSchema = new mongoose.Schema({
  cuisineName: {
    type: String,
    required: true,
    trim: true,
  },
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    ingredients: {
      type: [String],
      required: true,
    },

    steps: {
      type: [String],
      required: true,
    },

    recipeImage: {
      type: String,
      required: true,
    },

    prepTime: {
      type: Number,
      required: true,
      min: 0,
    },

    cookTime: {
      type: Number,
      required: true,
      min: 0,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cuisineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cuisine",
    },
  },
  {
    timestamps: true,
  }
);

const Cuisine = mongoose.model("Cuisine", cuisineSchema);
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = { Recipe, Cuisine };
