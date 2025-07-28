import { useState } from 'react';
import parse from 'html-react-parser';
import '../App.css';
import { Button } from '../components/ui/Button';

export default function Recipe(){

    const [textInput, setTextInput] = useState('');
    const [recipes, setRecipes] = useState([]);


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!textInput) {
            alert('Please enter your mood or type of dish you want to eat.');
            return
        }

        try {
            const res = await fetch(`http://localhost:5000/recipes/suggest?mood=${encodeURIComponent(textInput)}`);
            const data = await res.json();

            if (data.recipes) {
                setRecipes(data.recipes);
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
                        {recipes.map (recipe => (
                            <div key = {recipe.id} className = "recipe-card">
                                <h3>{recipe.title}</h3>
                                <img src = {recipe.image} alt={recipe.title}></img>
                                <h4>Type: {recipe.type}</h4>
                                <h4>Time required: ~{recipe.cookTime}</h4>
                                <h4>Ingredients: {recipe.neededIngredients}</h4>
                                    <div className="instructions">
                                        {parse(recipe.instructions)}
                                     </div>
                                <button className = "saveButton">Save Recipe</button>
                                <Button>Save Recipe</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}