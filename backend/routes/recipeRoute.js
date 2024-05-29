const express = require("express");
const UserModel = require("../models/User");
const RecipeModel = require("../models/Recipe");

const router = express.Router();

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (error) {
    res.json({ message: error });
  }
});

// Create new recipe
router.post("/", async (req, res) => {
  const recipe = new RecipeModel(req.body);
  try {
    const response = await recipe.save();
    res.json(response);
  } catch (error) {
    res.json({ message: error });
  }
});

router.put("/", async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeId);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe); // Pushing the recipe ID to the user's savedRecipes array
    await user.save();
    res.json({ savedRecipes: user.savedRecipes, message: "Recipe saved" });
  } catch (error) {
    res.json({ message: error });
  }
});

// Get ids of user saved recipes
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json({ message: error });
  }
});

// Get user saved recipes
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({ _id: { $in: user.savedRecipes } });
    res.json({ savedRecipes });
  } catch (error) {
    res.json({ message: error });
  }
});

// Delete saved recipe
router.delete("/savedRecipes/:userID/:recipeId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    user.savedRecipes.pull(req.params.recipeId);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json({ message: error });
  }
});

router.put('/savedRecipes/:userID/:recipeID', async (req, res) => {
  try {
    const recipeId = req.params.recipeID; // corrected variable name
    const { recipe } = req.body; // corrected property name
    if (!recipe) {
      throw new Error('Missing recipe property in request body'); // corrected error message
    }
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(recipeId, recipe, { new: true }); // corrected model name
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

//Fetch a specific recipe based on the ID

router.get("/:recipeId", async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});


module.exports = router;
