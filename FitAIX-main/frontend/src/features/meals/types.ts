export interface Meal {
  id: string;
  title: string;
  mealType: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  prepTimeMins: number;
  budgetTier: '$' | '$$' | '$$$';
}
