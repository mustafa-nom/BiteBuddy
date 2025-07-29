import parse from 'html-react-parser';
import '../App.css';
import { Button } from '../components/ui/Button';
import { useEffect, useState } from 'react';
import { addDietaryRestriction, addIngredient, removeIngredient, getUserData, removeDietaryRestriction } from '../database.js';

export default function Recipe(){

    const [textInput, setTextInput] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [showRecipes, setShowRecipes] = useState(false);
    const [loading, setLoading] = useState(false);


    // TODO sample data for the recipe card
    const generatedRecipe = [
        { 
            id: 1, 
            name: 'Chicken Alfredo', 
            cookTime: '30 mins', 
            instructions: "Step 1: Do this Step 2: Do that", 
            neededIngredients: "Pasta, Tomato Sauce, Chicken",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5EuVYEm22v_-iy2vFQ-4niAT7Dk4uzs_CYA&s",
            type: "Main Dish"
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!textInput) {
            alert('Please enter your mood or type of dish you want to eat.');
            return
        }
        setLoading(true); 
        setShowRecipes(false)

        try {
            const res = await fetch(`http://localhost:5000/recipes/suggest?mood=${encodeURIComponent(textInput)}`);
            const data = await res.json();

            if (data.recipes) {
                setRecipes(data.recipes);
                console.log('data.recipes:', recipes);
            } else {
                alert("No recipes found.");
                setRecipes([]);
            }
            setTextInput('');
        } catch (e) {
            console.log('failed to fetch recipes', e)
            alert('Failed getting recipes. Try again.')
        }
        finally {
            setLoading(false);
            setShowRecipes(true);
        }
    };


    useEffect(() => {
        console.log('recipes updated:', recipes);
    }, [recipes]);

    // This will save the recipe to the database
    const SaveRecipe = () => {

    };

    // This will shuffle the recipe for a new one KEEP THIS COMMENTED UNTIL WE WORK ON IT
    // const ShuffleRecipe = () => {
    //     try {
    //         const res = await fetch(`http://localhost:5000/recipes/suggest?mood=${encodeURIComponent(textInput)}`);
    //         const data = await res.json();

    //         if (data.recipes) {
    //             setRecipes(data.recipes);
    //         } else {
    //             alert("No recipes found.");
    //             setRecipes([]);
    //         }
    //         setTextInput('');
    //     } catch (e) {
    //         console.log('failed to fetch recipes', e)
    //         alert('Failed getting recipes. Try again.')
    //     }
    // }

    return (
  <div className="w-full max-w-[1500px] p-8 rounded-2xl bg-[#dde3e5c2] text-center shadow-lg my-[50px] mx-auto">
    <div>
      <h1 className="text-4xl font-bold mb-2">Recipes</h1>
      <p className="text-green-700 text-xl">Generate a recipe based on your mood</p>
    </div>

    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex items-center justify-center gap-2 flex-wrap">
        <input
          type="text"
          placeholder="🥞 What's your mood today? 🍕"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-green-400 text-center"
        />
        <Button
        type="submit"
        className="text-2xl px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 transition flex items-center justify-center min-w-[50px]"
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
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
            </svg>
        ) : (
            '🥄'
        )}
        </Button>

      </form>
    </div>

    <div className="w-1/2 mx-auto mt-8 text-center">
      {recipes.length === 0 && !showRecipes && (
        <p className="text-gray-600">No recipes generated yet. Put in your mood to get some recipes!</p>
      )}

      {showRecipes && recipes.length > 0 && (
        <ul>
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border-4 border-black/50 p-5 rounded-xl m-5">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-[300px] h-[200px] object-cover rounded-xl border-4 border-green-900 mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold">{recipe.title}</h3>
              <h4 className="opacity-70">Food Type: {recipe.type}</h4>
              <h4 className="opacity-70">Time: ~{recipe.cookTime}</h4>
              <h4 className="opacity-70 mb-2">Ingredients: {recipe.neededIngredients}</h4>
              <p className="mb-4">{parse(recipe.instructions)}</p>
              <div>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition hover:-translate-y-1"
                  onClick={SaveRecipe}
                >
                  Save Recipe
                </button>
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  </div>
);

}