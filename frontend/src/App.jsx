import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import RecipeCard from './components/RecipeCard';
import RecipeFormModal from './components/RecipeFormModal';
import RecipeDetailsModal from './components/RecipeDetailsModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import {
  fetchRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from './services/api';
import './App.css';

function App() {
  // Main recipes state
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  // Filter and search state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // Async action flags
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to show transient notification banners
  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Fetch all recipes from the backend
  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchRecipes();
      setRecipes(data);
    } catch (err) {
      console.error('Failed to load recipes:', err);
      notify('Failed to connect to backend server. Make sure MongoDB & backend are running.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  // Open Add Recipe Modal
  const handleOpenAddModal = () => {
    setRecipeToEdit(null);
    setIsFormOpen(true);
  };

  // Open Edit Recipe Modal
  const handleOpenEditModal = (recipe) => {
    setRecipeToEdit(recipe);
    setIsFormOpen(true);
  };

  // Open View Details Modal
  const handleOpenViewModal = (recipe) => {
    setViewingRecipe(recipe);
  };

  // Open Confirm Delete Modal
  const handleOpenDeleteModal = (recipe) => {
    setRecipeToDelete(recipe);
  };

  // Handle Form Submission (Add or Update)
  const handleFormSubmit = async (formData, recipeId) => {
    try {
      setIsSubmitting(true);
      if (recipeId) {
        // Update existing recipe
        const res = await updateRecipe(recipeId, formData);
        setRecipes((prev) =>
          prev.map((r) => (r._id === recipeId ? res.data : r))
        );
        notify(res.message || 'Recipe updated successfully!', 'success');
      } else {
        // Create new recipe
        const res = await createRecipe(formData);
        // Prepend new recipe to top of list
        setRecipes((prev) => [res.data, ...prev]);
        notify(res.message || 'Recipe added successfully!', 'success');
      }
      setIsFormOpen(false);
      setRecipeToEdit(null);
    } catch (err) {
      console.error('Save error:', err);
      notify(err.message || 'Error saving recipe', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteRecipe(recipeToDelete._id);
      // Remove from state immediately without page reload
      setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id));
      notify(res.message || 'Recipe deleted successfully!', 'success');
      setRecipeToDelete(null);
      // If the deleted recipe was being viewed in details modal, close it
      if (viewingRecipe && viewingRecipe._id === recipeToDelete._id) {
        setViewingRecipe(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      notify(err.message || 'Error deleting recipe', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter recipes according to selected category & search query
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      recipe.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      recipe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients?.some((ing) =>
        ing.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        recipeCount={recipes.length}
      />

      {/* Floating / Top Alert Banner */}
      {notification && (
        <div className={`notification-banner ${notification.type}`}>
          <span className="notif-icon">
            {notification.type === 'success' ? '✅' : '⚠️'}
          </span>
          <span className="notif-text">{notification.message}</span>
          <button
            className="notif-close"
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="main-content">
        {/* Hero & Filter Section */}
        <div className="hero-section">
          <div className="hero-text">
            <h2>Explore Delicious Recipes</h2>
            <p>
              Your personal recipe treasury. Easily manage cooking times, ingredients, and instructions.
            </p>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Recipe Grid / Content Area */}
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading your recipe collection...</p>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onView={handleOpenViewModal}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h3>No recipes found</h3>
            <p>
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search query or filter category.'
                : 'Your recipe book is currently empty. Start by adding your first favorite recipe!'}
            </p>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              + Add Recipe
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <RecipeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setRecipeToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        recipeToEdit={recipeToEdit}
        isSubmitting={isSubmitting}
      />

      <RecipeDetailsModal
        isOpen={Boolean(viewingRecipe)}
        recipe={viewingRecipe}
        onClose={() => setViewingRecipe(null)}
        onEdit={handleOpenEditModal}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(recipeToDelete)}
        recipe={recipeToDelete}
        onClose={() => setRecipeToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="footer">
        <p>Recipe Book Web Application • MERN Stack Evaluation Project</p>
      </footer>
    </div>
  );
}

export default App;
