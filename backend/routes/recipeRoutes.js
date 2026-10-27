const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

// Recipe collection routes: GET all & POST new
router.route('/').get(getRecipes).post(createRecipe);

// Single recipe routes: GET by ID, PUT update, DELETE remove
router.route('/:id').get(getRecipeById).put(updateRecipe).delete(deleteRecipe);

module.exports = router;
