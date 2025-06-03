import axios from 'axios';

/**
 * KitchenAssistant class that provides cooking-related functionalities:
 * - Chatbot cooking assistant (using Cohere API)
 * - Ingredient detection from images (using Clarifai API)
 * - Recipe search based on ingredients (using Spoonacular API)
 * 
 * @author Kitchen Assistant Team
 * @license MIT
 * @version 1.0.0
 */
export class KitchenAssistant {
  /**
   * Initialize the KitchenAssistant with required API keys
   * @param {Object} config - Configuration object
   * @param {string} config.cohereApiKey - API key for Cohere (chatbot)
   * @param {string} config.clarifaiApiKey - API key for Clarifai (image recognition)
   * @param {string} config.spoonacularApiKey - API key for Spoonacular (recipe search)
   * @param {string} [config.clarifaiUserId='clarifai'] - Clarifai user ID
   * @param {string} [config.clarifaiAppId='main'] - Clarifai app ID
   */
  constructor({ 
    cohereApiKey, 
    clarifaiApiKey, 
    spoonacularApiKey,
    clarifaiUserId = null,
    clarifaiAppId = null
  }) {
    if (!cohereApiKey) {
      throw new Error('Cohere API key is required for the chatbot assistant');
    }
    if (!clarifaiApiKey) {
      throw new Error('Clarifai API key is required for ingredient detection');
    }
    if (!spoonacularApiKey) {
      throw new Error('Spoonacular API key is required for recipe search');
    }

    this.cohereApiKey = cohereApiKey;
    this.clarifaiApiKey = clarifaiApiKey;
    this.spoonacularApiKey = spoonacularApiKey;
    this.clarifaiUserId = clarifaiUserId;
    this.clarifaiAppId = clarifaiAppId;
    
    // Initialize chat history for the cooking assistant
    this.chatHistory = [];
  }

  /**
   * Ask a question to the cooking assistant
   * @param {string} question - The cooking-related question
   * @returns {Promise<string>} - The assistant's response
   */
  async askCookingAssistant(question) {
    try {
      const response = await axios.post(
        'https://api.cohere.ai/v1/chat',
        {
          message: question,
          model: "command-r-plus",
          chat_history: this.chatHistory,
          preamble: "You are a knowledgeable cooking assistant. You help users with cooking-related questions, recipe modifications, ingredient substitutions, and cooking techniques. Provide clear, concise, and practical advice.",
          temperature: 0.7,
          connectors: [{ id: "web-search" }]
        },
        {
          headers: {
            Authorization: `Bearer ${this.cohereApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.text;
      
      // Update chat history
      this.chatHistory.push({ role: 'USER', message: question });
      this.chatHistory.push({ role: 'CHATBOT', message: reply });
      
      return reply;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Cohere API request failed: ${errorMessage}`);
    }
  }

  /**
   * Detect ingredients from an image
   * @param {string} imageBase64 - Base64-encoded image data
   * @returns {Promise<Object>} - Detected ingredients and all concepts
   */
  async detectIngredients(imageBase64) {
    try {
      if (!imageBase64) {
        throw new Error("No image provided");
      }

      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      const modelId = "food-item-recognition";
      
      // Use default Clarifai user ID and app ID if not provided
      const userId = this.clarifaiUserId || 'clarifai';
      const appId = this.clarifaiAppId || 'main';
      
      const response = await axios.post(
        `https://api.clarifai.com/v2/users/${userId}/apps/${appId}/models/${modelId}/outputs`,
        {
          user_app_id: {
            user_id: userId,
            app_id: appId
          },
          inputs: [
            {
              data: {
                image: { 
                  base64: base64Data 
                }
              }
            }
          ]
        },
        {
          headers: {
            Authorization: `Key ${this.clarifaiApiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      const concepts = response.data.outputs[0].data.concepts;
      
      // Filter concepts with confidence > 0.75 and map to ingredient names
      const ingredients = concepts
        .filter(concept => concept.value > 0.75)
        .map(concept => concept.name);

      return { 
        ingredients,
        allConcepts: concepts 
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to recognize ingredients: ${errorMessage}`);
    }
  }

  /**
   * Get recipes based on ingredients
   * @param {string[]} ingredients - List of ingredients
   * @returns {Promise<Array>} - List of recipes
   */
  async getRecipes(ingredients) {
    if (!ingredients || ingredients.length === 0) {
      throw new Error("Please provide ingredients");
    }

    try {
      const response = await axios.get(
        "https://api.spoonacular.com/recipes/findByIngredients",
        {
          params: {
            ingredients: ingredients.join(","),
            apiKey: this.spoonacularApiKey,
            number: 5, // Limit results
            ranking: 2, // Maximize used ingredients
            ignorePantry: true // Ignore common ingredients
          },
        }
      );

      // Get detailed recipe information for each recipe
      const recipeDetails = await Promise.all(
        response.data.map(async (recipe) => {
          const detailResponse = await axios.get(
            `https://api.spoonacular.com/recipes/${recipe.id}/information`,
            {
              params: {
                apiKey: this.spoonacularApiKey,
              },
            }
          );
          return {
            ...recipe,
            instructions: detailResponse.data.instructions,
            sourceUrl: detailResponse.data.sourceUrl,
            readyInMinutes: detailResponse.data.readyInMinutes,
            servings: detailResponse.data.servings
          };
        })
      );

      return recipeDetails;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to fetch recipes: ${errorMessage}`);
    }
  }

  /**
   * Clear the chat history
   */
  clearChatHistory() {
    this.chatHistory = [];
  }
}
