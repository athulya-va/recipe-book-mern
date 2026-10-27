const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// Helper to check if MongoDB Atlas connection is currently open
const isDbConnected = () => mongoose.connection.readyState === 1;

// Initial in-memory recipes for instant offline preview & resilience
let fallbackRecipes = [
  {
    _id: '6630f1e29a43a12345678901',
    name: 'Fluffy Buttermilk Pancakes',
    category: 'Breakfast',
    ingredients: [
      '2 cups all-purpose flour',
      '2 tbsp granulated sugar',
      '2 tsp baking powder',
      '1/2 tsp salt',
      '2 cups buttermilk',
      '2 large eggs',
      '1/4 cup melted butter',
      'Maple syrup for serving',
    ],
    preparationSteps:
      '1. Whisk dry ingredients in a bowl.\n2. In another bowl, whisk buttermilk, eggs, and melted butter.\n3. Combine wet and dry ingredients gently.\n4. Cook 1/4 cup batter on a hot griddle until bubbly, flip and cook until golden.\n5. Serve warm with butter and syrup.',
    cookingTime: 20,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    _id: '6630f1e29a43a12345678902',
    name: 'Mediterranean Grilled Chicken Salad',
    category: 'Lunch',
    ingredients: [
      '2 boneless chicken breasts',
      '4 cups chopped romaine lettuce',
      '1 cup cherry tomatoes, halved',
      '1/2 cucumber, sliced',
      '1/2 cup crumbled feta cheese',
      '2 tbsp extra virgin olive oil',
      '1 tbsp fresh lemon juice',
    ],
    preparationSteps:
      '1. Season chicken breasts with olive oil, lemon juice, salt, and pepper.\n2. Grill chicken for 6-7 minutes per side until cooked through.\n3. Slice chicken into bite-sized strips.\n4. Assemble lettuce, cucumber, tomatoes, and olives in a large salad bowl.\n5. Top with sliced grilled chicken and crumbled feta.',
    cookingTime: 25,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: '6630f1e29a43a12345678903',
    name: 'Classic Creamy Garlic Pasta',
    category: 'Dinner',
    ingredients: [
      '250g fettuccine pasta',
      '3 cloves garlic, minced',
      '2 tbsp unsalted butter',
      '1 cup heavy cream',
      '1/2 cup freshly grated parmesan cheese',
      'Fresh chopped parsley for garnish',
    ],
    preparationSteps:
      '1. Boil pasta in salted water until al dente.\n2. Melt butter in a wide skillet, add minced garlic, and sauté for 1 minute.\n3. Pour in heavy cream and simmer gently for 3 minutes.\n4. Stir in grated parmesan cheese until silky and smooth.\n5. Toss pasta with sauce and garnish with parsley.',
    cookingTime: 18,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

// Helper to normalize ingredients input (handles arrays or comma/newline strings)
const parseIngredients = (input) => {
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

// @desc    Get all recipes
// @route   GET /api/recipes
exports.getRecipes = async (req, res) => {
  try {
    if (isDbConnected()) {
      const recipes = await Recipe.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes,
      });
    }

    // Fallback if MongoDB is not connected
    const sorted = [...fallbackRecipes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return res.status(200).json({
      success: true,
      count: sorted.length,
      data: sorted,
      note: 'Using local store. Connect MongoDB Atlas to persist permanently.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes: ' + error.message,
    });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid recipe ID format',
        });
      }

      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: recipe,
      });
    }

    // Fallback store
    const item = fallbackRecipes.find((r) => String(r._id) === String(id));
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recipe: ' + error.message,
    });
  }
};

