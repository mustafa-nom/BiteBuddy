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
                <h1>Recipes</h1>
                <p>Generate a recipe based on your mood</p>
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

                {showRecipes ? (
                
                // This is where all the generated recipes will go
                <div className = "recipe-container">

                    {/* Placeholder card for what a recipe will look like */}
                    
                        {recipes.map (recipe => (
                            <div key = {recipe.id} className = "recipe-card">
                                <img src = {recipe.image}></img>
                                <h3>{recipe.title}</h3>

                                {/* This is not used because api doesnt give it
                                <h4>{recipe.type}</h4>
                                <h4>{recipe.cookTime}</h4>
                                <h4>{recipe.neededIngredients}</h4>
                                <p>{recipe.instructions}</p> */}
                                
                                <div className = "button-list">
                                    {/* TODO add a basic functionality to the buttons */}
                                    <button className = "view-btn" onClick={SaveRecipe}>Save Recipe</button>
                                    {/* <button className = "view-btn" onClick={ShuffleRecipe}>Shuffle Recipe</button> */}
                                </div>
                            </div>
                        ))}
                    
                </div>
                ) : (
                <p>Create recipe!</p>
                )}
            </div>
        </div>
    );
}