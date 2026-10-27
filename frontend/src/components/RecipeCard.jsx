import React from 'react';

// Category color badges helper
const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case 'breakfast':
      return 'category-breakfast';
    case 'lunch':
      return 'category-lunch';
    case 'dinner':
      return 'category-dinner';
    case 'snack':
      return 'category-snack';
    case 'dessert':
      return 'category-dessert';
    default:
      return 'category-default';
  }
};

const RecipeCard = ({ recipe, onView, onEdit, onDelete }) => {
  return (
    <div className="recipe-card" onClick={() => onView(recipe)}>
      <div className="card-header">
        <span className={`category-badge ${getCategoryColor(recipe.category)}`}>
          {recipe.category}
        </span>
        <div className="cooking-time">
          <span className="time-icon">⏱️</span>
          <span>{recipe.cookingTime} min{recipe.cookingTime > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="recipe-title">{recipe.name}</h3>
        <p className="recipe-preview">
          {recipe.ingredients && recipe.ingredients.length > 0
            ? `${recipe.ingredients.length} ingredients • ${recipe.ingredients.slice(0, 3).join(', ')}${recipe.ingredients.length > 3 ? '...' : ''}`
            : 'No ingredients listed'}
        </p>
      </div>

      <div className="card-footer" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-card btn-view"
          title="View Recipe Details"
          onClick={() => onView(recipe)}
        >
          View Details
        </button>

        <div className="card-actions">
          <button
            className="btn-card btn-edit"
            title="Edit Recipe"
            onClick={() => onEdit(recipe)}
          >
            ✏️ Edit
          </button>
          <button
            className="btn-card btn-delete"
            title="Delete Recipe"
            onClick={() => onDelete(recipe)}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
