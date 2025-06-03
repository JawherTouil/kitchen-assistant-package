# Kitchen Assistant

A lightweight npm package that provides three main kitchen-related functionalities:
1. **Cooking Assistant Chatbot** - Get answers to cooking-related questions using Cohere API
2. **Ingredient Detection** - Identify ingredients from images using Clarifai API
3. **Recipe Search** - Find recipes based on available ingredients using Spoonacular API

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

## License

MIT
