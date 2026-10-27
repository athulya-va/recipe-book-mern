const mongoose = require('mongoose');

// Recipe Schema definition matching evaluation criteria
const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      minlength: [2, 'Recipe name must be at least 2 characters long'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other'],
        message: '{VALUE} is not a valid category',
      },
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0 && arr.some((item) => item.trim().length > 0);
        },
        message: 'Please provide at least one valid ingredient',
      },
    },
    preparationSteps: {
      type: String,
      required: [true, 'Preparation steps are required'],
      trim: true,
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be at least 1 minute'],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
