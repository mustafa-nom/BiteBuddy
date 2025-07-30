import React, { useState } from 'react';
import parse from 'html-react-parser';
import { addRecipe } from '../database.js';
import '../App.css';

export default function Mealplan({ username }) {
  const [showSavePlan, setShowSavePlan] = useState(false);
  const [textInput, setTextInput]       = useState('');
  const [recipes, setRecipes]           = useState({});
  const [loading, setLoading]           = useState(false);

  const SavePlan = () => {
    // TODO: implement saving the entire plan
  };

  const SaveRecipe = async (recipe) => {
    console.log("=== SaveRecipe Debug ===");
    console.log("Raw recipe object:", recipe);
    console.log("recipe type:", typeof recipe);
    console.log("recipe.id:", recipe?.id, "type:", typeof recipe?.id);
    console.log("recipe.title:", recipe?.title, "type:", typeof recipe?.title);
    console.log("recipe.title === 'NOT FOUND':", recipe?.title === 'NOT FOUND');
    console.log("recipe.id === 0:", recipe?.id === 0);
    
    // Your existing safeguards
    if (
      !recipe ||
      recipe.id === 0 ||  // safeguard for "NOT FOUND" placeholder
      recipe.title === 'NOT FOUND'
    ) {
      console.warn("Attempted to save an invalid or placeholder recipe:", recipe);
      return;
    }
    
    console.log("Recipe passed validation, proceeding to format...");
    
    try {
      const formattedRecipe = {
        id: recipe.id,
        title: recipe.title,
        type: recipe.type || 'N/A',
        cookTime: parseInt(recipe.cookTime) || 0,
        neededIngredients: recipe.neededIngredients.split(',').map(i => i.trim()), // from string to array
        instructions: recipe.instructions,
        image: recipe.image
      };
      
      console.log("Formatted recipe:", formattedRecipe);
      console.log("About to call addRecipe with username:", username);
      
      await addRecipe(username, formattedRecipe);
      alert(`Saved recipe: ${recipe.title}`);
    } catch (error) {
      console.error("Error saving recipe:", error);
      console.error("Full error stack:", error.stack);
      alert("Failed to save recipe. Please try again.");
    }
  };
    // TODO: implement saving a single recipe
  //   if (
  //     !recipe ||
  //     recipe.id === 0 ||  // safeguard for "NOT FOUND" placeholder
  //     recipe.title === 'NOT FOUND'
  //   ) {
  //     console.warn("Attempted to save an invalid or placeholder recipe:", recipe);
  //     return;
  //   }
  //   try {
  //   const formattedRecipe = {
  //     id: recipe.id,
  //     title: recipe.title,
  //     type: recipe.type || 'N/A',
  //     cookTime: parseInt(recipe.cookTime) || 0,
  //     neededIngredients: recipe.neededIngredients.split(',').map(i => i.trim()), // from string to array
  //     instructions: recipe.instructions,
  //     image: recipe.image
  //   };
  //   await addRecipe(username, formattedRecipe);
  //   alert(`Saved recipe: ${recipe.title}`);
  //   } catch (error) {
  //     console.error("Error saving recipe:", error);
  //     alert("Failed to save recipe. Please try again.");
  //   }
  // };

  const scrollTo = (day) => {
    const section = document.getElementById(day);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!textInput) {
      alert('Please enter your goals for the week.');
      return;
    }

    setShowSavePlan(true);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/meal_plan/suggest?goal=${encodeURIComponent(
          textInput
        )}`
      );
      const data = await res.json();

      if (data.recipes) {
        setRecipes(data.recipes);
        console.log('data.recipes:', data.recipes);
      } else {
        alert('No recipes found.');
        setRecipes({});
      }
      setTextInput('');
    } catch (e) {
      console.error('failed to fetch recipes', e);
      alert('Failed getting recipes. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1500px] p-8 rounded-2xl bg-[#dde3e5c2] text-center shadow-lg my-[50px] mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-2">Meal Plan</h1>
        <p className="text-green-700 text-xl">
          Generate a 7-day meal plan based on your goals
        </p>
      </div>

      <div className="mt-6">
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <input
            type="text"
            placeholder="What are your diet goals for the week?"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="border border-gray-400 rounded-full px-5 py-3 w-80 text-base focus:outline-none focus:ring-2 focus:ring-green-400 text-center transition-all"
          />
          <button
            type="submit"
            className="text-2xl px-5 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition flex items-center justify-center w-[52px] h-[52px]"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              '🥄'
            )}
          </button>
        </form>
      </div>

      {Object.keys(recipes).length === 0 && !showSavePlan && (
            <div className="w-1/2 mx-auto mt-8 text-center">
                <p className="text-gray-600">
                You haven't chosen this week's goal. Input a goal for a customized meal plan!
                </p>
            </div>
        )}


      {Object.keys(recipes).length > 0 && showSavePlan && (
        <div className="center-btn">
          <button className="view-btn" onClick={SavePlan}>
            Save Plan
          </button>

          <h2 id="empty-text">Go To</h2>
          <div className="button-list">
            {[
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ].map((day) => (
              <button
                key={day}
                className="view-btn"
                onClick={() => scrollTo(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        {showSavePlan &&
          Object.keys(recipes).length > 0 &&
          Object.entries(recipes).map(([day, meals]) => (
            <React.Fragment key={day}>
              <div className="day-header" id={day}>
                <h2>{day}</h2>
              </div>

              <div className="day-container">
                {Object.entries(meals).map(([mealType, recipe]) => (
                  <div className="mealplan-recipes" key={recipe.id}>
                    <div className="recipe-card">
                      <h3 className="text-2xl font-bold">{mealType}</h3>
                      <img src={recipe.image} alt={recipe.title} />
                      <h3 className="text-2xl font-semibold">
                        {recipe.title}
                      </h3>
                      <h4>Food Type: {recipe.type}</h4>
                      <h4>Time: ~{recipe.cookTime}</h4>
                      <h4>Ingredients: {recipe.neededIngredients}</h4>
                      <p>{parse(recipe.instructions)}</p>
                      <div className="button-list">
                        <button className="view-btn" onClick={() => SaveRecipe(recipe)}>
                          Save Recipe
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="center-btn">
                <button
                  className="view-btn"
                  onClick={() => scrollTo('page-header')}
                >
                  Go To Top
                </button>
              </div>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}
