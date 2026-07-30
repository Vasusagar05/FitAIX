import express from 'express';
import { authenticateToken } from './auth';
import { getGroqChatCompletion } from '../services/groqService';

export const mealsRouter = express.Router();

const inMemoryMeals: Record<number, any[]> = {};

mealsRouter.get('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { date, mealType } = req.query;

  if (userId === 901 || userId === 999) {
    const mockMeals = [
      {
        id: 'meal-1', userId: 901, mealType: 'breakfast', title: 'Scrambled Eggs & Oats',
        calories: 520, proteinGrams: 38, carbsGrams: 54, fatGrams: 14,
        prepTimeMins: 10, budgetTier: '$', ingredients: ['3 whole eggs', '100g rolled oats', 'mixed berries'],
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'meal-2', userId: 901, mealType: 'lunch', title: 'Grilled Chicken Bowl',
        calories: 650, proteinGrams: 55, carbsGrams: 60, fatGrams: 18,
        prepTimeMins: 20, budgetTier: '$$', ingredients: ['200g chicken breast', '150g brown rice', 'broccoli & spinach'],
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'meal-3', userId: 901, mealType: 'dinner', title: 'Wild Salmon & Quinoa',
        calories: 720, proteinGrams: 58, carbsGrams: 52, fatGrams: 22,
        prepTimeMins: 25, budgetTier: '$$$', ingredients: ['200g wild salmon', '100g quinoa', 'asparagus & avocado'],
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'meal-4', userId: 901, mealType: 'snack', title: 'Protein Shake & Almonds',
        calories: 310, proteinGrams: 30, carbsGrams: 18, fatGrams: 12,
        prepTimeMins: 2, budgetTier: '$', ingredients: ['1 scoop whey isolate', '30g almonds', '250ml almond milk'],
        date: new Date().toISOString().split('T')[0]
      }
    ];
    let filtered = mockMeals;
    if (mealType) filtered = filtered.filter(m => m.mealType === mealType);
    return res.json({ success: true, data: filtered });
  }

  let meals = inMemoryMeals[userId] || [];
  if (mealType) meals = meals.filter((m: any) => m.mealType === mealType);
  if (date) meals = meals.filter((m: any) => m.date === date);
  res.json({ success: true, data: meals });
});

// Log a meal (Dynamic AI macros estimation if missing/zero)
mealsRouter.post('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { mealType, title, prepTimeMins, budgetTier, ingredients } = req.body;
  let { calories, proteinGrams, carbsGrams, fatGrams } = req.body;

  if (!mealType || !title) {
    return res.status(400).json({ success: false, error: 'mealType and title are required' });
  }

  const numericCalories = Number(calories);
  const numericProtein = Number(proteinGrams);
  const numericCarbs = Number(carbsGrams);
  const numericFats = Number(fatGrams);

  // If macros are missing, estimate them using Groq LLM
  if (!numericCalories && !numericProtein && !numericCarbs && !numericFats) {
    try {
      console.log(`Estimating macros via Groq for meal: ${title}...`);
      const systemPrompt = "You are a professional nutrition chatbot. Given a meal name and optional ingredients, estimate the calories and macros (protein, carbs, fat in grams). Output ONLY in valid JSON format: { \"calories\": 450, \"protein\": 30, \"carbs\": 45, \"fat\": 12 } without markdown formatting.";
      const userPrompt = `Meal: ${title}. Ingredients: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients || 'None provided'}`;
      const response = await getGroqChatCompletion(systemPrompt, userPrompt);
      if (response) {
        const parsed = JSON.parse(response);
        calories = Number(parsed.calories) || 0;
        proteinGrams = Number(parsed.protein) || 0;
        carbsGrams = Number(parsed.carbs) || 0;
        fatGrams = Number(parsed.fat) || 0;
      }
    } catch (err) {
      console.error('Groq AI macro estimation failed, falling back to general estimate:', err);
      // Fallback
      calories = 350;
      proteinGrams = 20;
      carbsGrams = 40;
      fatGrams = 10;
    }
  } else {
    calories = numericCalories || 0;
    proteinGrams = numericProtein || 0;
    carbsGrams = numericCarbs || 0;
    fatGrams = numericFats || 0;
  }

  const newMeal = {
    id: `meal-${Date.now()}`,
    userId,
    mealType,
    title,
    calories: Number(calories),
    proteinGrams: Number(proteinGrams),
    carbsGrams: Number(carbsGrams),
    fatGrams: Number(fatGrams),
    prepTimeMins: Number(prepTimeMins) || 5,
    budgetTier: budgetTier || '$',
    ingredients: ingredients || [],
    date: new Date().toISOString().split('T')[0]
  };

  if (!inMemoryMeals[userId]) inMemoryMeals[userId] = [];
  inMemoryMeals[userId].push(newMeal);

  res.json({ success: true, data: newMeal });
});

mealsRouter.delete('/:mealId', authenticateToken, async (req: any, res) => {
  const userId = req.user.id;
  const { mealId } = req.params;

  if (inMemoryMeals[userId]) {
    inMemoryMeals[userId] = inMemoryMeals[userId].filter((m: any) => m.id !== mealId);
  }
  res.json({ success: true });
});

