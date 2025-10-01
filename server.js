const dotenv = require("dotenv");

dotenv.config();
require("./config/database.js");
const express = require("express");
const path = require("path");
const app = express();

const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");
const Recipe = require("./models/recipe");
const Cuisine = require("./models/cuisine");
const recipesController = require("./controllers/recipes");
const cuisineController = require("./controllers/cuisines.js");
// Controllers
const authController = require("./controllers/auth.js");

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT ? process.env.PORT : "3000";

// MIDDLEWARE
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
// Session Storage with MongoStore
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.use(passUserToView);
app.use("/auth", authController);
app.use("/recipes", recipesController);
app.use("/cuisines", cuisineController);

// PUBLIC ROUTES
app.get("/", async (req, res) => {
  try {
    // Fetch 4 most recent recipes with populated author and cuisine data
    const recentRecipes = await Recipe.find()
      .populate("authorId", "username")
      .populate("cuisineId", "cuisineName")
      .sort({ createdAt: -1 })
      .limit(4);

    res.render("index.ejs", {
      user: req.session.user,
      page: "home",
      recentRecipes: recentRecipes,
    });
  } catch (error) {
    //  render with empty recipes array if there's an error
    res.render("index.ejs", {
      user: req.session.user,
      page: "home",
      recentRecipes: [],
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about.ejs", {
    user: req.session.user,
    page: "about",
  });
});

app.get("/recipes", (req, res) => {
  res.render("recipes.ejs", {
    user: req.session.user,
    page: "recipes",
  });
});
