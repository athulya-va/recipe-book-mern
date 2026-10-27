import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other'];

const RecipeFormModal = ({ isOpen, onClose, onSubmit, recipeToEdit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Breakfast',
    ingredients: '',
    preparationSteps: '',
    cookingTime: '',
  });

  const [formError, setFormError] = useState('');

  // Pre-fill form when editing or reset when adding new
  useEffect(() => {
    if (recipeToEdit) {
      setFormData({
        name: recipeToEdit.name || '',
        category: recipeToEdit.category || 'Breakfast',
        ingredients: Array.isArray(recipeToEdit.ingredients)
          ? recipeToEdit.ingredients.join('\n')
          : recipeToEdit.ingredients || '',
        preparationSteps: recipeToEdit.preparationSteps || '',
        cookingTime: recipeToEdit.cookingTime || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Breakfast',
        ingredients: '',
        preparationSteps: '',
        cookingTime: '',
      });
    }
    setFormError('');
  }, [recipeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validations
    if (!formData.name.trim()) {
      setFormError('Recipe name is required.');
      return;
    }

    if (!formData.category.trim()) {
      setFormError('Please select a category.');
      return;
    }

    const timeNum = Number(formData.cookingTime);
    if (!formData.cookingTime || isNaN(timeNum) || timeNum <= 0) {
      setFormError('Cooking time must be a valid positive number (e.g. 15, 30, 45 minutes).');
      return;
    }

    if (!formData.ingredients.trim()) {
      setFormError('Please enter at least one ingredient.');
      return;
    }

    if (!formData.preparationSteps.trim()) {
      setFormError('Preparation steps are required.');
      return;
    }

    // Split ingredients by newline or comma and filter empty entries
    const ingredientsArray = formData.ingredients
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (ingredientsArray.length === 0) {
      setFormError('Please provide at least one valid ingredient item.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      cookingTime: timeNum,
      ingredients: ingredientsArray,
      preparationSteps: formData.preparationSteps.trim(),
    };

    onSubmit(payload, recipeToEdit ? recipeToEdit._id : null);
  };

  const isEditMode = Boolean(recipeToEdit);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditMode ? '✏️ Edit Recipe' : '✨ Add New Recipe'}
            </h2>
            <p className="modal-subtitle">
              {isEditMode
                ? 'Update recipe ingredients, timing or instructions'
                : 'Fill in the details below to add a delicious recipe to your book'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {formError && (
          <div className="alert alert-error">
            <span>⚠️ {formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Recipe Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Recipe Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Creamy Garlic Butter Pasta"
              className="form-input"
              autoFocus
            />
          </div>

          {/* Category & Cooking Time Row */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="cookingTime" className="form-label">
                Cooking Time (in minutes) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="cookingTime"
                name="cookingTime"
                min="1"
                step="1"
                value={formData.cookingTime}
                onChange={handleChange}
                placeholder="e.g., 25"
                className="form-input"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label htmlFor="ingredients" className="form-label">
              Ingredients <span className="required">*</span>
              <span className="label-hint">(Enter each ingredient on a new line or comma-separated)</span>
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              rows="4"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder={"200g Fettuccine pasta\n2 cloves garlic, minced\n1 cup heavy cream\nSalt & pepper to taste"}
              className="form-textarea"
            />
          </div>

          {/* Preparation Steps */}
          <div className="form-group">
            <label htmlFor="preparationSteps" className="form-label">
              Preparation Steps <span className="required">*</span>
              <span className="label-hint">(Describe step-by-step instructions)</span>
            </label>
            <textarea
              id="preparationSteps"
              name="preparationSteps"
              rows="5"
              value={formData.preparationSteps}
              onChange={handleChange}
              placeholder={"1. Boil pasta in salted water until al dente.\n2. Sauté minced garlic in butter over medium heat.\n3. Pour in heavy cream and simmer for 3 minutes.\n4. Toss cooked pasta with sauce and garnish with parsley."}
              className="form-textarea"
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                ? 'Update Recipe'
                : 'Save Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeFormModal;