mealsRouter.post('/ai-generate', authenticateToken, async (req: any, res) => {
  const { mealType, goal, budget } = req.body;

  const aiMeals: Record<string, Record<string, any>> = {
    breakfast: {
      'Muscle Gain': {
        title: 'High-Protein Power Breakfast', calories: 680, proteinGrams: 52, carbsGrams: 68, fatGrams: 18,
        prepTimeMins: 12, budgetTier: '$$', ingredients: ['4 whole eggs', '200g Greek yogurt', '80g oats', 'banana & blueberries', 'honey']
      },
      'Weight Loss': {
        title: 'Low-Cal Morning Fuel', calories: 380, proteinGrams: 35, carbsGrams: 38, fatGrams: 8,
        prepTimeMins: 8, budgetTier: '$', ingredients: ['3 egg whites', '100g low-fat yogurt', '60g oats', 'strawberries']
      },
      default: {
        title: 'Balanced Morning Bowl', calories: 520, proteinGrams: 40, carbsGrams: 52, fatGrams: 14,
        prepTimeMins: 10, budgetTier: '$', ingredients: ['3 eggs', '100g oats', 'mixed berries', 'almond milk']
      }
    },
    lunch: {
      'Muscle Gain': {
        title: 'Anabolic Chicken & Rice Bowl', calories: 780, proteinGrams: 65, carbsGrams: 78, fatGrams: 16,
        prepTimeMins: 25, budgetTier: '$$', ingredients: ['250g chicken breast', '180g brown rice', 'mixed vegetables', 'olive oil', 'seasoning']
      },
      'Weight Loss': {
        title: 'Lean Turkey Salad Wrap', calories: 420, proteinGrams: 42, carbsGrams: 32, fatGrams: 10,
        prepTimeMins: 15, budgetTier: '$', ingredients: ['180g turkey breast', 'whole grain wrap', 'lettuce', 'tomato', 'mustard']
      },
      default: {
        title: 'Grilled Salmon Power Bowl', calories: 650, proteinGrams: 52, carbsGrams: 55, fatGrams: 20,
        prepTimeMins: 20, budgetTier: '$$$', ingredients: ['200g salmon', '150g quinoa', 'spinach', 'avocado', 'lemon']
      }
    },
    dinner: {
      'Muscle Gain': {
        title: 'Steak & Sweet Potato Gainz', calories: 850, proteinGrams: 70, carbsGrams: 65, fatGrams: 28,
        prepTimeMins: 35, budgetTier: '$$$', ingredients: ['300g lean steak', '200g sweet potato', 'broccoli', 'butter', 'garlic']
      },
      'Weight Loss': {
        title: 'Light Shrimp Stir-Fry', calories: 380, proteinGrams: 38, carbsGrams: 28, fatGrams: 10,
        prepTimeMins: 20, budgetTier: '$$', ingredients: ['200g shrimp', 'zucchini noodles', 'bell peppers', 'soy sauce', 'ginger']
      },
      default: {
        title: 'Wild Salmon & Quinoa', calories: 720, proteinGrams: 58, carbsGrams: 52, fatGrams: 22,
        prepTimeMins: 25, budgetTier: '$$$', ingredients: ['200g wild salmon', '100g quinoa', 'asparagus', 'avocado', 'lemon']
      }
    },
    snack: {
      default: {
        title: 'Protein Shake & Almonds', calories: 310, proteinGrams: 30, carbsGrams: 18, fatGrams: 12,
        prepTimeMins: 2, budgetTier: '$', ingredients: ['1 scoop whey protein', '30g almonds', '250ml almond milk']
      }
    }
  };

  const mealGroup = aiMeals[mealType] || aiMeals['lunch'];
  let mealData = mealGroup[goal] || mealGroup['default'];

  try {
    const systemPrompt = "You are a professional performance nutritionist. Generate a dynamic meal recommendation. Output ONLY in valid JSON format: { \"title\": \"...\", \"calories\": 500, \"proteinGrams\": 40, \"carbsGrams\": 50, \"fatGrams\": 15, \"prepTimeMins\": 15, \"ingredients\": [\"item 1\", \"item 2\"] } without markdown formatting.";
    const userPrompt = `Generate a ${mealType} for a goal of ${goal} with a budget level of ${budget}.`;
    const response = await getGroqChatCompletion(systemPrompt, userPrompt);
    if (response) {
      const parsed = JSON.parse(response);
      if (parsed.title) {
        mealData = {
          title: parsed.title,
          calories: Number(parsed.calories) || mealData.calories,
          proteinGrams: Number(parsed.proteinGrams) || mealData.proteinGrams,
          carbsGrams: Number(parsed.carbsGrams) || mealData.carbsGrams,
          fatGrams: Number(parsed.fatGrams) || mealData.fatGrams,
          prepTimeMins: Number(parsed.prepTimeMins) || mealData.prepTimeMins,
          ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : mealData.ingredients
        };
      }
    }
  } catch (e) {
    console.warn("Groq meal generation failed, using local presets.");
  }

  res.json({
    success: true,
    data: {
      id: `ai-meal-${Date.now()}`,
      mealType,
      budgetTier: budget || mealData.budgetTier,
      ...mealData
    }
  });
});
