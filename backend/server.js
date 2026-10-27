const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Built-in & Third-party Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome/health-check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Recipe Book API is running successfully',
    endpoints: {
      getAllRecipes: 'GET /api/recipes',
      getRecipeById: 'GET /api/recipes/:id',
      createRecipe: 'POST /api/recipes',
      updateRecipe: 'PUT /api/recipes/:id',
      deleteRecipe: 'DELETE /api/recipes/:id',
    },
  });
});

// Mount recipe routes
app.use('/api/recipes', recipeRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api/recipes`);
});
