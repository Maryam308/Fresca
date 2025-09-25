const mongoose = require("mongoose");

const cuisineSchema = new mongoose.Schema({
  cuisineName: {
    type: String,
    required: true,
    trim: true,
  },
});

const Cuisine = mongoose.model("Cuisine", cuisineSchema);
module.exports = Cuisine;