// @desc    Create a new recipe
// @route   POST /api/recipes
exports.createRecipe = async (req, res) => {
  try {
    const { name, category, ingredients, preparationSteps, cookingTime } = req.body;

    // Field validations
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Recipe name is required',
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    const parsedIngredients = parseIngredients(ingredients);
    if (!parsedIngredients || parsedIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient',
      });
    }

    if (!preparationSteps || !preparationSteps.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Preparation steps are required',
      });
    }

    const timeNumber = Number(cookingTime);
    if (isNaN(timeNumber) || timeNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cooking time must be a positive number greater than 0 minutes',
      });
    }

    if (isDbConnected()) {
      const newRecipe = await Recipe.create({
        name: name.trim(),
        category: category.trim(),
        ingredients: parsedIngredients,
        preparationSteps: preparationSteps.trim(),
        cookingTime: timeNumber,
      });

      return res.status(201).json({
        success: true,
        message: 'Recipe added successfully!',
        data: newRecipe,
      });
    }

    // Fallback store creation
    const newRecipe = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: name.trim(),
      category: category.trim(),
      ingredients: parsedIngredients,
      preparationSteps: preparationSteps.trim(),
      cookingTime: timeNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fallbackRecipes.unshift(newRecipe);

    return res.status(201).json({
      success: true,
      message: 'Recipe added successfully!',
      data: newRecipe,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error saving recipe',
    });
  }
};

// @desc    Update an existing recipe
// @route   PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, ingredients, preparationSteps, cookingTime } = req.body;

    // Validation checks
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ success: false, message: 'Recipe name cannot be empty' });
    }

    if (category !== undefined && !category.trim()) {
      return res.status(400).json({ success: false, message: 'Category cannot be empty' });
    }

    if (cookingTime !== undefined) {
      const timeNumber = Number(cookingTime);
      if (isNaN(timeNumber) || timeNumber <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Cooking time must be a positive number greater than 0 minutes',
        });
      }
    }

    if (preparationSteps !== undefined && !preparationSteps.trim()) {
      return res.status(400).json({ success: false, message: 'Preparation steps cannot be empty' });
    }

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid recipe ID format' });
      }

      const updateData = {};
      if (name) updateData.name = name.trim();
      if (category) updateData.category = category.trim();
      if (preparationSteps) updateData.preparationSteps = preparationSteps.trim();
      if (cookingTime !== undefined) updateData.cookingTime = Number(cookingTime);
      if (ingredients !== undefined) {
        const parsed = parseIngredients(ingredients);
        if (parsed.length === 0) {
          return res.status(400).json({ success: false, message: 'At least one ingredient is required' });
        }
        updateData.ingredients = parsed;
      }

      const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedRecipe) {
        return res.status(404).json({ success: false, message: 'Recipe not found to update' });
      }

      return res.status(200).json({
        success: true,
        message: 'Recipe updated successfully!',
        data: updatedRecipe,
      });
    }

    // Fallback store update
    const index = fallbackRecipes.findIndex((r) => String(r._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Recipe not found to update' });
    }

    const current = fallbackRecipes[index];
    const updated = {
      ...current,
      name: name ? name.trim() : current.name,
      category: category ? category.trim() : current.category,
      preparationSteps: preparationSteps ? preparationSteps.trim() : current.preparationSteps,
      cookingTime: cookingTime !== undefined ? Number(cookingTime) : current.cookingTime,
      ingredients: ingredients !== undefined ? parseIngredients(ingredients) : current.ingredients,
      updatedAt: new Date().toISOString(),
    };

    fallbackRecipes[index] = updated;

    return res.status(200).json({
      success: true,
      message: 'Recipe updated successfully!',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating recipe',
    });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid recipe ID format' });
      }

      const recipe = await Recipe.findByIdAndDelete(id);
      if (!recipe) {
        return res.status(404).json({ success: false, message: 'Recipe not found to delete' });
      }

      return res.status(200).json({
        success: true,
        message: 'Recipe deleted successfully!',
        data: { id: recipe._id },
      });
    }

    // Fallback store deletion
    const initialLength = fallbackRecipes.length;
    fallbackRecipes = fallbackRecipes.filter((r) => String(r._id) !== String(id));

    if (fallbackRecipes.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Recipe not found to delete' });
    }

    return res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully!',
      data: { id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe: ' + error.message,
    });
  }
};
