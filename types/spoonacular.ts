type Ingredient = {
  aisle: string
  amount: number
  id: number
  image: string
  meta: string[]
  name: string
  original: string
  originalName: string
  unit: string
  unitLong: string
  unitShort: string
};

export type FindByIngredientsRecipe = {
  id: number
  image: string
  imageType: string
  likes: number
  missedIngredientCount: number
  missedIngredients: Ingredient[]
  title: string
  unusedIngredients: Ingredient[]
  usedIngredientCount: number
  usedIngredients: Ingredient[]
};

type AnalyzedStepItem = {
  id: number
  name: string
  localizedName: string
  image: string
};

type AnalyzedStep = {
  number: number
  step: string
  ingredients: AnalyzedStepItem[]
  equipment: AnalyzedStepItem[]
};

type AnalyzedInstruction = {
  name: string
  steps: AnalyzedStep[]
};

type Measure = {
  amount: number
  unitLong: string
  unitShort: string
};

type Measures = {
  metric: Measure
  us: Measure
};

type ExtendedIngredient = {
  aisle: string
  amount: number
  consitency: string
  id: number
  image: string
  measures: Measures
  meta: string[]
  name: string
  original: string
  originalName: string
  unit: string
};

type WineProduct = {
  id: number
  title: string
  description: string
  price: string
  imageUrl: string
  averageRating: number
  ratingCount: number
  score: number
  link: string
};

type WinePairing = {
  pairedWines: string[]
  pairingText: string
  productMatches: WineProduct[]
};

export type RecipeInformation = {
  id: number
  title: string
  image: string
  imageType: string
  servings: number
  readyInMinutes: number
  license: string
  sourceName: string
  sourceUrl: string
  spoonacularSourceUrl: string
  aggregateLikes: number
  healthScore: number
  spoonacularScore: number
  pricePerServing: number
  analyzedInstructions: AnalyzedInstruction[]
  cheap: boolean
  creditsText: string
  cuisines: string[]
  dairyFree: boolean
  diets: string[]
  gaps: string
  glutenFree: boolean
  instructions: string
  ketogenic: boolean
  lowFodmap: boolean
  occasions: string[]
  sustainable: boolean
  vegan: boolean
  vegetarian: boolean
  veryHealthy: boolean
  veryPopular: boolean
  whole30: boolean
  weightWatcherSmartPoints: number
  dishTypes: string[]
  extendedIngredients: ExtendedIngredient[]
  summary: string
  winePairing: WinePairing
};
