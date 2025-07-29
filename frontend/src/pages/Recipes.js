import parse from 'html-react-parser';
import '../App.css';
import { Button } from '../components/ui/Button';
import { useEffect, useState } from 'react';
import { addDietaryRestriction, addIngredient, removeIngredient, getUserData, removeDietaryRestriction } from '../database.js';

export default function Recipe(){

    const [textInput, setTextInput] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [showRecipes, setShowRecipes] = useState(false);


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
        setShowRecipes(!showRecipes)
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

    return(
        // Everything will be inside this container
        <div className = "recipe-box">
            
            {/* This will hold the title such as RECIPE*/}
            <div className = "recipe-header">
                <h1 id="page-header">Recipes</h1>
                <p id="recipe-instruct">🍎 Generate a recipe based on your mood 🍎</p>
            </div>

            {/* This will hold the user input button and the recipes that are output */}
            <div>

                {/* The input box for the user */}
                <div className = "input-box">
                    <form onSubmit={handleSubmit}>
                        <input
                        type="text"
                        placeholder="What are you in the mood for today? 🍕🥞🍖🍣"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        />
                        <button type = "submit">🥄</button>
                    </form>
                    
                </div>
            </div>
<<<<<<< HEAD
            <div className="recipe-container">
                {/* Show this message when recipes are empty and the user hasn't generated anything yet */}
                {recipes.length === 0 && !showRecipes && (
                    <p id="empty-text">No recipes, put in your mood to get some recipes!</p>
                )}
=======
                <div className="recipe-container">
                    {/* Show this message when recipes are empty and the user hasn't generated anything yet */}
                    {recipes.length === 0 && !showRecipes && (
                        <p id="empty-text">No recipes generated yet. Put in your mood to get some recipes!</p>
                    )}
>>>>>>> eae031cf02407f170d721c3807d1d1b7e1df7e0e

                {/* Show this section only after the user submits (showRecipes becomes true) */}
                {showRecipes && recipes.length > 0 && (
                    <ul>
                        {recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            <img src={recipe.image} alt={recipe.title} />
                            <h3 className = "text-2xl font-semibold">{recipe.title}</h3>
                            <h4>Food Type: {recipe.type}</h4>
                            <h4>Time: ~{recipe.cookTime}</h4>
                            <h4>Ingredients: {recipe.neededIngredients}</h4>
                            <p>{parse(recipe.instructions)}</p>

                                <div className="button-list">
                                    <button className="view-btn" onClick={SaveRecipe}>Save Recipe</button>
                                    {/* <button className="view-btn" onClick={ShuffleRecipe}>Shuffle Recipe</button> */}
                                </div>
                        </div>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}