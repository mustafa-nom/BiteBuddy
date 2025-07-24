import { useState } from 'react';

export default function Recipe(){

    const [textInput, setTextInput] = useState('');
    const [savedInput, setSavedInput] = useState('');


    // TODO sample data for the recipe card
    const generatedRecipe = [
        { 
            id: 1, 
            name: 'Chicken Alfredo', 
            cookTime: '30 mins', 
            instructions: "Step 1: Do this Step 2: Do that", 
            neededIngredients: "Pasta, Tomato Sauce, Chicken",
            img: "insert image url",
            type: "Main Dish"
        }
    ];

    // This will save the input for gemini to use after the user hits the submit button
    const handleSubmit = (e) => {
        e.preventDefault();
        if (textInput) {
            setSavedInput(textInput);
            setTextInput('');
        }
        else {
            alert('Please enter your mood or type of dish you want to eat.');
        }
    };

    return(
        // Everything will be inside this container
        <div className = "recipe-container">
            
            {/* This will hold the title such as RECIPE*/}
            <div className = "recipe-header">
                <h1>Recipes</h1>
            </div>

            {/* This will hold the user input button and the recipes that are output */}
            <div className = "recipe-content">

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

                {/* This is where are the generated recipes will go */}
                <div className = "generated-recipes">

                    {/* Placeholder card for what a recipe will look like */}
                    <div className = "recipe-card">
                        {generatedRecipe.map (recipe => (
                            <li key = {recipe.id} className = "recipe-card">
                                <img src = {recipe.img}></img>
                                <h3>{recipe.name}</h3>
                                <h4>{recipe.type}</h4>
                                <h4>{recipe.cookTime}</h4>
                                <h4>{recipe.neededIngredients}</h4>
                                <p>{recipe.instructions}</p>
                                <button className = "saveButton">Save Recipe</button>
                            </li>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}