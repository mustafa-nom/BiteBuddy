import parse from 'html-react-parser';
import '../App.css';
import { Button } from '../components/ui/Button';
import { useEffect, useState } from 'react';
import { addRecipe } from '../database.js';

export default function Recipe({ username }){

    const [textInput, setTextInput] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [showRecipes, setShowRecipes] = useState(false);
    const [loading, setLoading] = useState(false);


    // Mock data for recipe cards
    // const mockRecipes = [
    //     {
    //         id: 1,
    //         title: "Creamy Garlic Parmesan Pasta",
    //         type: "Main Dish",
    //         cookTime: "25 mins",
    //         neededIngredients: "Pasta, Garlic, Parmesan cheese, Heavy cream, Butter, Parsley",
    //         instructions: `
    //             <ol>
    //                 <li>Cook pasta according to package directions.</li>
    //                 <li>In a pan, melt butter and sauté minced garlic until fragrant.</li>
    //                 <li>Add heavy cream and bring to a simmer.</li>
    //                 <li>Stir in grated Parmesan until melted and sauce thickens.</li>
    //                 <li>Toss cooked pasta in the sauce and garnish with parsley.</li>
    //             </ol>
    //         `,
    //         image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&auto=format&fit=crop"
    //     },
    //     {
    //         id: 2,
    //         title: "Avocado Toast with Poached Egg",
    //         type: "Breakfast",
    //         cookTime: "15 mins",
    //         neededIngredients: "Bread, Avocado, Eggs, Lemon juice, Red pepper flakes, Salt",
    //         instructions: `
    //             <ol>
    //                 <li>Toast bread to desired crispness.</li>
    //                 <li>Mash avocado with lemon juice and salt.</li>
    //                 <li>Poach eggs in simmering water for 3-4 minutes.</li>
    //                 <li>Spread avocado on toast and top with poached egg.</li>
    //                 <li>Sprinkle with red pepper flakes and enjoy!</li>
    //             </ol>
    //         `,
    //         image: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=500&auto=format&fit=crop"
    //     },
    //     {
    //         id: 3,
    //         title: "Vegetable Stir Fry",
    //         type: "Vegetarian",
    //         cookTime: "20 mins",
    //         neededIngredients: "Broccoli, Bell peppers, Carrots, Soy sauce, Garlic, Ginger, Rice",
    //         instructions: `
    //             <ol>
    //                 <li>Cook rice according to package directions.</li>
    //                 <li>Heat oil in a wok or large pan over high heat.</li>
    //                 <li>Add minced garlic and ginger, stir for 30 seconds.</li>
    //                 <li>Add chopped vegetables and stir fry for 5-7 minutes.</li>
    //                 <li>Add soy sauce and toss to combine.</li>
    //                 <li>Serve over cooked rice.</li>
    //             </ol>
    //         `,
    //         image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop"
    //     }
    // ];



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

        // setRecipes(mockRecipes);
        // setTextInput('');
        // setLoading(false);
        // setShowRecipes(true);

        try {
        const res = await fetch(`http://localhost:5000/recipes/suggest?mood=${encodeURIComponent(textInput)}&username=${username}`);
        const data = await res.json();

        if (!res.ok) {
            console.error('Server responded with error:', data.error);
            alert(`Error: ${data.error}`);
            return;
        }

        if (data.recipes) {
            setRecipes(data.recipes);
            console.log('data.recipes:', data.recipes);
        } else {
            alert("No recipes found.");
            setRecipes([]);
        }
        setTextInput('');
        } catch (e) {
        console.error('failed to fetch recipes', e);
        alert('Failed getting recipes. Try again.');
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
    const SaveRecipe = async (e) => {
        e.preventDefault();
        // below code assumes we have these attributes!
        if (recipes.length === 0) {
            alert('No recipes to save. Please generate a recipe first.');
            return;
        }
        try {
            for (const recipe of recipes) { 
            const recipeData = {
                id: recipe.id, // do we need id?
                title: recipe.title,
                type: recipe.type,
                cookTime: recipe.cookTime,
                neededIngredients: recipe.neededIngredients,
                instructions: recipe.instructions,
                image: recipe.image
            };

            await addRecipe(username, recipeData);
          }
            alert('Recipe saved successfully!');
        } catch (error) {
            console.error('Failed to save recipe:', error);
            alert('Failed to save recipe. Please try again.');
        }

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
            <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 flex-wrap">
                <input
                type="text"
                placeholder="🥞 What's your mood today? 🍕"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="border border-gray-400 rounded-full px-5 py-3 w-80 text-base focus:outline-none focus:ring-2 focus:ring-green-400 text-center transition-all"
                />
                <Button
                type="submit"
                className="text-2xl px-5 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition flex items-center justify-center w-[52px] h-[52px]"
                >
                {loading ? (
                    <svg
                    className="animate-spin h-6 w-6 text-white"
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




            <div className="recipe-cards-container">
            {showRecipes && recipes.length > 0 ? (
            recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                <div className="recipe-image-container">
                    <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="recipe-image"
                    />
                </div>
                <div className="recipe-content">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <div className="recipe-meta">
                    <span className="recipe-type">{recipe.type}</span>
                    <span className="recipe-time">~{recipe.cookTime}</span>
                    </div>
                    <div className="recipe-details">
                    <h4>Ingredients</h4>
                    <p className="recipe-ingredients">{recipe.neededIngredients}</p>
                    {/* <h4>Instructions</h4>
                    <div className="recipe-instructions">
                        {parse(recipe.instructions)}
                    </div> */}
                    </div>
                    <div className="recipe-actions">
                    <button
                        className="save-recipe-btn"
                        onClick={SaveRecipe}
                    >
                        Save Recipe
                    </button>
                    </div>
                </div>
                </div>
            ))
            ) : (
            <p className="no-recipes-message">
                {showRecipes ? "No recipes found. Try a different mood!" : "Enter your mood to generate recipes!"}
            </p>
            )}
            </div>
                // <ul>
                // {recipes.map((recipe) => (
                //     <div key={recipe.id} className="border-4 border-black/50 p-5 rounded-xl m-5">
                //     <img
                //         src={recipe.image}
                //         alt={recipe.title}
                //         className="w-[300px] h-[200px] object-cover rounded-xl border-4 border-green-900 mx-auto mb-4"
                //     />
                //     <h3 className="text-2xl font-semibold">{recipe.title}</h3>
                //     <h4 className="opacity-70">Food Type: {recipe.type}</h4>
                //     <h4 className="opacity-70">Time: ~{recipe.cookTime}</h4>
                //     <h4 className="opacity-70 mb-2">Ingredients: {recipe.neededIngredients}</h4>
                //     <p className="mb-4">{parse(recipe.instructions)}</p>
                //     <div>
                //         <button
                //         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition hover:-translate-y-1"
                //         onClick={SaveRecipe}
                //         >
                //         Save Recipe
                //         </button>
                //     </div>
                //     </div>
                // ))}
                // </ul>
            )}
            </div>
        </div>
    );
}