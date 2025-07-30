import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipes, getRecipeById, getUserData } from '../database';

// mock recipe data, what is important is the id of the recipe which is used as a key to find specifc recipes. recipes should be stored like this in database
// const mockRecipes = [
//     {
//         id: 1,
//         name: 'Oatmeal',
//         cookTime: '20 mins',
//         category: 'Vegetarian',
//         ingredients: [
//           '1/2 cup steel cut oats',
//           '1/2 cup water',
//           '1/2 cup milk',
//           '2 tbsp honey'
//         ],
//         instructions: [
//           'In a small pot, bring water to a boil',
//           'Add in oats',
//           'blah',
//           'blah',
//           'blah'
//         ]
//     },
//     {
//       id: 2,
//       name: 'Salad',
//       cookTime: '15 mins',
//       category: 'Vegetarian',
//       ingredients: [
//         '2 cups lettuce',
//         '1/2 cucumber',
//         '1/2 cup tomatoes',
//         '1/4 red onion',
//         '2 tbsp olive oil'
//       ],
//       instructions: [
//         'Wash all vegetables',
//         'Combine ingredients',
//         'blah',
//         'blah',
//         'blah'
//       ]
//     },
//     {
//       id: 3,
//       name: 'Chicken Alfredo Pasta',
//       cookTime: '30 mins',
//       category: 'Pasta',
//       ingredients: [
//         '8 oz fettuccine',
//         '2 chicken breasts',
//         '2 cups heavy cream',
//         '1/2 cup grated parmesan'
//       ],
//       instructions: [
//         'Cook pasta in a pot',
//         'Season chicken and cook in skillet until done',
//         'more instructions',
//         'more instructions',
//         'more instructions',
//         'more instructions'
//       ]
//     },
//   ];



export default function RecipeDetails() {

    // recipeID is from URL parameters, like /recipe/1
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userFridgeIngredients, setUserFridgeIngredients] = useState([]);
    const [missingIngredients, setMissingIngredients] = useState([]);
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    console.log('Loaded username:', username);
    //find the recipe in our mock data
    //const recipe = mockRecipes.find(r => r.id === parseInt(recipeId));

    // function to parse instructions into an array of strings to use the map function
   function parseInstructions(raw) {
    // If it's HTML with <li> tags
    const doc = new DOMParser().parseFromString(raw, 'text/html');
    const listItems = Array.from(doc.querySelectorAll('li')).map(li => li.textContent.trim());

    if (listItems.length > 0) return listItems;

    // Otherwise, assume it's plain text with \n breaks
    return raw.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

    function getMissingIngredients(recipeIngredients, userIngredients) {
        const missing = [];
        const neededIngredients = recipeIngredients.split(',').map(ing => ing.trim().toLowerCase());
        const userFridge = userIngredients.map(ing => ing.trim().toLowerCase());

        neededIngredients.forEach(ingredient => {
            if (!userFridge.includes(ingredient)) {
                missing.push(ingredient);
            }
        }
        )
        return missing;
    }



    // event handler for back button click to go to dashboard
    const handleBack = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!username) return;

            const matchedRecipe = await getRecipeById(username, recipeId)
            const userData = await getUserData(username);
            const fridgeIngredients = userData?.fridge_ingredients || [];
            setUserFridgeIngredients(fridgeIngredients);
            setMissingIngredients(getMissingIngredients(matchedRecipe.neededIngredients, fridgeIngredients));
            setRecipe(matchedRecipe);
            setLoading(false);
        };

        fetchRecipe();
    }, [username, recipeId]);

    if (loading) {
         return (
            <div className="recipe-details-container">
                <p> Loading... </p>
            </div>
        );
    }
    
    // if recipe is not found, allow the user to go back to dashboard
    if (!recipe) {
        return (
            <div className="recipe-details-container">
                <p> Recipe not found. </p>
                <button onClick={handleBack} className="back-btn"> 
                ← Back to Dashboard
                </button>
            </div>
        );
    }
    const steps = recipe?.instructions ? parseInstructions(recipe.instructions) : [];
    return (
        <div className="recipe-details-container">
            {/* button on top to go back to dashboard */}
            <button onClick = {handleBack} className="back-btn"> 
                    ← Back to Recipes
            </button>
            
            <div className="recipe-header">
                <h1 id="page-header">{recipe.name}</h1>

                <div className="recipe-info">
                    <span> ⏱️ {recipe.cookTime} </span>
                    <span> 🏷️ {recipe.type} </span>
                </div>
            </div>

            <div className="recipe-content">
                <div className="recipe-section">
                    <h2>Ingredients</h2>
                    <ul className="ingredients-list">
                        {recipe.neededIngredients.split(',').map((ingredient, index) => (
                            <li key={index}>
                            {ingredient.trim()}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="recipe-section">
                    <h2>Missing Ingredients</h2>
                    <ul className="ingredients-list">
                        {missingIngredients.length > 0 ? (
                            missingIngredients.map((ingredient, index) => (
                                <li key={index} style=   {{ color: "red" }}>
                                    {ingredient}
                                </li>
                            ))
                        ) : (
                            <li style={{color:"green"}}>You have all the ingredients!</li>
                        )}
                    </ul>
                </div>

                <div className="recipe-section">
                    <h2>Instructions</h2>
                    <ol className="instructions-list">
                        {steps.map((step, index) => (
                        <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>

            </div>
        </div>
    );
}