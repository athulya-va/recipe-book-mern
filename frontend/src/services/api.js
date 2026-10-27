// Base URL: Prioritizes environment variable (for separate frontend & backend hosting)
// Falls back to relative path in production or localhost:5000 in development
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/recipes' : 'http://localhost:5000/api/recipes');

// Helper to handle API responses and throw readable error messages
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

// Fetch all recipes
export const fetchRecipes = async () => {
  const response = await fetch(API_URL);
  const result = await handleResponse(response);
  return result.data || [];
};

// Fetch a single recipe by its ID
export const fetchRecipeById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  const result = await handleResponse(response);
  return result.data;
};

// Create a new recipe
export const createRecipe = async (recipeData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeData),
  });
  return await handleResponse(response);
};

// Update an existing recipe
export const updateRecipe = async (id, recipeData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeData),
  });
  return await handleResponse(response);
};

// Delete a recipe
export const deleteRecipe = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await handleResponse(response);
};
