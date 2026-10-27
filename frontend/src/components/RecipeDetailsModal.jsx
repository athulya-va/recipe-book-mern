import React, { useEffect } from 'react';

const RecipeDetailsModal = ({ recipe, isOpen, onClose, onEdit }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !recipe) return null;

  // Format steps into paragraphs or numbered lines
  const stepsList = recipe.preparationSteps
    ? recipe.preparationSteps.split('\n').filter((step) => step.trim().length > 0)
    : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="details-meta">
              <span className="category-badge">{recipe.category}</span>
              <span className="cooking-time-detail">⏱️ {recipe.cookingTime} Minutes</span>
            </div>
            <h2 className="modal-title">{recipe.name}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body details-body">
          {/* Ingredients Section */}
          <div className="details-section">
            <h3 className="section-title">
              <span className="section-icon">🥕</span> Ingredients
            </h3>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="bullet">✓</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-text">No ingredients provided.</p>
            )}
          </div>

          {/* Preparation Steps Section */}
          <div className="details-section">
            <h3 className="section-title">
              <span className="section-icon">🍳</span> Preparation Steps
            </h3>
            {stepsList.length > 0 ? (
              <ol className="steps-list">
                {stepsList.map((step, index) => (
                  <li key={index} className="step-item">
                    <span className="step-number">{index + 1}</span>
                    <span className="step-content">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="step-raw">{recipe.preparationSteps}</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              onEdit(recipe);
            }}
          >
            ✏️ Edit Recipe
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;
