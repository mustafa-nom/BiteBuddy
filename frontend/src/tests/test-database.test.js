import 'dotenv/config';
import {addUserLogin, addPassword, addIngredient, addDietaryRestriction, addRecipe, removeDietaryRestriction, removeIngredient, removeRecipe, getUserData, getRecipes, addMealPlan, getMealPlans, removeMealPlan} from '../database.js';
describe("Database helper tests", () => {
  const username = 'testuser';
  beforeAll(async () => {
    await addUserLogin(username);
  });
  test("Add password and then retrieve it", async () => {
    await addPassword(username, 'password123');
    const user = await getUserData(username);
    expect(user.password).toBe('password123');
  });
  test("Add ingredient and then retrieve it", async () => {
    await addIngredient(username, 'tomato');
    const user = await getUserData(username);
    expect(user.fridge_ingredients).toContain('tomato');
  });
  test("Add dietary restriction and then retrieve it", async () => {
    await addDietaryRestriction(username, 'vegan');
    const user = await getUserData(username);
    expect(user.dietary_restrictions).toContain('vegan');
  });
  test("Add recipe and then retrieve it", async () => {
    const recipe = {
      title: 'Tomato Soup',
      ingredients: ['tomato', 'water', 'salt'],
      instructions: 'Boil water, add tomatoes, and salt.',
      cookTime: 40,
      mealType: 'soup',
      imageUrl: 'http://example.com/tomato-soup.jpg'
    };
    await addRecipe(username, recipe);
    const recipes = await getRecipes(username);
    expect(recipes).toEqual(expect.arrayContaining([expect.objectContaining({title:recipe.title})]));
  });
  test("remove ingredient and then check if it is removed", async () => {
    await removeIngredient(username, 'tomato');
    const user = await getUserData(username);
    expect(user.fridge_ingredients).not.toContain('tomato');
  }
  );
  test("remove dietary restriction and then check if it is removed", async () => {
    await removeDietaryRestriction(username, 'vegan');
    const user = await getUserData(username);
    expect(user.dietary_restrictions).not.toContain('vegan');
  });
  test("remove recipe and then check if it is removed", async () => {
    const recipe = {
      title: 'Tomato Soup',
      ingredients: ['tomato', 'water', 'salt'],
      instructions: 'Boil water, add tomatoes, and salt.',
      cookTime: 40,
      mealType: 'soup',
      imageUrl: 'http://example.com/tomato-soup.jpg'
    };
    const recipe_key = recipe.title.replace(/\s+/g, '_').toLowerCase();
    await removeRecipe(username, recipe_key);
    const recipes = await getRecipes(username);
    expect(recipes.find(r => r.title === recipe.title)).toBeUndefined();
  });
  test("add meal plan and then retrieve it", async () => {
    const mealPlan = {
      "Monday": {
        breakfast: 'Oatmeal',
        lunch: 'Salad',
        dinner: 'Pasta'
      },
    };
    await addMealPlan(username, mealPlan);
    const mealPlans = await getMealPlans(username);
    expect(mealPlans.Monday).toEqual({
      breakfast: 'Oatmeal',
      lunch: 'Salad',
      dinner: 'Pasta' });
    });
  test("get user data", async () => {
    const user = await getUserData(username);
    
    expect(user.fridge_ingredients).toBeDefined();
    expect(user.dietary_restrictions).toBeDefined();
    expect(user.saved_recipes).toBeDefined(); 
  
  });

  test ("remove meal plan and then check if it is removed", async () => {
    const mealPlan = {
      "Monday": {
        breakfast: 'Oatmeal',
        lunch: 'Salad',
        dinner: 'Pasta'
      },
    };
    await removeMealPlan(username, "Monday");
    const mealPlans = await getMealPlans(username);
    expect(mealPlans.Monday).toBeUndefined();
  }
  );

});



