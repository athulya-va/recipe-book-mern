import React from 'react';

const Navbar = ({ onOpenAddModal, recipeCount }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <span className="brand-icon">🍳</span>
          <div>
            <h1 className="brand-title">RecipeBook</h1>
            <p className="brand-tagline">Save & discover homemade delights</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="badge-pill">
            <span className="badge-count">{recipeCount}</span> {recipeCount === 1 ? 'Recipe' : 'Recipes'}
          </div>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <span className="btn-icon">+</span> Add Recipe
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
