# Kitchen Assistant

> A fun kitchen helper that combines AI chatbot, ingredient detection from images, and recipe search in one simple package.

This lightweight npm package provides three main kitchen-related functionalities:
1. **Cooking Assistant Chatbot** - Get answers to cooking-related questions using Cohere API
2. **Ingredient Detection** - Identify ingredients from images using Clarifai API
3. **Recipe Search** - Find recipes based on available ingredients using Spoonacular API

**Note:** This package was created for fun as a modular component extracted from the Skill Mate project. It is not actively maintained and is primarily intended as a demonstration of packaging reusable functionality.

## How to Consume This Package

This package can be integrated into various types of applications:

### In a Node.js Backend

```javascript
import { KitchenAssistant } from 'kitchen-assistant';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize with API keys from environment variables
const kitchenAssistant = new KitchenAssistant({
  cohereApiKey: process.env.COHERE_API_KEY,
  clarifaiApiKey: process.env.CLARIFAI_API_KEY,
  spoonacularApiKey: process.env.SPOONACULAR_API_KEY
});

// Use in Express.js routes
app.post('/api/cooking-assistant', async (req, res) => {
  const { question } = req.body;
  const answer = await kitchenAssistant.askCookingAssistant(question);
  res.json({ answer });
});
```

### In a React Frontend (via API Proxy)

```jsx
import { useState } from 'react';
import axios from 'axios';

function CookingAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/cooking-assistant', { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)} 
        placeholder="Ask a cooking question"
      />
      <button onClick={askQuestion} disabled={loading}>
        {loading ? 'Loading...' : 'Ask'}
      </button>
      {answer && <div>{answer}</div>}
    </div>
  );
}
```

### In a Mobile App (React Native)

Use a similar approach as with React, but make API calls to your backend server that uses this package.

## Installation

```bash
npm install kitchen-assistant
```

## Prerequisites

You'll need API keys from the following services:
- [Cohere](https://cohere.com/) - For the cooking assistant chatbot
- [Clarifai](https://www.clarifai.com/) - For ingredient detection from images
- [Spoonacular](https://spoonacular.com/food-api) - For recipe search

## Usage

### Initialize the Kitchen Assistant

```javascript
import { KitchenAssistant } from 'kitchen-assistant';

const kitchenAssistant = new KitchenAssistant({
  cohereApiKey: 'your-cohere-api-key',
  clarifaiApiKey: 'your-clarifai-api-key',
  spoonacularApiKey: 'your-spoonacular-api-key',
  // The following parameters are completely optional
  // clarifaiUserId: 'your-clarifai-user-id', // defaults to 'clarifai' if not provided
  // clarifaiAppId: 'your-clarifai-app-id'    // defaults to 'main' if not provided
});
```

### Example Usage

```javascript
import { KitchenAssistant } from 'kitchen-assistant';

// Initialize with your API keys
const kitchenAssistant = new KitchenAssistant({
  cohereApiKey: 'your_cohere_api_key',
  clarifaiApiKey: 'your_clarifai_api_key',
  spoonacularApiKey: 'your_spoonacular_api_key'
});

// Ask a cooking question
const answer = await kitchenAssistant.askCookingAssistant('How do I make pasta al dente?');
console.log(answer);

// Detect ingredients from an image (base64 encoded)
const result = await kitchenAssistant.detectIngredients(imageBase64);
console.log(result.ingredients);

// Find recipes based on ingredients
const recipes = await kitchenAssistant.getRecipes(['chicken', 'broccoli', 'rice']);
console.log(recipes);
```

### Ask the Cooking Assistant

```javascript
const question = "How do I make a fluffy omelet?";
try {
  const response = await kitchenAssistant.askCookingAssistant(question);
  console.log(response);
} catch (error) {
  console.error("Error:", error.message);
}
```

The assistant maintains chat history automatically for contextual conversations.

### Detect Ingredients from an Image

```javascript
// Base64-encoded image data (can be from a file upload or canvas)
const imageBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...";

try {
  const result = await kitchenAssistant.detectIngredients(imageBase64);
  
  // Get the detected ingredients
  const { ingredients, allConcepts } = result;
  
  console.log("Detected ingredients:", ingredients);
  console.log("All concepts with confidence scores:", allConcepts);
} catch (error) {
  console.error("Error:", error.message);
}
```

### Search for Recipes

```javascript
const ingredients = ["eggs", "cheese", "spinach"];

try {
  const recipes = await kitchenAssistant.getRecipes(ingredients);
  
  recipes.forEach(recipe => {
    console.log(`Recipe: ${recipe.title}`);
    console.log(`Ready in: ${recipe.readyInMinutes} minutes`);
    console.log(`Servings: ${recipe.servings}`);
    console.log(`Instructions: ${recipe.instructions}`);
    console.log(`Source URL: ${recipe.sourceUrl}`);
    console.log("-----------------------------------");
  });
} catch (error) {
  console.error("Error:", error.message);
}
```

### Clear Chat History

```javascript
kitchenAssistant.clearChatHistory();
```

## API Reference

### KitchenAssistant Class

#### Constructor

```javascript
new KitchenAssistant({
  cohereApiKey,
  clarifaiApiKey,
  spoonacularApiKey,
  clarifaiUserId = 'clarifai',
  clarifaiAppId = 'main'
})
```

#### Methods

- `askCookingAssistant(question)` - Ask a cooking-related question
- `detectIngredients(imageBase64)` - Detect ingredients from an image
- `getRecipes(ingredients)` - Get recipes based on ingredients
- `clearChatHistory()` - Clear the chat history

## Testing the Package

To test this package, you can create a simple Express server that provides API endpoints for each functionality:

1. Create a new project and install dependencies:
   ```bash
   mkdir test-kitchen-assistant
   cd test-kitchen-assistant
   npm init -y
   npm install express cors dotenv kitchen-assistant
   ```

2. Create a `.env` file with your API keys:
   ```
   COHERE_API_KEY=your_cohere_api_key
   CLARIFAI_API_KEY=your_clarifai_api_key
   SPOONACULAR_API_KEY=your_spoonacular_api_key
   ```

3. Create a server.js file with endpoints for each feature

4. Build a simple frontend with forms to test each functionality

A complete testing setup would include:
- A chatbot interface for the cooking assistant
- An image upload form for ingredient detection
- A form to enter ingredients for recipe search

This approach allows you to visually test all features without writing complex code.

## License

MIT
