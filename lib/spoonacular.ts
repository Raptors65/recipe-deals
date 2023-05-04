import { FindByIngredientsRecipe, RecipeInformation } from '@/types/spoonacular';

export async function getRecipes(ingredients: string[], maxResults: number) {
  const ingredientsQuery = ingredients.join(',');
  const recipesData = new URLSearchParams({
    apiKey: process.env.SPOONACULAR_API_KEY!,
    ingredients: ingredientsQuery,
    number: maxResults.toString(),
    limitLicense: 'true',
    ranking: '1',
    ignorePantry: 'false',
  });

  const recipesResponse = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?${recipesData}`);
  const recipesJSON: FindByIngredientsRecipe[] = await recipesResponse.json();

  return recipesJSON;
}

export async function getRecipeInfo(recipeID: number) {
  const params = new URLSearchParams({
    apiKey: process.env.SPOONACULAR_API_KEY!,
    includeNutrition: 'false',
  });

  const recipesResponse = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?${params}`);
  const recipesJSON: RecipeInformation = await recipesResponse.json();

  return recipesJSON;
}

export async function getRecipeInfoBulk(recipeIDs: number[]) {
  const params = new URLSearchParams({
    apiKey: process.env.SPOONACULAR_API_KEY!,
    ids: recipeIDs.join(','),
    includeNutrition: 'false',
  });

  const recipesResponse = await fetch(`https://api.spoonacular.com/recipes/informationBulk?${params}`);

  if (recipesResponse.status === 402) throw new Error('No more daily quota.');

  const recipesJSON: RecipeInformation[] = await recipesResponse.json();

  return recipesJSON;
}
