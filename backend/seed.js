const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./models/Recipe');

dotenv.config();

const sampleRecipes = [
  {
    name: 'Fluffy Buttermilk Pancakes',
    category: 'Breakfast',
    ingredients: [
      '2 cups all-purpose flour',
      '2 tbsp granulated sugar',
      '2 tsp baking powder',
      '1/2 tsp baking soda',
      '1/2 tsp salt',
      '2 cups buttermilk',
      '2 large eggs',
      '1/4 cup melted butter',
      'Maple syrup for serving',
    ],
    preparationSteps:
      '1. In a large bowl, whisk together flour, sugar, baking powder, baking soda, and salt.\n2. In a separate bowl, whisk buttermilk, eggs, and melted butter.\n3. Pour wet ingredients into dry ingredients and stir gently until just combined (small lumps are fine).\n4. Heat a lightly oiled griddle or non-stick pan over medium heat.\n5. Pour 1/4 cup batter for each pancake. Cook until bubbles form on top, flip and cook until golden brown.\n6. Serve warm with butter and maple syrup.',
    cookingTime: 20,
  },
  {
    name: 'Mediterranean Grilled Chicken Salad',
    category: 'Lunch',
    ingredients: [
      '2 boneless chicken breasts',
      '4 cups chopped romaine lettuce',
      '1 cup cherry tomatoes, halved',
      '1/2 cucumber, sliced',
      '1/2 cup kalamata olives',
      '1/2 cup crumbled feta cheese',
      '2 tbsp extra virgin olive oil',
      '1 tbsp lemon juice',
      '1 tsp dried oregano',
      'Salt and black pepper',
    ],
    preparationSteps:
      '1. Season chicken breasts with olive oil, lemon juice, dried oregano, salt, and black pepper.\n2. Heat a grill pan over medium-high heat and grill chicken for 6-7 minutes per side until cooked through (internal temp 165°F).\n3. Rest chicken for 5 minutes, then slice into strips.\n4. In a large serving bowl, assemble romaine lettuce, cucumber, cherry tomatoes, and olives.\n5. Top with sliced chicken and crumbled feta cheese. Drizzle with extra olive oil and lemon juice.',
    cookingTime: 25,
  },
  {
    name: 'Classic Creamy Garlic Pasta',
    category: 'Dinner',
    ingredients: [
      '250g fettuccine or penne pasta',
      '3 cloves garlic, finely minced',
      '2 tbsp unsalted butter',
      '1 cup heavy cream',
      '1/2 cup freshly grated parmesan cheese',
      '1/4 tsp freshly cracked black pepper',
      'Fresh parsley, chopped for garnish',
      'Salt for pasta water',
    ],
    preparationSteps:
      '1. Bring a large pot of salted water to a rolling boil. Cook pasta according to package instructions until al dente, reserving 1/2 cup pasta water.\n2. Melt butter in a wide skillet over medium heat. Add minced garlic and sauté for 1 minute until fragrant (do not burn).\n3. Pour in heavy cream and bring to a gentle simmer for 3 minutes.\n4. Stir in grated parmesan cheese until smooth and creamy.\n5. Toss in drained pasta, adding splashes of reserved pasta water if needed to coat evenly.\n6. Garnish with black pepper and chopped fresh parsley before serving.',
    cookingTime: 18,
  },
  {
    name: 'Crispy Homemade Guacamole & Chips',
    category: 'Snack',
    ingredients: [
      '3 ripe Hass avocados',
      '1/2 red onion, finely diced',
      '1 Roma tomato, seeded and diced',
      '1 fresh jalapeño, seeded and minced',
      '2 tbsp fresh lime juice',
      '1/4 cup chopped fresh cilantro',
      '1/2 tsp sea salt',
      'Tortilla chips for serving',
    ],
    preparationSteps:
      '1. Cut avocados in half, remove the pit, and scoop the flesh into a medium bowl.\n2. Mash the avocados with a fork until desired consistency (chunky or smooth).\n3. Fold in diced red onion, tomato, jalapeño, and fresh cilantro.\n4. Squeeze fresh lime juice over the mixture and sprinkle with sea salt.\n5. Mix gently until well incorporated. Taste and adjust seasoning with extra lime or salt.\n6. Serve immediately with warm crispy tortilla chips.',
    cookingTime: 10,
  },
  {
    name: 'Warm Molten Chocolate Lava Cake',
    category: 'Dessert',
    ingredients: [
      '100g dark chocolate (70% cocoa)',
      '1/2 cup unsalted butter',
      '2 whole eggs + 2 egg yolks',
      '1/3 cup granulated sugar',
      '2 tbsp all-purpose flour',
      'Pinch of sea salt',
      'Powdered sugar for dusting',
      'Vanilla ice cream for serving',
    ],
    preparationSteps:
      '1. Preheat oven to 425°F (220°C). Grease two 6-oz ramekins with butter and dust with cocoa powder.\n2. Melt dark chocolate and butter together in a heatproof bowl set over simmering water (or microwave in 20-second bursts).\n3. In a separate bowl, whisk eggs, egg yolks, and sugar together until pale and slightly thick.\n4. Fold melted chocolate mixture into the eggs, then gently fold in flour and salt until smooth.\n5. Divide batter evenly into the prepared ramekins.\n6. Bake for 12-14 minutes until the edges are firm but the center is still soft.\n7. Let cool for 1 minute, invert onto dessert plates, dust with powdered sugar, and serve with vanilla ice cream.',
    cookingTime: 15,
  },
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected! Seeding initial recipes...');

    await Recipe.deleteMany({});
    console.log('Cleared existing recipes.');

    const created = await Recipe.insertMany(sampleRecipes);
    console.log(`Successfully seeded ${created.length} recipes!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
